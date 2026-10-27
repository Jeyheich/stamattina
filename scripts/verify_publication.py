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

if __name__ == '__main__':
    expected = json.loads(Path('dist/data/current.json').read_text())
    checked = verify(expected)
    file = Path('automation/editorial/status.json')
    state = json.loads(file.read_text())
    state.update(publicVerifiedAt=checked, publicEditionId=expected['id'], publication='verified', needsPublication=False)
    file.write_text(json.dumps(state, ensure_ascii=False, indent=2) + '\n')
    print('Edizione pubblica verificata: ' + expected['id'])
