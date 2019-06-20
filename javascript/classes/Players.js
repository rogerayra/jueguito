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
