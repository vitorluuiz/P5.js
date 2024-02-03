class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

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

// Function that init the game
function initGame() {
    if (circleList.length != 0) {
        return;
    }

    if (MUSIC_SOUND == 'ON') {
        gameMusic.loop();
    }

    frameRate(FPS);
    frameCount = 0;
    circleList = [];
    pointerList = [];
    loosersList = [];
    pointerList.push(new Pointer(peer.peer._id, peer.peer._id, windowWidth * 0.5, windowHeight * 0.5, CPU_RADIUS, 'You'));

    // Amount of User Pointers
    for (let n = 0; n < players.length; n++)
        pointerList.push(new Pointer(players[n].id, players[n].name, windowWidth / 2, windowHeight / 2, CPU_RADIUS));

    console.log(pointerList);
    // Amount of CPU Objs
    for (let n = 0; n < CPU_UNITS; n++)
        circleList.push(new Circle(windowWidth, windowHeight, CPU_RADIUS * 2, 1));
}

// function that ends the game
function endGame() {
    circleList = [];
    frameRate(1);
    showPoints();

    gameMusic.stop();
}

// Function that restart the game
function restartGame() {
    endGame();
    initGame();
}

// Screen that shows the start game message
function showStartGame() {
    fill(0);
    text(`Click to start`, windowWidth * 0.5, windowHeight * 0.5);
}

// Screen that shows the points
function showPoints() {
    fill(0);
    text(`${((frameCount / FPS)).toFixed(2)}`, windowWidth * 0.5, windowHeight * 0.5);
}