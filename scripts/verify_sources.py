"""Publication gate. Checks access and Commons metadata; editorial fact checking stays upstream."""
import concurrent.futures, datetime as dt, html, ipaddress, json, re, socket, sys, urllib.parse, urllib.request
from zoneinfo import ZoneInfo
UA = 'Stamattina/1.0 (https://github.com/Jeyheich/stamattina; personal briefing)'
NOW = dt.datetime.now(dt.timezone.utc)

def public_url(url):
    p = urllib.parse.urlsplit(url)
    if p.scheme != 'https' or not p.hostname or p.username or p.password or p.port not in (None, 443):
        raise ValueError('URL non HTTPS pubblico')
    for address in socket.getaddrinfo(p.hostname, 443, type=socket.SOCK_STREAM):
        if not ipaddress.ip_address(address[4][0]).is_global:
            raise ValueError('Destinazione non pubblica')
    return url

class PublicRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        public_url(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def fetch(url, limit=1600000):
    public_url(url)
    opener = urllib.request.build_opener(PublicRedirect())
    with opener.open(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=20) as r:
        public_url(r.url)
        return r.headers.get('Content-Type', ''), r.read(limit), r.url

def instant(value):
    d = dt.datetime.fromisoformat(value.replace('Z', '+00:00'))
    return d.replace(tzinfo=dt.timezone.utc) if d.tzinfo is None else d

def check_article(a):
    source = a['source']
    for key in ('accessCheckedAt', 'verifiedAt'):
        value = source[key] if key == 'accessCheckedAt' else a[key]
        age = (NOW - instant(value)).total_seconds()
        if not -300 <= age <= 10800:
            raise ValueError(a['id'] + ': verifica non recente o futura')
    if a.get('dateKind') != 'event' and instant(a['publishedAt']) > NOW + dt.timedelta(minutes=5):
        raise ValueError(a['id'] + ': data editoriale futura')
    if len(source.get('dateEvidence', '')) < 20:
        raise ValueError(a['id'] + ': evidenza data insufficiente')
    typ, raw, final = fetch(source['url'])
    if 'pdf' not in typ.lower():
        text = raw.decode('utf-8', errors='replace')
        if re.search(r'"isAccessibleForFree"\s*:\s*(?:false|"false")', text, re.I):
            raise ValueError(a['id'] + ': fonte segnalata come non gratuita')
        visible = html.unescape(re.sub(r'<[^>]+>', ' ', re.sub(r'<(script|style)\b.*?</\1>', '', text, flags=re.S | re.I)))
        if len(re.sub(r'\s+', ' ', visible).strip()) < 200:
            raise ValueError(a['id'] + ': contenuto verificabile insufficiente')
    return a['id'] + ': fonte raggiungibile'

def check_photo(a):
    im = a['image']
    parsed = urllib.parse.urlsplit(im['sourceUrl'])
    path = urllib.parse.unquote(parsed.path)
    if parsed.hostname != 'commons.wikimedia.org' or not path.startswith('/wiki/File:'):
        raise ValueError(a['id'] + ': per la routine usare foto Commons con metadati verificabili')
    filename = path.split('/wiki/File:', 1)[1].replace(' ', '_')
    query = urllib.parse.urlencode({'action':'query','format':'json','prop':'imageinfo','titles':'File:'+filename,'iiprop':'url|extmetadata'})
    _, raw, _ = fetch('https://commons.wikimedia.org/w/api.php?' + query)
    data = json.loads(raw)
    info = next(iter(data['query']['pages'].values()))['imageinfo'][0]
    metadata = info['extmetadata']
    license_name = metadata.get('LicenseShortName', {}).get('value', '')
    if not (license_name.startswith('CC BY') or license_name.startswith('CC0') or license_name == 'Public domain') or any(x in license_name for x in ('-NC', '-ND')):
        raise ValueError(a['id'] + ': licenza foto non approvata')
    if im['rights'].strip().casefold() != license_name.strip().casefold():
        raise ValueError(a['id'] + ': licenza dichiarata diversa dai metadati Commons')
    artist = html.unescape(re.sub('<[^>]+>', '', metadata.get('Artist', {}).get('value', ''))).strip().casefold()
    credit = im['credit'].strip().casefold()
    if not artist or min(len(artist), len(credit)) < 3 or not (artist in credit or credit in artist):
        raise ValueError(a['id'] + ': attribuzione foto da verificare')
    details = json.dumps(metadata, ensure_ascii=False).casefold()
    if 'ai-generated' in details or 'ai generated' in details:
        raise ValueError(a['id'] + ': fotografia generativa non ammessa')
    if urllib.parse.urlsplit(im['src']).hostname not in ('upload.wikimedia.org', 'thumb.wikimedia.org') or filename not in urllib.parse.unquote(im['src']).replace(' ', '_'):
        raise ValueError(a['id'] + ': immagine non corrispondente alla pagina Commons')
    typ, body, _ = fetch(im['src'], limit=32)
    if not typ.startswith('image/') or not body:
        raise ValueError(a['id'] + ': foto non raggiungibile')
    if not im.get('caption') or not im.get('reuseApproved'):
        raise ValueError(a['id'] + ': manca didascalia o approvazione riuso')
    return a['id'] + ': fotografia e licenza verificate'

def verify(edition):
    if edition['mode'] != 'live' or edition['editionDate'] != NOW.astimezone(ZoneInfo('Europe/Rome')).date().isoformat():
        raise ValueError('Edizione non reale o non corrispondente a oggi a Roma')
    if not -300 <= (NOW - instant(edition['generatedAt'])).total_seconds() <= 10800:
        raise ValueError('Edizione preparata troppo tempo fa o con ora futura')
    articles = edition['articles']
    ids = {a['id'] for a in articles}
    if len(ids) != len(articles) or set(edition['essentialIds']) != set(edition['leadIds']):
        raise ValueError('Id duplicati o essenziali diversi dalle principali')
    if len({a['category'] for a in articles}) != 7:
        raise ValueError('Non sono coperte tutte le sette categorie')
    jobs = [(check_article, a) for a in articles] + [(check_photo, a) for a in articles if a['id'] in edition['leadIds']]
    errors = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        pending = {pool.submit(fn, a): (fn.__name__, a["id"]) for fn, a in jobs}
        for result in concurrent.futures.as_completed(pending):
            try:
                print(result.result())
            except Exception as exc:
                errors.append(": ".join(pending[result]) + ": " + str(exc))
    if errors:
        raise ValueError('Pubblicazione bloccata: ' + '; '.join(errors))
    print('Controlli fonti/fotografie superati; la verifica editoriale automatizzata resta necessaria.')

if __name__ == '__main__':
    try:
        verify(json.load(open(sys.argv[1], encoding='utf-8')))
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
