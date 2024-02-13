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

  textAlign(CENTER);
  textFont(gameFont);
  frameRate(1);

  // Detects if the mouse is pressed inside the canvas
  canvas.mousePressed(function () {
    voteForGameStart();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// EACH FRAME
function draw() {
  background(200);
  textSize(TEXT_SIZE);

  if (gameState === 'running') {
    showPoints();
  } else {
    showStartGame();
  }

  // Detect CPU Objs collisions
  for (var i = circleList.length - 1; i >= 0; i--) {
    circleList[i].checkWindowcollision(windowWidth, windowHeight);
    let hasCollision = circleList[i].checkCollision(i);
    if (hasCollision != -1) {
      circleList[i].handleCollision(hasCollision);
    }
  }

  // Draw CPU Objs
  for (let i = circleList.length - 1; i >= 0; i--) {
    circleList[i].move();
    circleList[i].draw();
  }

  // If this peer is alive, move and check collisions
  if (pointerList[0] && pointerList[0].stats.isAlive) {
    pointerList[0].movePointer(mouseX, mouseY);

    let hasCollision = pointerList[0].checkCollision();

    // If there is a collision, handle loss
    if (hasCollision != -1) {
      // send loss event to others peers
      sendLossEvent();
      
      // change pointer status to dead and add to loosers list
      pointerList[0].stats.isAlive = false;
      loosersList.push(pointerList[0]);

      // If all peers are dead, emit game end
      if (loosersList.length === pointerList.length) {
        emitGameEnd();
      }
    }

    // If dont have collision, send pointer position to others peers
    sendPointerPosition(mouseX, mouseY);
  }

  // Draw live and loosers pointers
  for (let i = pointerList.length - 1; i >= 0; i--) {
    if (pointerList[i].stats.isAlive) {
      pointerList[i].drawPointer(255, 255, 255);
    } else {
      pointerList[i].drawPointer(255, 0, 0);
    }
  }
}