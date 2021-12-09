import { Router } from 'express';
import { getTransactionsFromTokenId, countHolderFromTokenId, getLastTransactions, getAllTransactionsOfHolder, getAllBalancesOfHolder } from '../controllers/transactions';
const router = Router();

router.get('/getfromtokenid', getTransactionsFromTokenId);
router.get('/countholder', countHolderFromTokenId);
router.get('/last', getLastTransactions);
router.get('/all', getAllTransactionsOfHolder);
router.get('/balances', getAllBalancesOfHolder);

export default router;
