class GameObject {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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

class Limits extends GameObject{
  constructor(x, y, width, height, color){
    super(x, y, width, height);

    this.color = color;
  }

  draw(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
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

    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.jumpStrength = 7;
    this.isJumping = false;
    this.isGrounded = false;   
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
