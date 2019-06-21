class GameObject {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = true;
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

class GameRect extends GameObject {
  constructor(x, y, width, height, color) {
    super(x, y, width, height);

    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class GameArc extends GameObject {
  constructor(x, y, width, color, initialAngle = 0, finalAngle = 2 * Math.PI) {
    super(x, y, width);

    this.initialAngle = initialAngle;
    this.finalAngle = finalAngle;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.width / 2, this.initialAngle, this.finalAngle);
    ctx.fill();
    ctx.closePath();
  }
}

class Board extends GameImage {
  constructor(width, height, img) {
    super(0, 0, width, height, img);
    this.draw();

    this.totalMovement = 0;
  }

  draw() {
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
    this.totalMovement++;

    if (this.y > canvas.height) {
      this.y = 0;
    }
  }
}

class Cloud extends GameImage {
  constructor(images) {
    let auxWidth = randomIntFromInterval(80, 200);
    let auxDir = !!randomIntFromInterval(0, 1);

    super(
      auxDir ? -auxWidth : canvas.width,
      randomIntFromInterval(-canvas.height, canvas.height / 2),
      auxWidth,
      randomIntFromInterval(40, 100),
      images[randomIntFromInterval(0, images.length - 1)]
    );

    this.dir = auxDir;
    this.framesRefersh = randomIntFromInterval(2, 7);
  }

  move() {
    if (frames % this.framesRefersh === 0) {
      if (this.dir) {
        this.x++;
      } else {
        this.x--;
      }
    }
  }
}

class Player {
  constructor(name, char, controls) {
    this.name = name;
    this.char = char;
    this.controls = controls;
    this.score = 0;
  }
}

class Character extends GameImage {
  constructor(
    x,
    y,
    width,
    height,
    img,
    imgGrounded,
    imgJumping,
    controls
  ) {
    super(x, y, width, height, img);

    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.jumpStrength = 10;
    this.isJumping = false;
    this.isGrounded = false;
    this.controls = controls;
    this.score = 0;
    this.armed = false;
    this.lastDirLeft = false;

    this.imgGrounded = imgGrounded;
    this.imgJumping = imgJumping;
  }

  keys = [];
  animatePosition = 0;
  animateHelper = [0, 1, 2];

  draw() {
    if (this.isJumping) {
      if (this.keys[this.controls.left]) {
        this.img = this.imgJumping[0];
      } else if (this.keys[this.controls.right]) {
        this.img = this.imgJumping[2];
      } else {
        this.img = this.imgJumping[1];
      }
    } else if (this.isGrounded) {
      if (this.keys[this.controls.left]) {
        if (frames % 5 === 0) {
          this.img = this.imgGrounded[0][this.animateHelper[this.animatePosition]];
          
          this.animatePosition++;
          if (this.animatePosition % this.animateHelper.length === 0) {
            this.animatePosition = 0;
          }
        }
      } else if (this.keys[this.controls.right]) {
        if (frames % 5 === 0) {
          this.img = this.imgGrounded[2][this.animateHelper[this.animatePosition]];
          
          this.animatePosition++;
          if (this.animatePosition % this.animateHelper.length === 0) {
            this.animatePosition = 0;
          }
        }
      } else {
        this.img = this.imgGrounded[1];
      }
    }
    super.draw();
  }
}

class Platform extends GameImage {
  constructor(x, y, width, height, img, creationDir) {
    super(x, y, width, height, img);

    this.creationDir = creationDir;
  }

  move() {
    this.y++;
  }
}


class VanishingPlatform extends Platform{
  constructor(x, y, width, height, img, creationDir, timeout){
    super(x, y, width, height, img, creationDir);
    this.timeout = timeout;
    this.countdonwOn = false;
  }

  draw(){
    if (!this.active) return;

    super.draw();
    ctx.fillStyle = "#e0dbd1";
    ctx.font = "18px crayon";
    ctx.fillText(`${this.timeout} s`, this.x + (this.width / 2)-10, this.y + (this.height / 2) + 30);
  }

  countdown(){
    if (this.countdonwOn) return;

    this.countdonwOn = true;

    setInterval(() => {
      this.timeout--;
      if (this.timeout <= 0){
        this.active = false;
      }

    }, 1000)
  }
}

class TractionPlatform extends Platform{
  constructor(x, y, width, height, img, creationDir, traction){
    super(x, y, width, height, img, creationDir);
    this.traction = traction;
  }

  draw(){
    if (!this.active) return;

    super.draw();
    ctx.fillStyle = "#e0dbd1";
    ctx.font = "18px crayon";
    ctx.fillText(this.traction ? `> > >` : `< < <`, this.x + (this.width / 2)-20, this.y + (this.height / 2) + 30);
  }
}

class Weapon extends GameImage {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);

    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.isGrounded = false;
  }
}

class Enemy extends GameImage {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);

    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.isGrounded = false;

    this.shootFreq = randomIntFromInterval(50, 80);
    this.shootVelX = randomIntFromInterval(0, 1);

    if (!!randomIntFromInterval(0, 1)){
      this.shootVelX *= -1;
    }

    this.shootVelY = randomIntFromInterval(0, 1);

    if (!!randomIntFromInterval(0, 1)){
      this.shootVelY *= -1;
    }

    if (this.shootVelX === 0 && this.shootVelY === 0){
      this.shootVelX = 1;
    }
  }
}

class Bullet extends GameArc {
  constructor(x, y, width, color, shooter) {
    super(x, y, width, color);

    this.speed = 15;
    this.velX = 0;
    this.velY = 0;
    this.shooter = shooter;
  }
}
