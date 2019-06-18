class Player {
  constructor(name, char, controls) {
    this.name = name;
    this.char = char;
    this.controls = controls;
    this.maxScore = 0;
    this.lastScore = 0;
  }
}

class Character extends GameImage {
  constructor(x, y, width, height, img, controls, name) {
    super(x, y, width, height, img);

    this.speed = 5;
    this.velX = 0;
    this.velY = 0;
    this.jumpStrength = 8;
    this.isJumping = false;
    this.isGrounded = false;
    this.controls = controls;
    this.name = name;
    this.score = 0;
    this.armed = false;
  }

  keys = [];
}
