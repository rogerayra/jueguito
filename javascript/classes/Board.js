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
  constructor(x, y, width, height, img) {
    super(x, y, width, height, img);
  }
}
