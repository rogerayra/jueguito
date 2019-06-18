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
let characters = [];
// let keys = [];
// keys[80] = false;

let controls1 = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

let controls2 = {
  left: 65,
  up: 87,
  right: 68,
  down: 83
};

function startGame() {
  gameStarted = true;
  if (interval) return;

  platforms = Platform.GenerateInitial(images.platform);
  Platform.GenerateRandom(platforms, images.platform);
  interval = setInterval(update, 1000 / 60);
}

function stopGame() {
  for (let i = 0; i < characters.length; i++) {
    if (characters[i].isAlive) return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  board.draw();
  ctx.fillStyle = "green";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!!!", canvas.width / 2 - 100, canvas.height / 2);
  ctx.fillText(
    `${characters[0].name}: ${characters[0].score}`,
    canvas.width / 2 - 150,
    canvas.height / 2 + 50
  );

  ctx.fillText(
    `${characters[1].name}: ${characters[1].score}`,
    canvas.width / 2 - 150,
    canvas.height / 2 + 100
  );

  clearInterval(interval);
  interval = false;
  gameStarted = false;

  board.totalMovement = 0;

  platforms = [];
  let keys = [];
  keys[80] = false;
  characters = [];
  characters.push(
    new Character(
      50,
      canvas.height - 100,
      40,
      40,
      images.character1,
      controls1,
      "Pepe"
    ),
    new Character(
      canvas.width - 50,
      canvas.height - 100,
      40,
      40,
      images.character1,
      controls2,
      "Margarita"
    )
  );
}

function update() {
  // if (!keys[80]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  limits.forEach(limit => limit.draw());

  board.draw();
  Platform.DrawAll(platforms);
  characters.forEach(char => {
    if (char.isAlive) {
      char.draw();
    }
  });
  Platform.Clean(platforms);

  while (platforms[platforms.length - 1].y > 0) {
    Platform.GenerateRandom(platforms, images.platform);
  }
  writePlatfomsInfo();

  characters.forEach(char => {
    if (char.isAlive) {
      if (char.y <= (2 * canvas.height) / 3) {
        board.move();
        Platform.MoveAll(platforms);
      }

      if (char.y + char.height > canvas.height) {
        char.isAlive = false;
        char.score = board.totalMovement;
        stopGame();
      }

      //jump
      if (char.keys[char.controls.up]) {
        if (!char.jumping) {
          char.velY = -char.jumpStrength * 2;
          char.jumping = true;
        }
      }

      //movimiento
      if (char.keys[char.controls.right]) {
        if (char.velX < char.speed) {
          char.velX++;
        }
      }

      if (char.keys[char.controls.left]) {
        if (char.velX > -char.speed) {
          char.velX--;
        }
      }

      //jump
      char.y += char.velY;
      char.velY += gravity;

      //movimiento
      char.x += char.velX;
      char.velX *= friction;

      // limit collition
      limits.forEach(limit => {
        const direction = collisionCheck(char, limit);
        if (direction == "left" || direction == "right") {
          char.velX = 0;
        } else if (direction == "bottom") {
          char.jumping = false;
          char.grounded = true;
        } else if (direction == "top") {
          char.velY *= -1;
        }
      });

      // platform collition
      char.grounded = false;
      platforms.forEach(platform => {
        const direction = collisionCheck(char, platform);
        if (direction == "left" || direction == "right") {
          char.velX = 0;
        } else if (direction == "bottom") {
          char.jumping = false;
          char.grounded = true;
        } else if (direction == "top") {
          char.velY *= -1;
        }
      });

      if (char.grounded) {
        char.velY = 0;
      }
    }
  });

  frames++;
  // }
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

  // if (e.keyCode === 80) {
  //   keys[80] = !keys[80];
  // } else {
  //   //para movimiento
  //   keys[e.keyCode] = true;
  // }

  characters.forEach(char => (char.keys[e.keyCode] = true));
});

document.addEventListener("keyup", e => {
  // if (!e.isTrusted) return;
  // if (e.keyCode !== 80) {
  //   keys[e.keyCode] = false;
  // }
  characters.forEach(char => (char.keys[e.keyCode] = false));
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
    characters.push(
      new Character(
        50,
        canvas.height - 100,
        40,
        40,
        images.character1,
        controls1,
        "Pepe"
      ),
      new Character(
        canvas.width - 50,
        canvas.height - 100,
        40,
        40,
        images.character1,
        controls2,
        "Margarita"
      )
    );
  });

  images.platform = loadImage("../images/platform.png");
  images.platform.addEventListener("load", () => {});

  document.querySelector("button").addEventListener("click", () => {
    startGame();
  });
});
