const friction = 0.6;
const gravity = 0.98;
let gameStarted = false;
let interval = 0;
let frames = 0;
let board;
let limits = [];
let platforms = [];
let currentPlayers = [];
let clouds = [];
// let keys = [];
// keys[80] = false;

let bullets = [];

let weapons = [];

function startGame() {
  gameStarted = true;
  if (interval) return;

  platforms = Platform.GenerateInitial(images.platform);
  Platform.GenerateRandom(platforms, images.platform);

  //   clouds.push(new Cloud(100, 100, 20, 20, images.cloud), new Cloud(112, 100, 20, 20, images.cloud), new Cloud(124, 100, 20, 20, images.cloud), new Cloud(136, 100, 20, 20, images.cloud))

  weapons.push(new Weapon(400, 0, 20, 20, images.weapon));

  interval = setInterval(update, 1000 / 60);
}

function stopGame() {
  for (let i = 0; i < currentPlayers.length; i++) {
    if (currentPlayers[i].char.isAlive) return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  board.draw();
  ctx.fillStyle = "green";
  ctx.font = "30px crayon";
  ctx.fillText("Game Over!!!", canvas.width / 2 - 100, canvas.height / 2);

  let yTextPosition = canvas.height / 2;
  currentPlayers.forEach(player => {
    yTextPosition += 50;
    ctx.fillText(
      `${player.name}: ${player.char.score}`,
      canvas.width / 2 - 150,
      yTextPosition
    );
  });

  clearInterval(interval);
  interval = false;
  gameStarted = false;

  board.totalMovement = 0;

  platforms = [];
  let keys = [];
  keys[80] = false;
}

function update() {
  // if (!keys[80]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  limits.forEach(limit => limit.draw());

  board.draw();
  Platform.DrawAll(platforms);
  // clouds.forEach(cloud => cloud.draw())

  currentPlayers.forEach(player => {
    if (player.char.isAlive) {
      player.char.draw();
    }
  });

  weapons.forEach(weapon => {
    if (weapon.active) {
        weapon.draw();
    }
    });

    bullets.forEach(bullet => {

            bullet.draw();

        });

  Platform.Clean(platforms);

  while (platforms[platforms.length - 1].y > 0) {
    Platform.GenerateRandom(platforms, images.platform);
  }
  // writePlatfomsInfo();

  weapons.forEach(weapon => {
    if (weapon.active) {
      //jump
      weapon.y += weapon.velY;
      weapon.velY += gravity;

      // platform collition
      weapon.grounded = false;
      platforms.forEach(platform => {
        if (
          platform.constructor.name === "Platform" ||
          (platform.constructor.name === "VanishingPlatform" && platform.active)
        ) {
          const direction = collisionCheck(weapon, platform);
          if (direction == "left" || direction == "right") {
            weapon.velX = 0;
          } else if (direction == "bottom") {
            weapon.grounded = true;
            if (
              platform.constructor.name === "VanishingPlatform" &&
              platform.active
            ) {
              platform.countdown();
            }
          } else if (direction == "top") {
            weapon.velY *= -1;
          }
        }
      });

      if (weapon.grounded) {
        weapon.velY = 0;
      }
    }
  });

  bullets.forEach(bullet => {
      bullet.x += bullet.vectorX;
      bullet.y += bullet.vectorY;
  }

  )

  currentPlayers.forEach(player => {
    if (player.char.isAlive) {
      if (player.char.y <= (2 * canvas.height) / 3) {
        board.move();
        Platform.MoveAll(platforms);
      }

      if (player.char.y + player.char.height > canvas.height) {
        player.char.isAlive = false;
        player.char.score = board.totalMovement;
        stopGame();
      }

      //jump
      if (player.char.keys[player.controls.up]) {
        if (!player.char.jumping) {
          player.char.velY = -player.char.jumpStrength * 2;
          player.char.jumping = true;
        }
      }

      //movimiento
      if (player.char.keys[player.controls.right]) {
        if (player.char.velX < player.char.speed) {
          player.char.velX++;
        }
      }

      if (player.char.keys[player.controls.left]) {
        if (player.char.velX > -player.char.speed) {
          player.char.velX--;
        }
      }

      if (player.char.keys[player.controls.shoot]) {
        player.char.keys[player.controls.shoot] = false;
        let vectorX = player.char.x - (player.char.x + player.char.velX);
        let vectorY = player.char.y - (player.char.y + player.char.velY);
        bullets.push(new Bullet(player.char.x, player.char.y, 5, vectorX, vectorY, "white"))
      }

      //jump
      player.char.y += player.char.velY;
      player.char.velY += gravity;

      //movimiento
      player.char.x += player.char.velX;
      player.char.velX *= friction;

      // limit collition
      limits.forEach(limit => {
        const direction = collisionCheck(player.char, limit);
        if (direction == "left" || direction == "right") {
          player.char.velX = 0;
        } else if (direction == "bottom") {
          player.char.jumping = false;
          player.char.grounded = true;
        } else if (direction == "top") {
          player.char.velY *= -1;
        }
      });

      weapons.forEach(weapon => {
        if (collisionCheck(player.char, weapon)) {
          player.char.armed = true;
          weapon.active = false;
        }
      });

      // platform collition
      player.char.grounded = false;
      platforms.forEach(platform => {
        if (
          platform.constructor.name === "Platform" ||
          (platform.constructor.name === "VanishingPlatform" && platform.active)
        ) {
          const direction = collisionCheck(player.char, platform);
          if (direction == "left" || direction == "right") {
            player.char.velX = 0;
          } else if (direction == "bottom") {
            player.char.jumping = false;
            player.char.grounded = true;
            if (
              platform.constructor.name === "VanishingPlatform" &&
              platform.active
            ) {
              platform.countdown();
            }
          } else if (direction == "top") {
            player.char.velY *= -1;
          }
        }
      });

      if (player.char.grounded) {
        player.char.velY = 0;
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
