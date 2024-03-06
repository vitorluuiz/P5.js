const express = require('express');
const router = express.Router();

const Leaderboard = require('../models/leaderboard');

let Leaderboards = [];

// Get all scores from the leaderboard
router.get('/', (req, res) => {
    res.json(Leaderboards.slice(0, 10));
});

// Get all scores from a specific room
router.get('/:roomID', (req, res) => {
    const roomID = req.params.roomID;
    const leaderboard = Leaderboards.filter(leaderboard => leaderboard.roomID === roomID);

    res.json(leaderboard);
});

// Add a new score to the leaderboard
router.post('/', (req, res) => {
    const { name, score } = req.body;
    const leaderboard = new Leaderboard(name, score);

    Leaderboards.push(leaderboard);
    Leaderboards.sort((a, b) => b.score - a.score);

    res.json(leaderboard);
});

module.exports = router;