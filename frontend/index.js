require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

app.locals.API_URL = process.env.API_URL || 'http://127.0.0.1:5000';

app.use(express.static(path.join(__dirname, '/src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/src', 'index.html'));
});

const PORT = process.env.STATIC_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});