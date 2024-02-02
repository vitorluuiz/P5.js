const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const roomsController = require('./controllers/roomsController');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/', roomsController);

app.listen(port, () => {
    console.log(`Servidor Express rodando em http://localhost:${port}`);
});