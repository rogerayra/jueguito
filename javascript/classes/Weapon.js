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
