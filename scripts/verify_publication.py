"""Verify the exact deployed edition; no browser, AI call or credentials."""
import datetime as dt
import json
import time
import urllib.request
from pathlib import Path

URL = 'https://jeyheich.github.io/stamattina/data/current.json'

def verify(expected, attempts=8, delay=4, opener=urllib.request.urlopen, sleeper=time.sleep):
    error = 'Edizione non ancora disponibile'
    for attempt in range(attempts):
        try:
            request = urllib.request.Request(URL + '?verify=' + str(time.time_ns()),
                headers={'Cache-Control': 'no-cache', 'User-Agent': 'Stamattina-publication-check/1.0'})
            with opener(request, timeout=15) as response:
                actual = json.load(response)
            if actual == expected:
                return dt.datetime.now(dt.timezone.utc).isoformat()
            error = 'La URL pubblica non espone ancora la stessa edizione: ' + str(actual.get('id'))
        except Exception as exc:
            error = str(exc)
        if attempt + 1 < attempts:
            sleeper(delay)
    raise RuntimeError(error)

def record_publication(expected, checked, root=Path('automation/editorial')):
    """Public reachability is distinct from freshness/completeness of a preparing cycle."""
    cycle = expected.get('collectionId', '')
    day, slot = cycle.rsplit('-', 1)
    if slot not in ('mattina', 'pomeriggio') or day != expected['editionDate']:
        raise RuntimeError('collectionId pubblico non valido')
    root = Path(root)
    proof = dict(publicVerifiedAt=checked, publicEditionId=expected['id'],
                 publicCollectionId=cycle, publication='verified',
                 baseCount=len(expected['leadIds']) + len(expected['compactIds']),
                 reserveCount=len(expected.get('reserveIds', [])))
    root.mkdir(parents=True, exist_ok=True)
    (root / 'publication.json').write_text(json.dumps(proof, ensure_ascii=False, indent=2) + '\n')
    for file in (root / 'status.json', root / day / slot / 'status.json'):
        if not file.exists():
            continue
        state = json.loads(file.read_text())
        if not state.get('ready') or state.get('collectionId') != cycle or state.get('editionId') != expected['id']:
            continue
        state.update(publicVerifiedAt=checked, publicEditionId=expected['id'],
                     publicCollectionId=cycle, publication='verified', needsPublication=False)
        state['message'] = ('Rassegna completa online: 40 principali e 40 aggiuntive'
                            if state.get('editorialComplete') and not state.get('reserveMissing')
                            else 'Edizione online, aggiuntive incomplete: ' + ', '.join(state.get('reserveMissing', [])))
        file.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
    return proof


if __name__ == '__main__':
    expected = json.loads(Path('dist/data/current.json').read_text())
    checked = verify(expected)
    print(json.dumps(record_publication(expected, checked), ensure_ascii=False))
