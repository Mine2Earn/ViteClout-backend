import { Router } from 'express';
import { addressFromTag, tagFromAddress, info, twitterInfo, isVuilder } from '../controllers/vuilders';
const router = Router();

router.get('/addressfromtag', addressFromTag);
router.get('/tagfromaddress', tagFromAddress);
router.get('/infofromtwt', info);
router.get('/twitterinfo', twitterInfo);
router.get('/isvuilder', isVuilder);

export default router;
