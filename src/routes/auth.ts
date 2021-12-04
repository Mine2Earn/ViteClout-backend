import { Router } from 'express';
import passport from 'passport';
import isLoggedIn from '../middlewares/isLoggedIn';
const router = Router();

router.get('/twitter', passport.authenticate('twitter'));
router.get(
    '/twitter/callback',
    passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/twitter'
    })
);

router.get('/test', isLoggedIn, (req, res) => {
    console.log(req.user);
    res.status(200).json({ user: req.user });
});

export default router;
