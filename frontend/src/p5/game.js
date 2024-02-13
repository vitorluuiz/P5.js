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
function initGame(hostCircles) {
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

    if (hostCircles === undefined) {
        // Amount of CPU Objs
        const _radius = CPU_RADIUS * 2;
        const _mass = 1;
        for (let n = 0; n < CPU_UNITS; n++)
            circleList.push(new Circle(_radius, _mass,
                random(_radius, windowWidth - _radius),
                random(_radius, windowHeight - _radius),
                random(-MAX_CPU_V, MAX_CPU_V),
                random(-MAX_CPU_V, MAX_CPU_V)
            ));

        emitGameStart();
    } else {
        hostCircles.forEach((circle) => {
            // For an unknown reason, the circle object is not being created correctly with the following circle.cords props
            // circle.cord.x, circle.cord.y, circle.cord.vX, circle.cord.vY
            const _circle = new Circle(circle.struct.radius, circle.struct.mass);
            _circle.cord.x = circle.cord.x;
            _circle.cord.y = circle.cord.y;
            _circle.cord.vX = circle.cord.vX;
            _circle.cord.vY = circle.cord.vY;
            _circle.color.r = circle.color.r;
            _circle.color.g = circle.color.g;
            _circle.color.b = circle.color.b;
            circleList.push(_circle);
        });

    }

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