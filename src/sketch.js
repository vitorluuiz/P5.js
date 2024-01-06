let CPU_RADIUS = 25;           // Radius of CPU circles
let CPU_UNITS = 8;             // Count of CPU circles on canvas
let MAX_CPU_V = 10;             // Max CPU velocity
const FPS = 120;               // Frames per second of canvas

let bounceSounds = [];
// CPU objs List
let circleList = [];

// BEFORE
function preload() {
  soundFormats('wav');
  bounceSounds.push(loadSound('./assets/sounds/bounce1'));
  bounceSounds.push(loadSound('./assets/sounds/bounceWall1'));
  bounceSounds.push(loadSound('./assets/sounds/bounceWall2'));
}

// ON INIT
function setup() {
  frameRate(FPS);
  createCanvas(windowWidth, windowHeight);

  // Amount of CPU Objs
  for (let n = 0; n < CPU_UNITS; n++) {
    circleList.push(new Circle(windowWidth, windowHeight, CPU_RADIUS, 1));
  }
}

// EACH FRAME
function draw() {
  background(255);

  // Detect CPU Objs collisions
  for (var i = circleList.length - 1; i >= 0; i--) {
    circleList[i].detectWindowcollision(windowWidth, windowHeight)
    let hasCollision = circleList[i].detectCollision(i);
    if (hasCollision != 0) {
      circleList[i].handleCollision(hasCollision);
    }
  }

  // Draw CPU Objs
  for (var i = circleList.length - 1; i >= 0; i--) {
    circleList[i].move();
    circleList[i].display();
    fill(0);
    text(i, circleList[i].cord.x, circleList[i].cord.y);
  }

  // Mouse Circle
  fill(255);
  circle(mouseX, mouseY, CPU_RADIUS);
}
