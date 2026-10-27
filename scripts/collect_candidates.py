"""Read-only RSS intake. Produces research candidates, NEVER a publishable edition.

Standard library only. No scheduler, GitHub credentials or repository writes.
The caller must explicitly choose a local output path.
"""
import argparse
import concurrent.futures
import datetime as dt
import email.utils
import hashlib
import html
import json
import re
import time
import threading
import unicodedata
import urllib.error
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

from verify_sources import fetch, check_photo

CATEGORIES = ('Politica', 'Esteri', 'Economia', 'Cronaca', 'Roma',
              'Cultura · Teatro · Cinema', 'Tecnologia · AI', 'Sport')
FEEDS = (
    ('Politica', 'RaiNews', 'https://www.rainews.it/rss/politica'),
    ('Politica', 'Sky TG24', 'https://tg24.sky.it/rss/tg24_flipboard.politica.xml'),
    ('Politica', 'Open', 'https://www.open.online/feed/'),
    ('Esteri', 'RaiNews', 'https://www.rainews.it/rss/esteri'),
    ('Economia', 'AGI', 'https://www.agi.it/economia/rss.xml'),
    ('Economia', 'BBC Business', 'https://feeds.bbci.co.uk/news/business/rss.xml'),
    ('Economia', 'The Guardian Business', 'https://www.theguardian.com/uk/business/rss'),
    ('Cronaca', 'RaiNews', 'https://www.rainews.it/rss/cronaca'),
    ('Cronaca', 'Sky TG24', 'https://tg24.sky.it/rss/tg24_flipboard.cronaca.xml'),
    ('Roma', 'RomaToday', 'https://www.romatoday.it/rss'),
    ('Roma', 'Leggo Roma', 'https://www.leggo.it/rss/home.xml'),
    ('Cultura · Teatro · Cinema', 'Teatro e Critica', 'https://www.teatroecritica.net/feed/'),
    ('Tecnologia · AI', 'HDblog', 'https://www.hdblog.it/feed/'),
    ('Tecnologia · AI', 'BBC Technology', 'https://feeds.bbci.co.uk/news/technology/rss.xml'),
    ('Tecnologia · AI', 'The Guardian Technology', 'https://www.theguardian.com/uk/technology/rss'),
    ('Sport', 'RaiNews', 'https://www.rainews.it/rss/sport'),
    ('Sport', 'Sky Sport', 'https://sport.sky.it/rss/sport.xml'),
    ('Sport', 'Leggo Sport', 'https://www.leggo.it/rss/sport.xml'),
)
NOW = dt.datetime.now(dt.timezone.utc)
HOST_LOCKS = {}
HOST_LOCK = threading.Lock()
HOST_BLOCKED = set()

def plain(value):
    return re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', value or ''))).strip()

def canonical(url):
    p = urllib.parse.urlsplit(url)
    query = [(k, v) for k, v in urllib.parse.parse_qsl(p.query, keep_blank_values=True)
             if not k.lower().startswith('utm_') and k.lower() not in ('fbclid', 'gclid')]
    return urllib.parse.urlunsplit((p.scheme.lower(), p.netloc.lower(), p.path,
                                   urllib.parse.urlencode(query), ''))

def tokens(title):
    title = ''.join(c for c in unicodedata.normalize('NFKD', title.casefold())
                    if not unicodedata.combining(c))
    return set(re.findall(r'\b[a-z0-9]{4,}\b', title))

def similar(a, b):
    left, right = tokens(a), tokens(b)
    return bool(left and right) and len(left & right) / len(left | right) >= .55

def feed_date(value):
    # Sky and Leggo use Italian RFC-like weekdays/months; preserve original evidence.
    replacements = {'lun':'Mon','mar':'Tue','mer':'Wed','gio':'Thu','ven':'Fri',
                    'sab':'Sat','dom':'Sun','gen':'Jan','feb':'Feb','mag':'May',
                    'giu':'Jun','lug':'Jul','ago':'Aug','set':'Sep','ott':'Oct','dic':'Dec'}
    value = re.sub(r'\b[a-z]{3}\b', lambda m: replacements.get(m.group(), m.group()), value)
    return email.utils.parsedate_to_datetime(value)

