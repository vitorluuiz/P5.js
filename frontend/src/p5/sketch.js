let CPU_RADIUS;           // Radius of CPU circles
let CPU_UNITS;            // Count of CPU circles on canvas
let MAX_CPU_V;            // Max CPU velocity
let OBJBOUNCE_SOUND;
let MUSIC_SOUND;

let peer;

const USER_POINTERS = 1;
const FPS = 60;               // Frames per second of canvas
const TEXT_SIZE = 70;

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

  textSize(64);
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
  if (circleList.length == 0) {
    showStartGame();
  } else {
    showPoints();
  }

  // Detect CPU Objs collisions
  for (var i = circleList.length - 1; i >= 0; i--) {
    circleList[i].detectWindowcollision(windowWidth, windowHeight);
    let hasCollision = circleList[i].detectCollision(i);
    if (hasCollision != -1) {
      circleList[i].handleCollision(hasCollision);
    }
  }

  // Draw CPU Objs
  for (var i = circleList.length - 1; i >= 0; i--) {
    circleList[i].move();
    circleList[i].display();
  }

  for (i = 0; i < pointerList.length; i++) {
    pointerList[i].movePointer(mouseX, mouseY);
    pointerList[i].drawPointer(255, 255, 255);
    let hasCollision = pointerList[i].detectCollision();

    if (hasCollision != -1) {
      endGame(i);
    }
  };
}