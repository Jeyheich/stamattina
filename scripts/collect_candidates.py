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

from verify_sources import fetch

CATEGORIES = ('Politica', 'Esteri', 'Economia', 'Cronaca', 'Roma',
              'Cultura · Teatro · Cinema', 'Tecnologia · AI', 'Sport')
FEEDS = (
    ('Politica', 'RaiNews', 'https://www.rainews.it/rss/politica'),
    ('Esteri', 'RaiNews', 'https://www.rainews.it/rss/esteri'),
    ('Economia', 'AGI', 'https://www.agi.it/economia/rss.xml'),
    ('Cronaca', 'RaiNews', 'https://www.rainews.it/rss/cronaca'),
    ('Roma', 'RomaToday', 'https://www.romatoday.it/rss'),
    ('Cultura · Teatro · Cinema', 'Teatro e Critica', 'https://www.teatroecritica.net/feed/'),
    ('Tecnologia · AI', 'HDblog', 'https://www.hdblog.it/feed/'),
    ('Tecnologia · AI', 'BBC Technology', 'https://feeds.bbci.co.uk/news/technology/rss.xml'),
    ('Sport', 'RaiNews', 'https://www.rainews.it/rss/sport'),
    ('Sport', 'BBC Sport', 'https://feeds.bbci.co.uk/sport/rss.xml?edition=uk'),
)
NOW = dt.datetime.now(dt.timezone.utc)
HOST_LOCKS = {}
HOST_LOCK = threading.Lock()

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

def request(url):
    host = urllib.parse.urlsplit(url).hostname
    with HOST_LOCK:
        lock = HOST_LOCKS.setdefault(host, threading.Lock())
    with lock:
        for attempt in range(2):
            try:
                time.sleep(.2)
                return fetch(url)
            except urllib.error.HTTPError as exc:
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
            title, link = plain(item.findtext('title')), item.findtext('link', '').strip()
            date_text = item.findtext('pubDate', '')
            if not title or not link or re.search(r'#?(?:adv|sponsor)|offerte|promozioni', title, re.I):
                continue
            try:
                published = email.utils.parsedate_to_datetime(date_text)
                if published.tzinfo is None:
                    continue
                age = (NOW - published).total_seconds() / 3600
                if not 0 <= age <= age_hours:
                    continue
                link = canonical(link)
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
        cap = max(5, limit // 2) if candidate['category'] in ('Sport', 'Tecnologia · AI') else limit
        if per_source < cap and sum(old['category'] == candidate['category'] for old in unique) < limit:
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
    counts = {category: sum(x['category'] == category for x in unique) for category in CATEGORIES}
    return dict(kind='research-candidates-not-an-edition', generatedAt=NOW.isoformat(),
                ageLimitHours=age_hours, pageAccessChecked=verify_pages,
                editorialReviewRequired=True, semanticDeduplicationRequired=True,
                counts=counts, insufficientCategories=[c for c, n in counts.items() if n < 5],
                candidates=unique, errors=errors)

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
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(dict(counts=report['counts'], insufficient=report['insufficientCategories'],
                          errors=len(report['errors']), output=str(args.output)), ensure_ascii=False))
    if report['insufficientCategories']:
        raise SystemExit(2)
