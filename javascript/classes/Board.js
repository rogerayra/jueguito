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
      randomIntFromInterval(-canvas.height, canvas.height/2),
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
