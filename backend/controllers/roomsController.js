const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const Player = require('../models/player');

let rooms = [];

router.get('/rooms', (req, res) => {
    res.json(rooms);
});

router.post('/room', (req, res) => {
    const { ownerName, id } = req.body;
    const owner = new Player(ownerName, id);
    const room = new Room(owner);

    room.players.push(owner);
    rooms.push(room);

    res.json(room);
});

module.exports = router;