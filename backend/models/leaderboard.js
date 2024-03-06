class Leaderboard {
    constructor(name = 'Unknown', score = 0, roomID = 'Unknown') {
        this.name = name;
        this.score = score;
        this.roomID = roomID;
    }
}

module.exports = Leaderboard;