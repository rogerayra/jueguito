const span = document.querySelector("span");
const ul = document.querySelector("ul");
const friction = 0.6;
const gravity = 0.98;
const images = {};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let gameStarted = false;
let interval = 0;
let frames = 0;
let board;
let limits = [];
let platforms = [];
let character1;
let keys = [];
keys[80] = false;


function startGame() {
  gameStarted = true;
  if (interval) return;

  platforms = Platform.GenerateInitial(images.platform);
  Platform.GenerateRandom(platforms, images.platform);
  interval = setInterval(update, 1000 / 60);
}

function stopGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let finalScore = board.totalMovement;
  board.draw();
  ctx.fillStyle = "green";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!!!", canvas.width / 2 - 100, canvas.height / 2);
  ctx.fillText(
    `Your final score is: ${board.totalMovement}`,
    canvas.width / 2 - 150,
    canvas.height / 2 + 50
  );

  clearInterval(interval);
  interval = false;
  gameStarted = false;

  board.totalMovement = 0;

  platforms = [];
  let keys = [];
  keys[80] = false;
  character1 = new Character(50, canvas.height - 50, 40, 40, images.character1);
}

function update() {
  if (!keys[80]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    limits.forEach(limit => limit.draw());

    board.draw();
    Platform.DrawAll(platforms);
    character1.draw();
    Platform.Clean(platforms);

    while (platforms[platforms.length - 1].y > 0) {
      Platform.GenerateRandom(platforms, images.platform);
    }
    writePlatfomsInfo();

    if (character1.y <= (2 * canvas.height) / 3) {
      board.move();
      Platform.MoveAll(platforms);
    }

    if (character1.y + character1.height > canvas.height) {
      stopGame();
    }

    //jump
    if (keys[38] || keys[32]) {
      if (!character1.jumping) {
        character1.velY = -character1.jumpStrength * 2;
        character1.jumping = true;
      }
    }

    //movimiento
    if (keys[39]) {
      if (character1.velX < character1.speed) {
        character1.velX++;
      }
    }

    if (keys[37]) {
      if (character1.velX > -character1.speed) {
        character1.velX--;
      }
    }

    //jump
    character1.y += character1.velY;
    character1.velY += gravity;

    //movimiento
    character1.x += character1.velX;
    character1.velX *= friction;

    // limit collition
    limits.map(limit => {
      const direction = collisionCheck(character1, limit);
      if (direction == "left" || direction == "right") {
        character1.velX = 0;
      } else if (direction == "bottom") {
        character1.jumping = false;
        character1.grounded = true;
      } else if (direction == "top") {
        character1.velY *= -1;
      }
    });

    // platform collition
    character1.grounded = false;
    platforms.map(platform => {
      const direction = collisionCheck(character1, platform);
      if (direction == "left" || direction == "right") {
        character1.velX = 0;
      } else if (direction == "bottom") {
        character1.jumping = false;
        character1.grounded = true;
      } else if (direction == "top") {
        character1.velY *= -1;
      }
    });

    if (character1.grounded) {
      character1.velY = 0;
    }

    frames++;
  }
}

function collisionCheck(char, plat) {
  const vectorX = char.x + char.width / 2 - (plat.x + plat.width / 2);
  const vectorY = char.y + char.height / 2 - (plat.y + plat.height / 2);

  const halfWidths = char.width / 2 + plat.width / 2;
  const halfHeights = char.height / 2 + plat.height / 2;

  let collisionDirection = null;

  if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
    var offsetX = halfWidths - Math.abs(vectorX);
    var offsetY = halfHeights - Math.abs(vectorY);
    if (offsetX < offsetY) {
      if (vectorX > 0) {
        collisionDirection = "left";
        char.x += offsetX;
      } else {
        collisionDirection = "right";
        char.x -= offsetX;
      }
    } else {
      if (vectorY > 0) {
        collisionDirection = "top";
        char.y += offsetY;
      } else {
        collisionDirection = "bottom";
        char.y -= offsetY;
      }
    }
  }
  return collisionDirection;
}

document.addEventListener("keydown", e => {
  if (!e.isTrusted) return;

  if (e.keyCode === 80) {
    keys[80] = !keys[80];
  } else {
    //para movimiento
    keys[e.keyCode] = true;
  }
});

document.addEventListener("keyup", e => {
  if (!e.isTrusted) return;
  if (e.keyCode !== 80) {
    keys[e.keyCode] = false;
  }
});

addEventListener("load", () => {
  images.background = loadImage("../images/chalkboard.png");
  images.background.addEventListener("load", () => {
    board = new Board(canvas.width, canvas.height, images.background);
  });

  limits.push(
    new Limits(-1, 0, 0, canvas.height, "black"),
    new Limits(canvas.width, 0, 0, canvas.height, "black"),
    new Limits(0, -1, canvas.width, 0, "black")
  );

  images.character1 = loadImage("../images/stickman.png");
  images.character1.addEventListener("load", () => {
    character1 = new Character(
      50,
      canvas.height - 50,
      40,
      40,
      images.character1
    );
  });

  images.platform = loadImage("../images/platform.png");
  images.platform.addEventListener("load", () => {});

  document.querySelector("button").addEventListener("click", () => {
    startGame();
  });
});
