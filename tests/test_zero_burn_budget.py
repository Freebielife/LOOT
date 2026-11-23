import unittest
from unittest.mock import patch
import observatory

class ZeroBurnBudgetTests(unittest.TestCase):
    def test_timeout_does_not_claim_complete_coverage(self):
        with patch.object(observatory.time, 'monotonic', side_effect=[0, 0, 91]), patch.object(observatory, 'fetch', return_value={'jetton_transfers':[{}]}), patch.object(observatory, 'to_zero') as verify:
            with self.assertRaisesRegex(RuntimeError, 'time budget'):
                observatory.zero_burns({'asOf':1000, 'rows':[]},2000)
            verify.assert_not_called()

    def test_verified_empty_scan_is_distinct_from_timeout(self):
        with patch.object(observatory.time, 'monotonic', return_value=0), patch.object(observatory, 'fetch', return_value={'jetton_transfers':[]}):
            self.assertEqual(observatory.zero_burns({},2000), {'asOf':2000,'rows':[]})
