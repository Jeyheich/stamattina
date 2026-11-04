import datetime as dt
import unittest
from candidate_slot import should_collect


class SlotTests(unittest.TestCase):
    def check(self, now, generated, expected):
        self.assertEqual(should_collect(dt.datetime.fromisoformat(now.replace("Z", "+00:00")), generated), expected)

    def test_delayed_and_duplicate(self):
        self.check('2026-11-03T11:33:00Z', '2026-10-27T12:29:50+00:00', True)
        self.check('2026-11-03T11:33:00Z', '2026-11-03T05:10:00+00:00', False)
        self.check('2026-11-03T20:23:00Z', '2026-11-03T05:10:00+00:00', True)
        self.check('2026-11-03T20:23:00Z', '2026-11-03T15:10:00+00:00', False)

    def test_dst_and_before_first_slot(self):
        self.check('2026-07-03T04:00:00Z', '2026-07-02T14:10:00+00:00', True)
        self.check('2026-07-03T05:00:00Z', '2026-07-03T04:10:00+00:00', False)
        self.check('2026-11-04T04:00:00Z', '2026-11-03T15:10:00+00:00', False)

    def test_missing_invalid_and_manual(self):
        now = dt.datetime.fromisoformat('2026-11-04T10:00:00+00:00')
        for value in (None, 'bad', '2026-11-04T06:00:00', '2026-11-05T06:00:00Z'):
            self.assertTrue(should_collect(now, value))
        self.assertTrue(should_collect(now, now.isoformat(), manual=True))


if __name__ == '__main__':
    unittest.main()
