import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3600;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// app.use('/auth', auth); // Route, controller

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