def eligible(category, source, title, url):
    text = (title + ' ' + url).casefold()
    if category in ('Politica', 'Cronaca') and ('/tgr/' in url or 'tgr ' in source.casefold()):
        return False
    if source == 'Open' and not re.search(r'politic|governo|parlamento|manovra|meloni|salvini|schlein|elezion|ministr', text):
        return False
    # Leggo's generic feed is not a reliable dedicated Rome feed: retain only explicit local matches.
    if source == 'Leggo Roma' and not re.search(r'\broma\b|romano|romani|romana|romane|/roma/|ostia|fiumicino|atac|campidoglio', text):
        return False
    if category == 'Sport':
        if re.search(r'cricket|\bnfl\b|cowboys|eagles|\bnba\b|super-bowl', text):
            return False
        return bool(re.search(r'calcio|serie[- ]?[ab]|champions|europa.league|nazionale|azzurr|formula[- ]?1|\bf1\b|tennis|sinner|paolini|berrettini|musetti|pallavolo|volley|nuoto|atletica|ciclismo|basket|rugby', text))
    return True

def editorial_rank(candidate):
    if candidate['category'] != 'Sport':
        return 0
    text = (candidate['title'] + ' ' + candidate['url']).casefold()
    if re.search(r'calcio|serie[- ]?[ab]|champions|europa.league', text):
        return 0
    if re.search(r'formula[- ]?1|\bf1\b|tennis|sinner|paolini|berrettini|musetti', text):
        return 1
    return 2

def request(url):
    host = urllib.parse.urlsplit(url).hostname
    with HOST_LOCK:
        lock = HOST_LOCKS.setdefault(host, threading.Lock())
    with lock:
        if host in HOST_BLOCKED:
            raise RuntimeError('Editore temporaneamente limitato dopo HTTP 429; uso alternative')
        for attempt in range(2):
            try:
                time.sleep(.2)
                return fetch(url)
            except urllib.error.HTTPError as exc:
                if attempt and exc.code == 429:
                    HOST_BLOCKED.add(host)
                if attempt or exc.code not in (429, 500, 502, 503, 504):
                    raise
                time.sleep(5 if exc.code == 429 else 1)
            except (TimeoutError, urllib.error.URLError):
                if attempt:
                    raise
                time.sleep(1)

def read_feed(spec, age_hours):
    category, source, url = spec
    try:
        _, raw, _ = request(url)
        root = ET.fromstring(raw)
        candidates = []
        for item in root.findall('.//item'):
            title = plain(item.findtext('title'))
            link = (item.findtext('link') or item.findtext('guid') or '').strip()
            date_text = item.findtext('pubDate', '')
            if not title or not link or re.search(r'#?(?:adv|sponsor)|offerte|promozioni', title, re.I):
                continue
            try:
                published = feed_date(date_text)
                if published.tzinfo is None:
                    continue
                age = (NOW - published).total_seconds() / 3600
                if not 0 <= age <= age_hours:
                    continue
                link = canonical(link)
                if not link.startswith('https://') or not eligible(category, source, title, link):
                    continue
            except (ValueError, TypeError):
                continue
            assigned = category
            if source == 'RomaToday' and '/eventi/' in link:
                assigned = 'Cultura · Teatro · Cinema'
            candidates.append(dict(
                id=hashlib.sha256(link.encode()).hexdigest()[:16],
                category=assigned, title=title, url=link, source=source,
                publishedAt=published.isoformat(), dateEvidence='RSS pubDate: ' + date_text,
                ageHours=round(age, 2), feed=url, status='candidate',
                editorialReviewRequired=True,
                feedExcerpt=' '.join(plain(item.findtext('description')).split()[:max(0, 25-len(title.split()))])))
        return candidates, None
    except Exception as exc:
        return [], dict(feed=url, error=str(exc))

def check_access(candidate):
    try:
        typ, raw, final = request(candidate['url'])
        page = raw.decode('utf-8', errors='replace')
        if 'html' not in typ.lower():
            raise ValueError('Pagina HTML non disponibile')
        if re.search(r'"isAccessibleForFree"\s*:\s*(?:false|"false")', page, re.I):
            raise ValueError('Indicatore di accesso non gratuito')
        # HTTP access is evidence only, not a claim of editorial verification.
        if len(plain(re.sub(r'<(script|style)\b.*?</\1>', '', page, flags=re.S | re.I))) < 200:
            raise ValueError('Contenuto insufficiente')
        candidate.update(accessCheckedAt=dt.datetime.now(dt.timezone.utc).isoformat(),
                         finalUrl=final, accessCheck='http-ok-editorial-review-pending')
        return candidate, None
    except Exception as exc:
        return None, dict(url=candidate['url'], error=str(exc))

