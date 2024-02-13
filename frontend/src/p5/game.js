// Player class, that contains all others peers infos from the game
class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.hasVotedToStart = false;
    }
}

// Pointer class and circle class is defined in frontend/src/p5/pointer.js and frontend/src/p5/circle.js

// Assets variables
let gameFont;
let bounceSounds = [];
let gameMusic;

// Game variables
let CPU_RADIUS;           // Radius of CPU circles
let CPU_UNITS;            // Count of CPU circles on canvas
let MAX_CPU_V;            // Max CPU velocity
let OBJBOUNCE_SOUND;      // If the sound of the bounce is on or off
let MUSIC_SOUND;          // If the main music is on or off

const FPS = 60;           // Frames per second of canvas
const TEXT_SIZE = 70;     // Text size of the game messages

// Game states
let gameState = 'stoped';
let players = [];
let pointerList = [];
let loosersList = [];
let circleList = [];

const handleGameState = (state) => {
    gameState = state;
};

// Function that init the game
function initGame(startState) {
    // If the game is already running, dont init the game
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

    // If the music is on, init the game music every time the game starts
    if (MUSIC_SOUND === 'ON') {
        gameMusic.loop();
    }

    // Restart game variables
    frameRate(FPS);
    frameCount = 0;
    circleList = [];
    pointerList = [];
    loosersList = [];

    // Add the player to the players list
    players = [new Player(peer.myPeer._id, 'You')];
    // Get the players from the peer and add them to the players list
    peer.getMyConnections().forEach((id) => { players.push(new Player(id, id)) });

    // If startState is undefined, that means that the game is starting for the first time from the host peer
    if (startState === undefined) {
        // Amount of CPU Objs
        const _radius = CPU_RADIUS;
        const _mass = 1;

        // Create CPU circles
        for (let n = 0; n < CPU_UNITS; n++)
            circleList.push(new Circle(_radius, _mass));

        // Amount of User Pointers
        for (let n = 0; n < players.length; n++)
            pointerList.push(new Pointer(players[n].id, players[n].name, windowWidth / 2, windowHeight / 2, CPU_RADIUS / 2));

        // finally, emit the game start event to others peers
        emitGameStart();
    } else {
        // If startState is defined, that means that the game is starting from a non-host peer
        startState.circleList.forEach((circle) => {
            const _circle = new Circle(circle.struct.radius, circle.struct.mass,
                circle.cord.x,
                circle.cord.y,
                circle.cord.vX,
                circle.cord.vY);

            _circle.color.r = circle.color.r;
            _circle.color.g = circle.color.g;
            _circle.color.b = circle.color.b;

            circleList.push(_circle);
        });

        for (let n = 0; n < players.length; n++)
            pointerList.push(new Pointer(players[n].id, players[n].name, windowWidth / 2, windowHeight / 2, startState.pointerRadius / 2));
    }

    handleGameState('running');
}

// function that ends the game
function endGame() {
    frameRate(1);
    gameMusic.stop();

    handleGameState('stoped');
}

// Screen that shows the start game message
function showStartGame() {
    fill(0);
    textSize(TEXT_SIZE);
    text(`Click to start`, windowWidth * 0.5, windowHeight * 0.5);
}

// Screen that shows the points
function showPoints() {
    fill(0);
    textSize(TEXT_SIZE);
    text(`${((frameCount / FPS)).toFixed(2)}`, windowWidth * 0.5, windowHeight * 0.5);
}