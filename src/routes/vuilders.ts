import { Router } from 'express';
import { addressFromTag, tagFromAddress, info } from '../controllers/vuilders';
const router = Router();

router.get('/addressfromtag', addressFromTag);
router.get('/tagfromaddress', tagFromAddress);
router.get('/infofromtwt', info);

export default router;
