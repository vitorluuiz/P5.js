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

class StartEvent {
    constructor(idPeer, startState) {
        this.idPeer = idPeer;
        this.startState = startState;
    }
}

onReceiveGameMessage = (gameMessage) => {
    switch (gameMessage.type) {
        case 'voteGameStart':
            onReceiveStartVote(gameMessage.message);
            break;
        case 'gameStart':
            onReceiveGameStart(gameMessage.message);
            break;
        case 'gameEnd':
            onReceiveGameEnd(gameMessage.message);
            break;
        case 'pointerPosition':
            onReceivePointerPosition(gameMessage.message);
            break;
        case 'lossEvent':
            onReceiveLossEvent(gameMessage.message);
            break;
        case 'playerLeft':
            onReceivePlayerLeft(gameMessage.message);
            break;
        default:
            console.log("Game message type not found");
            break;
    }
}

// When the player loses, sends a lossEvent to the other players
const sendLossEvent = () => {
    const gameMessage = new GameMessage('lossEvent', peer.myPeer._id);
    const message = new Message('gameMessage', gameMessage);

    peer.brodcast(message);
}

// When the player receives a lossEvent, updates the player stats
const onReceiveLossEvent = (idPeer) => {
    const loserPointer = pointerList.find((p) => p.id === idPeer);

    if (loserPointer) {
        loserPointer.stats.isAlive = false;
        loosersList.push(loserPointer);
    }
}

const onReceivePlayerLeft = (idPeer) => {
    // Removes the player from the players list
    const playerIndex = players.findIndex((e) => e.id === idPeer);
    players.splice(playerIndex, 1);

    // Removes the player pointer from the pointer list
    const playerPointer = pointerList.find((p) => p.id === idPeer);

    // Check if it's alive
    if (pointerList.length > 0 && playerPointer.stats.isAlive) {
        playerPointer.stats.isAlive = false;
        loosersList.push(playerPointer);

        // If all players are dead, emit game end
        if (loosersList.length === pointerList.length) {
            emitGameEnd();
        }
    }

    pointerList = pointerList.filter((p) => p.id !== idPeer);
};

// Sends the pointer position to the other players
const sendPointerPosition = (x, y) => {
    const pointer = new PointerPosition(peer.myPeer._id, x, y);
    const gameMessage = new GameMessage('pointerPosition', pointer);
    const message = new Message('gameMessage', gameMessage);

    peer.brodcast(message);
}

// When the player receives a pointerPosition, updates the pointer position
const onReceivePointerPosition = (message) => {
    const pointerIndex = pointerList.findIndex((p) => p.id == message.id);

    if (pointerList[pointerIndex]) {
        pointerList[pointerIndex].cord.x = message.x;
        pointerList[pointerIndex].cord.y = message.y;
    }
};

const voteForGameStart = () => {
    // If the player is the host, starts the game
    if (peer.isHost) {
        initGame();
    } else {
        // If the player is not the host, sends a voteGameStart to the host
        const gameMessage = new GameMessage('voteGameStart', peer.myPeer._id);
        const message = new Message('gameMessage', gameMessage);

        // Send voteGameStart to host
        peer.myPeer.connections[peer.firstConn()][0].send(message);
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
    const _circleList = JSON.parse(JSON.stringify(circleList));
    const startMessage = new StartEvent(peer.myPeer._id, { circleList: _circleList, pointerRadius: CPU_RADIUS });
    const gameMessage = new GameMessage('gameStart', startMessage);
    const message = new Message('gameMessage', gameMessage);

    peer.brodcast(message);
}

const emitGameEnd = () => {
    const gameMessage = new GameMessage('gameEnd', peer.myPeer._id);
    const message = new Message('gameMessage', gameMessage);
    endGame();

    peer.brodcast(message);
}

const onReceiveGameStart = (message) => {
    if (message.idPeer === peer.firstConn()) {
        initGame(message.startState);
    }
}

const onReceiveGameEnd = (idPeer) => {
    endGame();
};