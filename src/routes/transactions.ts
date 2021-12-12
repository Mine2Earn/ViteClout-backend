import { Router } from 'express';
import {
    getTransactionsFromTokenId,
    countHolderFromTokenId,
    getLastTransactions,
    getAllTransactionsOfHolder,
    getAllBalancesOfHolder,
    getAllTokenInfo
} from '../controllers/transactions';
const router = Router();

router.get('/getfromtokenid', getTransactionsFromTokenId);
router.get('/countholder', countHolderFromTokenId);
router.get('/last', getLastTransactions);
router.get('/all', getAllTransactionsOfHolder);
router.get('/balances', getAllBalancesOfHolder);
router.get('/getalltokeninfo', getAllTokenInfo);

export default router;
