import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import passport from './config/passport';
import authRoutes from './routes/auth';

const app = express();
const port = process.env.PORT || 3600;

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(session({ secret: 'jsuispassecure dedi a eka' }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('<a href="/auth/twitter">Sign in with Twitter</a>');
});

// app.use('/auth', auth); // Route, controller

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
