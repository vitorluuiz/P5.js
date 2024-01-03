const CPU_RADIUS = 25;           // Radius of CPU circles
const CPU_UNITS = 5;             // Count of CPU circles on canvas
const MAX_CPU_V = 5;             // Max CPU velocity
const FPS = 120;                 // Frames per second of canvas

// Enable Auto-play
window.load = function() {
  video.muted = false;
}

let bounceSounds = [];
let bouncesCount = 0;

// CPU objs List
let objList = [];

// Obj pattern
function ObjProps() {
  this.id = 0;
  this.cord = {
    x: 0,
    y: 0,
    vX: 0,
    vY: 0,
  }; this.delayedCord = {
    vX: 0,
    vY: 0,
  };
  this.rgb = {
    r: 0,
    g: 0,
    b: 0,
  };
  this.struct = {
    circum: 0,
    radius: 0,
    mass: 0,
  };
}

// Function to Initialize CPU objs
function initObj(obj) {
  obj.id = objList.length + 1;

  obj.struct.radius = CPU_RADIUS;
  obj.struct.circum = CPU_RADIUS * 2;
  obj.struct.mass = 100;

  obj.cord.x = random(obj.struct.radius, windowWidth - obj.struct.radius);
  obj.cord.y = random(obj.struct.radius, windowHeight - obj.struct.radius);

  obj.cord.vX = random(MAX_CPU_V * -1, MAX_CPU_V);
  obj.cord.vY = random(MAX_CPU_V * -1, MAX_CPU_V);

  obj.rgb.r = random(0, 255);
  obj.rgb.g = random(0, 255);
  obj.rgb.b = random(0, 255);

  objList.push(obj);
}

// Function to detect CPU colision with others CPUs
function detectNormalObjColision(objA) {
  for (let i = 0; i < objList.length; i++) {
    if (objList[i] != objA) {
      let objB = Object.create(objList[i]);

      let xDif = objA.cord.x - objB.cord.x;
      let yDif = objA.cord.y - objB.cord.y;
      let distance = Math.sqrt(xDif * xDif + yDif * yDif);

      // fill(color(0));
      // line(objA.cord.x, objA.cord.y, objB.cord.x, objB.cord.y);

      if (distance < objA.struct.radius + objB.struct.radius) {
        objA.cord.vX = objB.delayedCord.vX;
        objA.cord.vY = objB.delayedCord.vY;

        bounceSounds[0].play();
        bouncesCount++;
      }
    }
  }
}

// Function to detect CPU colisions with border window
function detectObjWindowColision(obj) {
  if (
    obj.cord.x + obj.struct.radius > windowWidth ||
    obj.cord.x - obj.struct.radius < 0
  ) {
    obj.cord.vX *= -1;
    bounceSounds[1].play();
  }

  if (
    obj.cord.y + obj.struct.radius > windowHeight ||
    obj.cord.y - obj.struct.radius < 0
  ) {
    obj.cord.vY *= -1;
    bounceSounds[2].play();
  }
}

// Function to move CPU objs
function moveObj(obj) {
  obj.cord.x += obj.cord.vX;
  obj.cord.y += obj.cord.vY;
  obj.delayedCord.vX = obj.cord.vX;
  obj.delayedCord.vY = obj.cord.vY;
}

function preload() {
  soundFormats('wav');
  bounceSounds.push(loadSound('./assets/sounds/bounce1'));
  bounceSounds.push(loadSound('./assets/sounds/bounceWall1'));
  bounceSounds.push(loadSound('./assets/sounds/bounceWall2'));
}

// SETUP
function setup() {
  frameRate(FPS);
  let cnv = createCanvas(windowWidth, windowHeight);


  // Amount of CPU Objs
  for (let n = 0; n < CPU_UNITS; n++) {
    initObj(new ObjProps());
  }
}

//DRAW
function draw() {
  background(255);

  // Detect CPU Objs colisions
  for (var i = 0; i < objList.length; i++) {
    detectObjWindowColision(objList[i], i);
    detectNormalObjColision(objList[i], i);
  }

  for (var i = 0; i < objList.length; i++) {
    fill(color(objList[i].rgb.r, objList[i].rgb.g, objList[i].rgb.b, 200));
    circle(objList[i].cord.x, objList[i].cord.y, objList[i].struct.circum);
    
    moveObj(objList[i], i);

    fill(color(0));
    text(objList[i].id, objList[i].cord.x, objList[i].cord.y);
  }

  fill(255);
  circle(mouseX, mouseY, CPU_RADIUS);
}
