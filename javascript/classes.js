class GameObject {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  static WillTouchAny(x, y, width, height, listGameObjects) {
    let auxGameObject = new GameObject(x, y, width, height);
    let result;
    listGameObjects.forEach(item => {
      if (GameObject.IsTouching(auxGameObject, item)) {
        result = item;
      }
    });
    return result;
  }

  static IsTouchingAny(gameObject, listGameObjects) {
    let result = false;
    listGameObjects.forEach(item => {
      if (GameObject.IsTouching(gameObject, item)) {
        result = true;
      }
    });
    return result;
  }

  static IsTouching(gameObject1, gameObject2) {
    return (
      gameObject1.x < gameObject2.x + gameObject2.width &&
      gameObject1.x + gameObject1.width > gameObject2.x &&
      gameObject1.y < gameObject2.y + gameObject2.height &&
      gameObject1.y + gameObject1.height > gameObject2.y
    );
  }

  static WillBeOnTopAny(x, currentY, targetY, width, height, listGameObjects) {
    let result;

    for (let i = currentY; i <= targetY; i++) {
      let auxGameObject = new GameObject(x, i, width, height);

      listGameObjects.forEach(item => {
        if (GameObject.IsOnTop(auxGameObject, item)) {
          result = item;
        }
      });

      if (result) {
        break;
      }
    }

    return result;
  }

  static IsOnTopAny(gameObject, listGameObjects) {
    let result = false;
    listGameObjects.forEach(item => {
      if (GameObject.IsOnTop(gameObject, item)) {
        result = true;
      }
    });
    return result;
  }

  static IsOnTop(gameObject1, gameObject2) {
    return (
      gameObject1.x + gameObject1.width >= gameObject2.x &&
      gameObject1.x <= gameObject2.x + gameObject2.width &&
      gameObject1.y + gameObject1.height === gameObject2.y
    );
  }
}

class GameImage extends GameObject {
  constructor(x, y, width, height, img) {
    super(x, y, width, height);
    this.img = img;
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Board extends GameImage {
  constructor(width, height, img) {
    super(0, 0, width, height, img);
    this.draw();
  }

  draw(character) {
    super.draw();

    ctx.drawImage(
      this.img,
      this.x,
      this.y - this.height,
      this.width,
      this.height
    );
  }

  move() {
    this.y++;

    if (this.y > canvas.height) {
      this.y = 0;
    }

    return 1;
  }
}

class Character extends GameImage {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);

    this.isJumping = false;
    this.yJump = 0;

    this.isMovingLeft = false;
    this.isMovingRight = false;
  }

  draw(platforms, speedFactor) {
    super.draw();

    if (this.isMovingLeft) {
      let auxGameObject = GameObject.WillTouchAny(
        this.x - 1,
        this.y,
        this.width,
        this.height,
        platforms
      );
      if (auxGameObject) {
        this.x = auxGameObject.x + auxGameObject.width + 5;
        this.isJumping = false;
      } else {
        if (this.x - 1 >= 0) {
          this.x -= 1;
        }
      }
    } else if (this.isMovingRight) {
      let auxGameObject = GameObject.WillTouchAny(
        this.x + 1,
        this.y,
        this.width,
        this.height,
        platforms
      );
      if (auxGameObject) {
        this.x = auxGameObject.x - this.width - 5;
        this.isJumping = false;
      } else {
        if (this.x + this.width + 1 <= canvas.width) {
          this.x += 1;
        }
      }
    }

    if (this.isJumping) {
      this.yJump += speedFactor;

      if (this.y - 3 > this.yJump) {
        let auxGameObject = GameObject.WillTouchAny(
          this.x,
          this.y - 4,
          this.width,
          this.height,
          platforms
        );
        if (auxGameObject) {
          this.y = auxGameObject.y + auxGameObject.height;
          this.isJumping = false;
        } else {
          this.y = this.y - 4 - speedFactor;
        }
      } else {
        this.y = this.yJump;
        this.isJumping = false;
      }
    } else {
      if (!GameObject.IsOnTopAny(this, platforms)) {
        this.gravity(speedFactor);
      }
      // if (!GameObject.IsOnTopAny(this, platforms))
      //    {
      //      let aux = GameObject.WillBeOnTopAny(this.x, this.y, this.y + 1 + speedFactor, this.width, this.height, platforms)
      //      if(aux) {
      //        this.y = aux.y;
      //      }
      //      else {
      //         this.gravity(speedFactor);
      // }}
      // else{
      //   this.gravity(speedFactor);
      // }
    }
  }

  gravity(speedFactor) {
    this.y = this.y + 1 + speedFactor;
  }

