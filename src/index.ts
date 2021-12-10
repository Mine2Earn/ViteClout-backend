import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import passport from './config/passport';
import authRoutes from './routes/auth';
import transactionsRoutes from './routes/transactions';
import vuildersRoutes from './routes/vuilders';

const app = express();
const port = process.env.PORT || 3600;

app.use(
    cors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE',
        credentials: true
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(session({ secret: 'jsuispassecure dedi a eka', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/vuilders', vuildersRoutes);

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});
