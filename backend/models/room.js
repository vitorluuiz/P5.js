class Room{
    constructor(player, ip){
        this.owner = player.name ?? 'Unknown';
        this.id = player.id;
        this.players = [];
        this.ip = ip;
    }
}

module.exports = Room;