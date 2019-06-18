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
