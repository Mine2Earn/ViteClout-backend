import { Router } from 'express';
import passport from 'passport';
import isLoggedIn from '../middlewares/isLoggedIn';
import { checkIfLinked, linkAccount } from '../controllers/auth';
const router = Router();

router.get('/twitter', passport.authenticate('twitter'));
router.get(
    '/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: 'http://localhost:3000/',
        failureRedirect: '/twitter'
    })
);
router.get('/twitter/islinked', isLoggedIn, checkIfLinked);
router.get('/success', isLoggedIn, (req, res) => {
    console.log(req.user);
    return res.status(200).json({ message: 'success', user: req.user });
});
router.post('/twitter/link', isLoggedIn, linkAccount);

router.get('/test', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.status(200).json({ user: req.user });
});

export default router;
