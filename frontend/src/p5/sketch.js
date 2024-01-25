let CPU_RADIUS;           // Radius of CPU circles
let CPU_UNITS;            // Count of CPU circles on canvas
let MAX_CPU_V;            // Max CPU velocity
let OBJBOUNCE_SOUND;      // ON/OFF bounce sound
let MUSIC_SOUND;          // ON/OFF music sound

const USER_POINTERS = 1;
const FPS = 60;               // Frames per second of canvas
const TEXT_SIZE = 70;

// BEFORE
function preload() {
  gameFont = loadFont('/src/assets/fonts/XTypewriter/XTypewriter-Regular.ttf');

  soundFormats('wav');
  gameMusic = loadSound('/src/assets/sounds/gameMusic');
  bounceSounds.push(loadSound('/src/assets/sounds/bounce1'));
  bounceSounds.push(loadSound('/src/assets/sounds/bounceWall1'));
  bounceSounds.push(loadSound('/src/assets/sounds/bounceWall2'));
}

// ON INIT
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  textSize(64);
  textAlign(CENTER);
  textFont(gameFont);

  canvas.mousePressed(function () {
    const settings = getGameSettings();
    CPU_RADIUS = settings.radius;
    CPU_UNITS = settings.units;
    MAX_CPU_V = settings.velocity;
    OBJBOUNCE_SOUND = settings.bounceSound;
    MUSIC_SOUND = settings.music;

    console.log(settings);
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

const getGameSettings = () => {
  if (sessionStorage.getItem('gameSettings') === null) {
    sessionStorage.setItem('gameSettings', JSON.stringify({
      radius: 14,
      units: 7,
      velocity: 10,
      music: "ON",
      bounceSound: "ON"
    }))
  }

  return JSON.parse(sessionStorage.getItem('gameSettings'));
}