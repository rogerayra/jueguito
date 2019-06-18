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
    if (currentPlayers[i].char.active) return;
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

  // clean canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ///// DRAW ALL GAME OBJECTS /////
  //  draw limits . We don't actually see these limits. They are just helping our characters not to get outside the canvas
  limits.forEach(limit => limit.draw());

  //  draw background image
  board.draw();

  //  draw all the platforms generated so far
  Platform.DrawAll(platforms);

  //  draw all our characters
  currentPlayers.forEach(player => {
    if (player.char.active) {
      player.char.draw();
    }
  });

  //  draw all the weapons generated spo far
  weapons.forEach(weapon => {
    if (weapon.active) {
      weapon.draw();
    }
  });

  //  draw all the bullets generated so far
  bullets.forEach(bullet => {
    bullet.draw();
  });

  ///// END: DRAW ALL GAME OBJECTS /////

  ///// CLEAN ALL GAME OBJECTS NO LONGER INSIDE THE CANVAS /////

  // clean platforms PLATFORMS
  Platform.Clean(platforms);

  // clean weapons


  // clean bullets

  ///// END: CLEAN ALL GAME OBJECTS NO LONGER INSIDE THE CANVAS /////

  // generate new platfomrms if needed
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
  });

  currentPlayers.forEach(player => {
    if (player.char.active) {
      if (player.char.y <= (2 * canvas.height) / 3) {
        board.move();
        Platform.MoveAll(platforms);
      }

      if (player.char.y + player.char.height > canvas.height) {
        player.char.active = false;
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
        bullets.push(
          new Bullet(
            player.char.x,
            player.char.y,
            5,
            vectorX,
            vectorY,
            "#e0dbd1"
          )
        );
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
}
