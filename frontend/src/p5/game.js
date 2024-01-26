let pointerList = [];
let circleList = [];

let gameFont;
let bounceSounds = [];
let gameMusic;

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

    // Amount of User Pointers
    for (let n = 0; n < USER_POINTERS; n++) {
        pointerList.push(new Pointer(windowWidth / 2, windowHeight / 2, CPU_RADIUS));
    };

    // Amount of CPU Objs
    for (let n = 0; n < CPU_UNITS; n++) {
        circleList.push(new Circle(windowWidth, windowHeight, CPU_RADIUS * 2, 1));
    };
}

function endGame(pointerIndex) {
    if (pointerIndex != undefined) {
        pointerList[pointerIndex].drawPointer(255, 0, 0);
    }
    circleList = [];
    frameRate(0);
    showPoints();

    gameMusic.stop();
}

function restartGame() {
    endGame();
    initGame();
}

function showStartGame() {
    fill(0);
    text(`Click to start`, windowWidth * 0.5, windowHeight * 0.5);
}

function showPoints() {
    fill(0);
    text(`${((frameCount / FPS)).toFixed(2)}`, windowWidth * 0.5, windowHeight * 0.5);
}