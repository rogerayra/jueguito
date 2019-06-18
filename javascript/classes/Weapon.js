class Weapon extends GameImage {
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);

    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.isGrounded = false;
  }
}

class Bullet extends GameArc {
  constructor(x, y, width, vectorX, vectorY, color) {
    super(x, y, width, color);

    this.vectorX = vectorX;
    this.vectorY = vectorY;

    this.speed = 20;
    this.velX = 0;
    this.velY = 0;
  }
}
