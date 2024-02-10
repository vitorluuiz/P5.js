class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.hasVotedToStart = false;
    }
}

let gameFont;
let bounceSounds = [];
let gameMusic;

let CPU_RADIUS;           // Radius of CPU circles
let CPU_UNITS;            // Count of CPU circles on canvas
let MAX_CPU_V;            // Max CPU velocity
let OBJBOUNCE_SOUND;
let MUSIC_SOUND;

const FPS = 60;           // Frames per second of canvas
const TEXT_SIZE = 70;

let players = [];
let pointerList = [];
let loosersList = [];
let circleList = [];

// Function that init the game
function initGame() {
    if (gameState === 'running') {
        return;
    }

    // get the settings from session storage
    let settings = getSettings();
    MUSIC_SOUND = settings.options.music;
    OBJBOUNCE_SOUND = settings.options.bounce;
    MAX_CPU_V = settings.options.velocity;
    CPU_UNITS = settings.options.units;
    CPU_RADIUS = settings.options.radius;

    if (MUSIC_SOUND === 'ON') {
        gameMusic.loop();
    }

    frameRate(FPS);
    frameCount = 0;
    circleList = [];
    pointerList = [];
    loosersList = [];

    players = [new Player(peer.myPeer._id, 'You')];
    peer.getMyConnections().forEach((id) => { players.push(new Player(id, id)) });

    // Amount of User Pointers
    for (let n = 0; n < players.length; n++)
        pointerList.push(new Pointer(players[n].id, players[n].name, windowWidth / 2, windowHeight / 2, CPU_RADIUS));

    // Amount of CPU Objs
    for (let n = 0; n < CPU_UNITS; n++)
        circleList.push(new Circle(windowWidth, windowHeight, CPU_RADIUS * 2, 1));

    handleGameState('running');
}

// function that ends the game
function endGame() {
    frameRate(1);
    gameMusic.stop();

    handleGameState('stoped');
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