class GameMessage {
    constructor(type, message) {
        this.type = type;
        this.message = message;
    }
}

class PointerPosition {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }
}

onReceiveGameMessage = (message) => {
    switch (message.type) {
        case 'voteGameStart':
            onReceiveStartVote(message.message);
            break;
        case 'gameStart':
            onReceiveGameStart(message.message);
            break;
        case 'gameEnd':
            onReceiveGameEnd(message.message);
            break;
        case 'pointerPosition':
            onReceivePointerPosition(message.message);
            break;
        case 'lossEvent':
            onReceiveLossEvent(message.message);
            break;
        default:
            console.log("Default");
            break;
    }
}

const sendLossEvent = () => {
    const gameMessage = new GameMessage('lossEvent', peer.myPeer._id);
    const message = new Message('gameMessage', gameMessage);

    peer.brodcast(message);
}

const onReceiveLossEvent = (idPeer) => {
    const loserPointer = pointerList.find((p) => p.id === idPeer).stats.isAlive = false;
    loosersList.push(loserPointer);
}

const sendPointerPosition = (x, y) => {
    const pointer = new PointerPosition(peer.myPeer._id, x, y);
    const gameMessage = new GameMessage('pointerPosition', pointer);
    const message = new Message('gameMessage', gameMessage);

    peer.brodcast(message);
}

const onReceivePointerPosition = (message) => {
    const pointerIndex = pointerList.findIndex((p) => p.id == message.id);

    pointerList[pointerIndex].cord.x = message.x;
    pointerList[pointerIndex].cord.y = message.y;
};

const voteForGameStart = () => {
    const gameMessage = new GameMessage('voteGameStart', peer.myPeer._id);
    const message = new Message('gameMessage', gameMessage);

    if (peer.isHost) {
        emitGameStart();
    } else {
        peer.myPeer.connections[peer.myHost][0].send(message);
    }
}

const onReceiveStartVote = (idPeer) => {
    const playerIndex = players.findIndex((e) => e.id === idPeer);
    players[playerIndex].hasVotedToStart = true;

    const playersDoesntVoted = [];
    players.forEach((player) => {
        if (!player.hasVotedToStart) {
            playersDoesntVoted.push(player);
        }
    })

    if (playersDoesntVoted.length === 0) {
        // If every players has voted to start game, starts the game
        emitGameStart();
    }
}

const emitGameStart = () => {
    const gameMessage = new GameMessage('gameStart', peer.myPeer._id);
    const message = new Message('gameMessage', gameMessage);
    initGame();

    peer.brodcast(message);
}

const emitGameEnd = () => {
    const gameMessage = new GameMessage('gameEnd', peer.myPeer._id);
    const message = new Message('gameMessage', gameMessage);
    endGame();

    peer.brodcast(message);
}

const onReceiveGameStart = (idPeer) => {
    if (idPeer === peer.myHost) {
        initGame();
    }
}

const onReceiveGameEnd = (idPeer) => {
    endGame();
};