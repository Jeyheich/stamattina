import io
import json
import tempfile
import unittest
from pathlib import Path
from verify_publication import verify, record_publication


class PublicationTests(unittest.TestCase):
    def setUp(self):
        self.expected = dict(id='fixture-edition', collectionId='2026-11-04-mattina',
                             editionDate='2026-11-04', leadIds=list(range(5)),
                             compactIds=list(range(5, 40)), reserveIds=list(range(40, 80)))

    def test_exact_public_json_and_cache_bypass(self):
        def opener(request, timeout):
            self.assertIn('?verify=', request.full_url)
            self.assertEqual(request.get_header('Cache-control'), 'no-cache')
            return io.BytesIO(json.dumps(self.expected).encode())
        self.assertTrue(verify(self.expected, attempts=1, opener=opener))

    def test_wrong_cycle_or_modified_json_rejected(self):
        for patch in ({'collectionId': '2026-11-04-pomeriggio'}, {'reserveIds': []}):
            actual = dict(self.expected, **patch)
            with self.assertRaises(RuntimeError):
                verify(self.expected, attempts=1,
                       opener=lambda *args, **kwargs: io.BytesIO(json.dumps(actual).encode()))

    def test_public_morning_does_not_mark_preparing_afternoon(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            state = dict(collectionId='2026-11-04-pomeriggio', ready=False,
                         editorialComplete=False, missing=['sport'])
            file = root / 'status.json'
            file.write_text(json.dumps(state))
            proof = record_publication(self.expected, 'real-check-timestamp-fixture', root)
            self.assertEqual(json.loads(file.read_text()), state)
            self.assertEqual(proof['publicCollectionId'], '2026-11-04-mattina')
            self.assertEqual(proof['baseCount'], 40)
            self.assertEqual(proof['reserveCount'], 40)

    def test_matching_partial_edition_is_explicitly_incomplete(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            state = dict(collectionId=self.expected['collectionId'], editionId=self.expected['id'],
                         ready=True, editorialComplete=False, reserveMissing=['sport'])
            (root / 'status.json').write_text(json.dumps(state))
            record_publication(self.expected, 'fixture', root)
            saved = json.loads((root / 'status.json').read_text())
            self.assertEqual(saved['publication'], 'verified')
            self.assertEqual(saved['message'], 'Edizione online, aggiuntive incomplete: sport')
            self.assertFalse(saved['editorialComplete'])


if __name__ == '__main__':
    unittest.main()
