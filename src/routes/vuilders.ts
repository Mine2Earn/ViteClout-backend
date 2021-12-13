import { Router } from 'express';
import { addressFromTag, tagFromAddress } from '../controllers/vuilders';
const router = Router();

router.get('/addressfromtag', addressFromTag);
router.get('/tagfromaddress', tagFromAddress);

export default router;
