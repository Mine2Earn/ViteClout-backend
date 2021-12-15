import { Router } from 'express';
import passport from 'passport';
import isLoggedIn from '../middlewares/isLoggedIn';
import { checkIfLinked, getNonce, verifyNonce, link } from '../controllers/auth';
const router = Router();
import dotenv from 'dotenv';
dotenv.config();

router.route('/nonce').get(getNonce).post(verifyNonce);
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/islinked', isLoggedIn, checkIfLinked);
router.get(
    '/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: process.env.FRONT,
        failureRedirect: '/twitter'
    })
);
router.get('/success', isLoggedIn, (req, res) => {
    console.log(req.user);
    return res.status(200).json({ message: 'success', user: req.user });
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect(process.env.FRONT);
});
router.post('/link', isLoggedIn, link);

export default router;
