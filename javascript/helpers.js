function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function loadImage(imgSrc) {
  let img = new Image();
  img.src = imgSrc;
  return img;
}

function collisionCheck(gameObject1, gameObject2) {
  const vectorX =
    gameObject1.x +
    gameObject1.width / 2 -
    (gameObject2.x + gameObject2.width / 2);
  const vectorY =
    gameObject1.y +
    gameObject1.height / 2 -
    (gameObject2.y + gameObject2.height / 2);

  const halfWidths = gameObject1.width / 2 + gameObject2.width / 2;
  const halfHeights = gameObject1.height / 2 + gameObject2.height / 2;

  let collisionDirection = null;

  if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
    var offsetX = halfWidths - Math.abs(vectorX);
    var offsetY = halfHeights - Math.abs(vectorY);
    if (offsetX < offsetY) {
      if (vectorX > 0) {
        collisionDirection = "left";
        gameObject1.x += offsetX;
      } else {
        collisionDirection = "right";
        gameObject1.x -= offsetX;
      }
    } else {
      if (vectorY > 0) {
        collisionDirection = "top";
        gameObject1.y += offsetY;
      } else {
        collisionDirection = "bottom";
        gameObject1.y -= offsetY;
      }
    }
  }
  return collisionDirection;
}

function generateInitialPlatforms() {
  let list = [];
  let platWidth = 100;
  let platHeight = 20;
  let i = 0;

  do {
    let platLeft = new Platform(
      i * platWidth,
      canvas.height - platHeight - i * platHeight,
      platWidth,
      platHeight,
      images.platform
    );
    let platRight = new Platform(
      canvas.width - platWidth - i * platWidth,
      canvas.height - platHeight - i * platHeight,
      platWidth,
      platHeight,
      images.platform
    );
    list.push(platLeft, platRight);
    i++;
  } while (i < 5);

  let platMiddle = new Platform(
    i * platWidth + platWidth / 2,
    canvas.height - platHeight - (i + 1) * platHeight,
    platWidth,
    platHeight,
    images.platform,
    !!randomIntFromInterval(0, 1)
  );
  list.push(platMiddle);

  //Tests
  // list.push(new Platform(0, 320, canvas.width, 20, img));

  return list;
}

function generateRandomPlatforms() {
  let maxXDistance = 50;
  let minXDistance = 30;
  let maxYDistance = 70;
  let minYDistance = 60;
  let minWidth = 60;
  let maxWidth = 150;

  while (platforms[platforms.length - 1].y > 0) {
    let prevPlat = platforms[platforms.length - 1];

    let rndWidth = randomIntFromInterval(minWidth, maxWidth);

    let leftX, rightX;

    let dir = prevPlat.creationDir;

    if (randomIntFromInterval(0, 100) < 5) {
      dir = !dir;
    }

    if (prevPlat.x - rndWidth - maxXDistance < 10) {
      dir = false;
    } else if (prevPlat.x + prevPlat.width + maxXDistance > canvas.width - 10) {
      dir = true;
    }

    if (dir) {
      // Left direction
      leftX = prevPlat.x - rndWidth - maxXDistance;
      if (leftX < 0) leftX = 0;
      rightX = prevPlat.x - rndWidth - minXDistance;
    } else {
      // Right direction
      leftX = prevPlat.x + prevPlat.width + minWidth;
      if (leftX > canvas.width - 20) {
        leftX = canvas.width - 20;
      }

      rightX = prevPlat.x + prevPlat.width + maxXDistance;
      if (rightX > canvas.width - 10) {
        rightX = canvas.width - 10;
      }
    }

    let rndX = randomIntFromInterval(leftX, rightX);

    let rndY = randomIntFromInterval(
      prevPlat.y - 20 - maxYDistance,
      prevPlat.y - 20 - minYDistance
    );

    let plat;

    let rndType = randomIntFromInterval(0, 100);
    if (rndType < 20) {
      plat = new VanishingPlatform(
        rndX,
        rndY,
        rndWidth,
        20,
        images.platform,
        dir,
        randomIntFromInterval(3, 10)
      );
    } else if (rndType > 20 && rndType < 40) {
      plat = new TractionPlatform(
        rndX,
        rndY,
        rndWidth,
        20,
        images.platform,
        dir,
        !!randomIntFromInterval(0, 1)
      );
    } else {
      plat = new Platform(rndX, rndY, rndWidth, 20, images.platform, dir);
    }

    platforms.push(plat);
  }
}

function platformIsOutLimits(plat) {
  return plat.y > canvas.height;
}

function cleanPlatforms() {
  for (let i = 0; i < platforms.length; i++) {
    if (platformIsOutLimits(platforms[i]) || !platforms[i].active) {
      platforms.splice(i, 1);
      i--;
    }
  }
}

function weaponIsOutLimits(weapon) {
  return weapon.y > canvas.height;
}

function cleanWeapons() {
  for (let i = 0; i < weapons.length; i++) {
    if (weaponIsOutLimits(weapons[i]) || !weapons[i].active) {
      weapons.splice(i, 1);
      i--;
    }
  }
}

function bulletIsOutLimits(bullet) {
  return (
    bullet.x > canvas.width ||
    bullet.x + bullet.width / 2 < 0 ||
    bullet.y > canvas.height ||
    bullet.y + bullet.height / 2 < 0
  );
}

function cleanBullets() {
  for (let i = 0; i < bullets.length; i++) {
    if (bulletIsOutLimits(bullets[i]) || !bullets[i].active) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

function cloudsIsOutLimits(cloud) {
  return cloud.x > canvas.width || cloud.x + cloud.width < 0;
}

function cleanClouds() {
  for (let i = 0; i < clouds.length; i++) {
    if (cloudsIsOutLimits(clouds[i]) || !clouds[i].active) {
      clouds.splice(i, 1);
      i--;
    }
  }
}

function enemyIsOutLimits(enemy) {
  return enemy.y > canvas.height;
}

function cleanEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (enemyIsOutLimits(enemies[i]) || !enemies[i].active) {
      enemies.splice(i, 1);
      i--;
    }
  }
}