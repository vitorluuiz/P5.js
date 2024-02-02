class Room{
    constructor(player){
        this.owner = player.name ?? 'Unknown';
        this.id = player.id;
        this.players = [];
    }
}

module.exports = Room;