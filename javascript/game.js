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
let enemies = [];

function startGame() {
  gameStarted = true;
  if (interval) return;

  platforms = generateInitialPlatforms();
  generateRandomPlatforms();
  // weapons.push(
  //   new Weapon(
  //     randomIntFromInterval(0, canvas.width - 20),
  //     0,
  //     20,
  //     20,
  //     images.weapon
  //   )
  // );

  // enemies.push(
  //   new Enemy(
  //     randomIntFromInterval(0, canvas.width - 40),
  //     0,
  //     40,
  //     80,
  //     images.enemy
  //   )
  // );

  interval = setInterval(update, 1000 / 60);
}

function stopGame() {
  for (let i = 0; i < currentPlayers.length; i++) {
    if (currentPlayers[i].char.active) return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (players.length > 0) {
    currentPlayers.forEach(currentPlayer => {
      players.forEach(player => {
        if (currentPlayer.name === player.name) {
          if (currentPlayer.score > player.score) {
            player.score = currentPlayer.score;
          }
        } else {
          players.push(currentPlayer);
        }
      });
    });
  } else {
    currentPlayers.forEach(currentPlayer => players.push(currentPlayer));
  }

  players
    .sort((a, b) => {
      if (a.score < b.score) return -1;
      else if (a.score > b.score) return 1;
      return 0;
    })
    .reverse();

  updateScoreboard();

  board.draw();
  ctx.fillStyle = "#e0dbd1";
  ctx.strokeStyle = "#e0dbd1";
  ctx.font = "100px crayon";
  ctx.strokeText(
    "¡¡¡ Fin de partida !!!",
    canvas.width / 2 - 300,
    canvas.height / 3
  );

  let yTextPosition = canvas.height / 2;
  currentPlayers.forEach(player => {
    yTextPosition += 100;
    ctx.strokeText(
      `${player.name}: ${player.score} puntos`,
      canvas.width / 2 - 250,
      yTextPosition
    );

    ctx.font = "30px crayon";
    ctx.fillText(
      "(Presione 'V' para volver al menú)",
      canvas.width / 2 - 200,
      canvas.height - 50
    );
  });

  clearInterval(interval);
  interval = false;
  gameStarted = false;

  board.totalMovement = 0;

  clouds = [];
  bullets = [];
  enemies = [];
  weapons = [];
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

  clouds.forEach(cloud => cloud.draw());

  //  draw all the platforms generated so far
  platforms.forEach(plat => plat.draw());

  //  draw all our characters
  currentPlayers.forEach(player => {
    if (player.char.active) {
      player.char.draw();
    }
  });

  //  draw all the weapons generated so far
  weapons.forEach(weapon => {
    if (weapon.active) {
      weapon.draw();
    }
  });

  //  draw all the enemies generated so far
  enemies.forEach(enemy => {
    if (enemy.active) {
      enemy.draw();
    }
  });

  //  draw all the bullets generated so far
  bullets.forEach(bullet => {
    bullet.draw();
  });

  ///// END: DRAW ALL GAME OBJECTS /////

  ///// CLEAN ALL GAME OBJECTS NO LONGER INSIDE THE CANVAS /////

  // clean platforms PLATFORMS
  cleanPlatforms();

  // clean weapons
  cleanWeapons();

  // clean bullets
  cleanBullets();

  // clean clouds
  cleanClouds();

  // clean enemies
  cleanEnemies();

  ///// END: CLEAN ALL GAME OBJECTS NO LONGER INSIDE THE CANVAS /////

  ///// GENERATE NEW OBJECTS /////

  // generate new platfomrms if needed
  generateRandomPlatforms();

  // generate new clouds
  if (frames % 100 === 0) {
    clouds.push(new Cloud(images.clouds));
  }

  enemies.forEach(enemy => {
    if (enemy.active) {
      if (frames % enemy.shootFreq === 0) {
        let bullet = new Bullet(enemy.x, enemy.y + 30, 7, "#e0dbd1", enemy);
        bullet.velX = enemy.shootVelX;
        bullet.velY = enemy.shootVelY;
        bullets.push(bullet);
      }
    }
  });

  // generate new weapons
  if (board.totalMovement > 0 && board.totalMovement % 1000 === 0) {
    weapons.push(
      new Weapon(
        randomIntFromInterval(0, canvas.width - 20),
        0,
        20,
        20,
        images.weapon
      )
    );
  }

  // generate new enemies
  if (board.totalMovement > 0 && board.totalMovement % 1200 === 0) {
    enemies.push(
      new Enemy(
        randomIntFromInterval(0, canvas.width - 40),
        0,
        40,
        80,
        images.enemy
      )
    );
  }

  ///// END GENERATE NEW OBJECTS /////

  enemies.forEach(enemy => {
    if (enemy.active) {
      //jump
      enemy.y += enemy.velY;
      enemy.velY += gravity;

      //bullet collition
      bullets.forEach(bullet => {
        if (enemy !== bullet.shooter) {
          if (collisionCheck(enemy, bullet)) {
            enemy.active = false;
            bullet.active = false;
          }
        }
      });

      // platform collition
      enemy.isGrounded = false;
      platforms.forEach(platform => {
        if (platform.active) {
          const direction = collisionCheck(enemy, platform);
          if (direction == "left" || direction == "right") {
            enemy.velX = 0;
          } else if (direction == "bottom") {
            enemy.isGrounded = true;
          } else if (direction == "top") {
            enemy.velY *= -1;
          }
        }
      });

      if (enemy.isGrounded) {
        enemy.velY = 0;
      }
    }
  });

  weapons.forEach(weapon => {
    if (weapon.active) {
      //jump
      weapon.y += weapon.velY;
      weapon.velY += gravity;

      // platform collition
      weapon.isGrounded = false;
      platforms.forEach(platform => {
        if (platform.active) {
          const direction = collisionCheck(weapon, platform);
          if (direction == "left" || direction == "right") {
            weapon.velX = 0;
          } else if (direction == "bottom") {
            weapon.isGrounded = true;
          } else if (direction == "top") {
            weapon.velY *= -1;
          }
        }
      });

      if (weapon.isGrounded) {
        weapon.velY = 0;
      }
    }
  });

  bullets.forEach(bullet => {
    bullet.x += bullet.velX;
    bullet.y += bullet.velY;
  });

  clouds.forEach(cloud => cloud.move());

  currentPlayers.forEach(player => {
    if (player.char.active) {
      if (player.char.y <= (2 * canvas.height) / 3) {
        board.move();
        platforms.forEach(plat => plat.move());
        clouds.forEach(cloud => cloud.y++);
        bullets.forEach(bullet => bullet.y++);
      }

      //jump
      if (player.char.keys[player.controls.up]) {
        if (!player.char.isJumping) {
          player.char.velY = -player.char.jumpStrength * 2;
          player.char.isJumping = true;
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
        if (player.char.armed) {
          player.char.keys[player.controls.shoot] = false;

          let bullet = new Bullet(
            player.char.x,
            player.char.y + 10,
            7,
            "#e0dbd1",
            player.char
          );

          if (player.char.keys[player.controls.left]) {
            bullet.velX = -1 * bullet.speed;
          } else if (player.char.keys[player.controls.right]) {
            bullet.velX = 1 * bullet.speed;
          } else {
            bullet.velX = 0;
          }

          if (player.char.keys[player.controls.up]) {
            bullet.velY = -1 * bullet.speed;
          } else if (player.char.keys[player.controls.down]) {
            bullet.velY = 1 * bullet.speed;
          } else {
            bullet.velY = 0;
          }

          if (bullet.velX !== 0 || bullet.velY !== 0) {
            bullets.push(bullet);
          }
        }
      }

      //jump
      player.char.y += player.char.velY;
      player.char.velY += gravity;

      //movimiento
      player.char.x += player.char.velX;
      player.char.velX *= friction;

      //bullet collition
      bullets.forEach(bullet => {
        if (player.char !== bullet.shooter) {
          if (collisionCheck(player.char, bullet)) {
            player.char.active = false;
            bullet.active = false;
            player.score = board.totalMovement;
            stopGame();
          }
        }
      });

      // characater falls down -> dead
      if (player.char.y + player.char.height > canvas.height) {
        player.char.active = false;
        player.score = board.totalMovement;
        stopGame();
      }

      // limit collition
      limits.forEach(limit => {
        const direction = collisionCheck(player.char, limit);
        if (direction == "left" || direction == "right") {
          player.char.velX = 0;
        } else if (direction == "bottom") {
          player.char.isJumping = false;
          player.char.isGrounded = true;
        } else if (direction == "top") {
          player.char.velY *= -1;
        }
      });

      // weapon collition
      weapons.forEach(weapon => {
        if (collisionCheck(player.char, weapon)) {
          player.char.armed = true;
          weapon.active = false;
        }
      });

      //enemy collition
      enemies.forEach(enemy => {
        if (enemy.active) {
          const direction = collisionCheck(player.char, enemy);
          if (direction) {
            player.char.active = false;
            player.score = board.totalMovement;
            stopGame();
          }
        }
      });

      // platform collition
      player.char.isGrounded = false;
      platforms.forEach(platform => {
        if (platform.active) {
          const direction = collisionCheck(player.char, platform);
          if (direction == "left" || direction == "right") {
            player.char.velX = 0;
          } else if (direction == "bottom") {
            player.char.isJumping = false;
            player.char.isGrounded = true;
            if (platform.constructor.name === "VanishingPlatform") {
              platform.countdown();
            } else if (platform.constructor.name === "TractionPlatform") {
              player.char.x += platform.traction ? 1 : -1;
            }
          } else if (direction == "top") {
            player.char.velY *= -1;
          }
        }
      });

      if (player.char.isGrounded) {
        player.char.velY = 0;
      }
    }
  });

  frames++;
}
