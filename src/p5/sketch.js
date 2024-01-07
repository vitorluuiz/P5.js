const CPU_RADIUS = 14;           // Radius of CPU circles
const CPU_UNITS = 7;             // Count of CPU circles on canvas
const USER_POINTERS = 1;
const MAX_CPU_V = 10;             // Max CPU velocity
const FPS = 60;               // Frames per second of canvas
const TEXT_SIZE = 70;

// BEFORE
function preload() {
  gameFont = loadFont('assets/fonts/XTypewriter/XTypewriter-Regular.ttf');

  soundFormats('wav');
  gameMusic = loadSound('./assets/sounds/gameMusic');
  bounceSounds.push(loadSound('./assets/sounds/bounce1'));
  bounceSounds.push(loadSound('./assets/sounds/bounceWall1'));
  bounceSounds.push(loadSound('./assets/sounds/bounceWall2'));
}

// ON INIT
function setup() {
  createCanvas(windowWidth, windowHeight);

  textSize(TEXT_SIZE);
  textAlign(CENTER);
  textFont(gameFont);

  restartGame();
}

function windowResized() {
  setup();
}

function mousePressed() {
  initGame();
}

// EACH FRAME
function draw() {
  background(200);
  showPoints();

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