  jump() {
    if (!this.isJumping) {
      if (GameObject.IsOnTopAny(this, platforms)) {
        this.yJump = this.y - 100;
        this.isJumping = true;
      }
    }
  }

  moveLeft() {
    if (!this.isMovingLeft) {
      this.isMovingRight = false;
      this.isMovingLeft = true;
    }
  }

  moveRight() {
    if (!this.isMovingRight) {
      this.isMovingLeft = false;
      this.isMovingRight = true;
    }
  }

  stopMovingRight() {
    this.isMovingRight = false;
  }

  stopMovingLeft() {
    this.isMovingLeft = false;
  }

  moveDown() {
    this.isJumping = false;
  }
}

class Platform extends GameImage {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }

  static GenerateInitial(img) {
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
        img
      );
      let platRight = new Platform(
        canvas.width - platWidth - i * platWidth,
        canvas.height - platHeight - i * platHeight,
        platWidth,
        platHeight,
        img
      );
      list.push(platLeft, platRight);
      i++;
    } while (i < 4);

    let platMiddle = new Platform(
      i * platWidth + platWidth / 2,
      canvas.height - platHeight - (i + 1) * platHeight,
      platWidth,
      platHeight,
      img
    );
    list.push(platMiddle);

    //Tests
    // list.push(new Platform(0, 320, canvas.width, 20, img));

    return list;
  }

  static GenerateRandom(platforms, img) {
    let maxXDistance = 20;
    let maxYDistance = 70;
    let minYDistance = 30;
    let minWidth = 30;
    let maxWidth = 100;
    let prevPlat = platforms[platforms.length - 1];

    let rndWidth = randomIntFromInterval(minWidth, maxWidth);

    let leftX, rightX;

    let rndDir = randomIntFromInterval(0, 1) === 0;

    if (prevPlat.x - rndWidth - maxXDistance < 10) {
      rndDir = false;
    } else if (prevPlat.x + prevPlat.width + maxXDistance > canvas.width - 10) {
      rndDir = true;
    }

    if (rndDir) {
      // Left direction
      leftX = prevPlat.x - rndWidth - maxXDistance;
      if (leftX < 0) leftX = 0;
      rightX = prevPlat.x - rndWidth;
    } else {
      // Light direction
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

    let plat = new Platform(rndX, rndY, rndWidth, 20, img);
    platforms.push(plat);
  }

  static GenerateRandom2(platforms, img) {
    let refY = platforms[platforms.length - 1].y;

    if (refY > 0) {
      let minYDistance = 70;
      let minXDistance = 20;
      let minWidth = 30;
      let maxWidth = 100;
      // - When character.y < canvas.height / 2
      // - Random size (min && max)
      // - y >= previous platforms
      // - Close enough to the previous Platforms

      let genLeft = randomIntFromInterval(0, 9) < 5;

      // genLeft = false;
      let refX;
      let rndX;
      if (genLeft) {
        refX = platforms[platforms.length - 1].x - minXDistance - maxWidth;
        if (refX < 0) {
          refX = 0;
        }
        rndX = randomIntFromInterval(
          refX,
          platforms[platforms.length - 1].width / 2
        );
      } else {
        refX =
          platforms[platforms.length - 1].x +
          platforms[platforms.length - 1].width +
          minXDistance;

        if (refX > canvas.width - 20) {
          refX = canvas.width - 20;
        }
        rndX = randomIntFromInterval(
          platforms[platforms.length - 1].x +
            platforms[platforms.length - 1].width / 2,
          refX
        );
      }

      let rndWidth = randomIntFromInterval(minWidth, maxWidth);

      //Calcular y: random entre min(platforms.y) y minYDistancia entre plataformas
      let rndY = randomIntFromInterval(
        platforms[platforms.length - 1].y -
          minYDistance -
          platforms[platforms.length - 1].height,
        platforms[platforms.length - 1].y -
          platforms[platforms.length - 1].height
      );

      let plat = new Platform(rndX, rndY, rndWidth, 20, img);
      platforms.push(plat);
    }
  }

  static IsOutLimits(plat) {
    return plat.y > canvas.height;
  }

  static Clean(list) {
    for (let i = 0; i < list.length; i++) {
      if (Platform.IsOutLimits(list[i])) {
        list.splice(i, 1);
        i--;
      }
    }
  }

  static DrawAll(list) {
    list.forEach(function(p) {
      p.draw();
    });
  }

  static MoveAll(list) {
    list.forEach(function(item) {
      item.move();
    });
  }

  move() {
    this.y++;
  }
}