def collect_photo_refs():
    source = Path('automation/photo-library.json')
    if not source.exists():
        return [], []
    refs, errors = [], []
    for reference in json.loads(source.read_text()).get('photos', []):
        try:
            check_photo({'id': 'reference-' + reference['key'], 'image': reference['image']})
            refs.append(dict(reference, technicalCheckedAt=dt.datetime.now(dt.timezone.utc).isoformat(),
                             technicalCheck='commons-license-author-image-access-ok'))
        except Exception as exc:
            errors.append(dict(photo=reference['key'], error=str(exc)))
    return refs, errors

def collect(age_hours=72, verify_pages=False, limit=12):
    candidates, errors = [], []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for items, error in pool.map(lambda spec: read_feed(spec, age_hours), FEEDS):
            candidates.extend(items)
            if error:
                errors.append(error)
    unique = []
    for candidate in sorted(candidates, key=lambda x: dt.datetime.fromisoformat(x['publishedAt']), reverse=True):
        if any(candidate['url'] == old['url'] or similar(candidate['title'], old['title']) for old in unique):
            continue
        per_source = sum(old['category'] == candidate['category'] and old['source'] == candidate['source'] for old in unique)
        # Retain alternative sources for fragile feeds instead of filling the
        # whole queue from a single publisher before checking its access.
        if per_source < limit and sum(old['category'] == candidate['category'] for old in unique) < limit * 3:
            unique.append(candidate)
    if verify_pages:
        checked = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for candidate, error in pool.map(check_access, unique):
                if candidate:
                    checked.append(candidate)
                if error:
                    errors.append(error)
        unique = checked
    selected = []
    for candidate in sorted(unique, key=editorial_rank):
        if sum(old['category'] == candidate['category'] for old in selected) < limit:
            selected.append(candidate)
    unique = selected
    photo_refs, photo_errors = collect_photo_refs() if verify_pages else ([], [])
    errors.extend(photo_errors)
    counts = {category: sum(x['category'] == category for x in unique) for category in CATEGORIES}
    return dict(kind='research-candidates-not-an-edition', generatedAt=NOW.isoformat(),
                ageLimitHours=age_hours, pageAccessChecked=verify_pages,
                editorialReviewRequired=True, semanticDeduplicationRequired=True,
                counts=counts, insufficientCategories=[c for c, n in counts.items() if n < 5],
                candidates=unique, photoReferences=photo_refs, errors=errors)

def serialize_report(report):
    """Keep categories together and publish line ranges for bounded AI reads."""
    header = {k: v for k, v in report.items() if k not in ('candidates', 'errors', 'photoReferences')}
    header['categoryLineRanges'] = {c: {'start': 0, 'end': 0} for c in CATEGORIES}
    header['photoReferencesLineRange'] = {'start': 0, 'end': 0}
    header['candidates'] = sorted(report['candidates'], key=lambda a: CATEGORIES.index(a['category']))
    header['photoReferences'] = report.get('photoReferences', [])
    header['errors'] = report['errors']
    lines = json.dumps(header, ensure_ascii=False, indent=2).splitlines()
    objects = []
    for i, line in enumerate(lines):
        if line.startswith('      "category": '):
            category = json.loads(line.strip().removesuffix(',').split(': ', 1)[1])
            start = i
            while lines[start] != '    {':
                start -= 1
            objects.append((category, start + 1))
    for j, (category, start) in enumerate(objects):
        if j + 1 < len(objects):
            end = objects[j + 1][1] - 1
        else:
            end = next(i for i in range(start, len(lines)) if lines[i] == '  ],')
        bounds = header['categoryLineRanges'][category]
        if not bounds['start']:
            bounds['start'] = start
        bounds['end'] = end
    header['photoReferencesLineRange'] = {
        'start': next(i + 1 for i, line in enumerate(lines) if line.startswith('  "photoReferences":')),
        'end': next(i for i, line in enumerate(lines) if line.startswith('  "errors":')),
    }
    # Replacing numeric placeholders does not alter line positions.
    return json.dumps(header, ensure_ascii=False, indent=2) + '\n'

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--verify-pages', action='store_true')
    parser.add_argument('--age-hours', type=int, default=72)
    parser.add_argument('--limit', type=int, default=12)
    args = parser.parse_args()
    if not 1 <= args.age_hours <= 168 or args.limit < 5:
        parser.error('Intervallo massimo 168 ore; almeno 5 candidati per categoria')
    report = collect(args.age_hours, args.verify_pages, args.limit)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(serialize_report(report))
    print(json.dumps(dict(counts=report['counts'], insufficient=report['insufficientCategories'],
                          errors=len(report['errors']), output=str(args.output)), ensure_ascii=False))
    if report['insufficientCategories']:
        print(json.dumps({'sourceErrors': report['errors']}, ensure_ascii=False))
        raise SystemExit(2)
