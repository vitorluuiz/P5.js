const express = require('express');
const router = express.Router();

// Importing models from models folder
const Room = require('../models/room');
const Player = require('../models/player');

// Array of active rooms
let rooms = [];

// Get all rooms
router.get('/rooms', (req, res) => {
    res.json(rooms);
});

// Create a new room
router.post('/room', (req, res) => {
    const { ownerName, id } = req.body;
    const owner = new Player(ownerName, id);
    const room = new Room(owner);

    room.players.push(owner);
    rooms.push(room);

    res.json(room);
});

router.delete('/room/:id', (req, res) => {
    const { id } = req.params;
    rooms = rooms.filter(room => room.id !== id);
    
    res.json(rooms);
});

// Add a player to a room
router.patch('/room/:id/playerJoin', (req, res) => {
    const { id } = req.params;
    const { playerName, playerId } = req.body;
    const player = new Player(playerName, playerId);

    const room = rooms.find(room => room.id === id);
    room.players.push(player);

    res.json(room);
});

// Remove Player from room
router.patch('/room/:id/playerLeft', (req, res) => {
    const { id } = req.params;
    const { playerName, playerId } = req.body;
    const player = new Player(playerName, playerId);

    const room = rooms.find(room => room.id === id);
    room.players.splice(room.players.indexOf(player), 1);

    res.json(room);
});

module.exports = router;