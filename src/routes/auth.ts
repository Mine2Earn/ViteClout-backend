import { Router } from 'express';
import passport from 'passport';
import isLoggedIn from '../middlewares/isLoggedIn';
import { checkIfLinked, getNonce, verifyNonce } from '../controllers/auth';
const router = Router();

router.route('/nonce').get(getNonce).post(verifyNonce);
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/islinked', isLoggedIn, checkIfLinked);
router.get(
    '/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: 'http://localhost:3000/',
        failureRedirect: '/twitter'
    })
);
router.get('/success', isLoggedIn, (req, res) => {
    console.log(req.user);
    return res.status(200).json({ message: 'success', user: req.user });
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('http://localhost:3000/');
});

export default router;
