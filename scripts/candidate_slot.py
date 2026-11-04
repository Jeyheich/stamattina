"""Choose the latest due Rome collection slot; tolerate delayed Actions starts."""
import datetime as dt
import json
import os
from pathlib import Path
from zoneinfo import ZoneInfo

ROME = ZoneInfo('Europe/Rome')


def should_collect(now, generated_at=None, manual=False):
    if manual:
        return True
    local = now.astimezone(ROME)
    slots = [dt.datetime.combine(local.date() - dt.timedelta(days=days),
             dt.time(hour), ROME) for days in (0, 1) for hour in (6, 16)]
    due = max(slot for slot in slots if slot <= local)
    try:
        generated = dt.datetime.fromisoformat(generated_at.replace("Z", "+00:00"))
        if generated.tzinfo is None or generated > now:
            return True
        return generated.astimezone(dt.timezone.utc) < due.astimezone(dt.timezone.utc)
    except (AttributeError, TypeError, ValueError):
        return True


if __name__ == '__main__':
    try:
        generated = json.loads(Path('automation/candidates/latest.json').read_text()).get('generatedAt')
    except (OSError, ValueError):
        generated = None
    run = should_collect(dt.datetime.now(dt.timezone.utc), generated,
                         os.environ.get('EVENT_NAME') == 'workflow_dispatch')
    with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
        output.write('run=' + str(run).lower() + '\n')
    print('Raccolta necessaria: ' + str(run).lower())
