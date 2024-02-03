// Game Settings
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

let players = [{id: 'Player 2', name: 'Player 2'}];
let pointerList = [];
let loosersList = [];
let circleList = [];

const sendPointerPosition = (x, y) => {
  const pointer = new PointerPosition(peer.peer._id, x, y);
  const message = new GameMessage('pointerPosition', pointer);
  peer.brodcast(new Message('gameTick', message));
}

// BEFORE
function preload() {
  gameFont = loadFont('assets/fonts/XTypewriter/XTypewriter-Regular.ttf');

  soundFormats('wav');
  gameMusic = loadSound('assets/sounds/gameMusic');
  bounceSounds.push(loadSound('assets/sounds/bounce1'));
  bounceSounds.push(loadSound('assets/sounds/bounceWall1'));
  bounceSounds.push(loadSound('assets/sounds/bounceWall2'));
}

// ON INIT
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  textSize(TEXT_SIZE);
  textAlign(CENTER);
  textFont(gameFont);

  canvas.mousePressed(function () {
    let settings = getSettings();
    MUSIC_SOUND = settings.options.music;
    OBJBOUNCE_SOUND = settings.options.bounce;
    MAX_CPU_V = settings.options.velocity;
    CPU_UNITS = settings.options.units;
    CPU_RADIUS = settings.options.radius;
    initGame();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// EACH FRAME
function draw() {
  background(200);
  textSize(TEXT_SIZE);
  if (circleList.length == 0) {
    showStartGame();
  } else {
    showPoints();
  }

  // Detect CPU Objs collisions
  for (var i = circleList.length - 1; i >= 0; i--) {
    circleList[i].detectWindowcollision(windowWidth, windowHeight);
    let hasCollision = circleList[i].checkCollision(i);
    if (hasCollision != -1) {
      circleList[i].handleCollision(hasCollision);
    }
  }

  // Draw CPU Objs
  for (let i = circleList.length - 1; i >= 0; i--) {
    circleList[i].move();
    circleList[i].display();
  }

  // Move, and checkCollision of my pointer
  if (pointerList[0] && pointerList[0].stats.isAlive) {
    pointerList[0].movePointer(mouseX, mouseY);

    let hasCollision = pointerList[0].checkCollision();
    if (hasCollision != -1) {
      pointerList[0].stats.isAlive = false;
      loosersList.push(pointerList[0]);

      if (loosersList.length == pointerList.length) {
        endGame();
      }
    }
  }

  // Draw live and loosers pointers
  for (let i = pointerList.length - 1; i >= 0; i--) {
    if (pointerList[i].stats.isAlive) {
      pointerList[i].drawPointer(255, 255, 255);
    } else {
      pointerList[i].drawPointer(255, 0, 0);
    }
  }

  // sendPointerPosition(mouseX, mouseY);
}