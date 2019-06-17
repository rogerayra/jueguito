const span = document.querySelector("span");
const ul = document.querySelector("ul");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
let interval = 0;
let frames = 0;
let platforms = [];
let board;
let character1;

const images = {};

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let speedFactor = 0;

  if (character1 && character1.y < canvas.height / 2) {
    //if (character1 && character1.y < canvas.height - 100) {
    speedFactor = board.move();
    Platform.Clean(platforms);
    Platform.MoveAll(platforms);
  }

  while (platforms[platforms.length - 1].y > 0) {
    Platform.GenerateRandom(platforms, images.platform);
  }

  board.draw();
  Platform.DrawAll(platforms);
  character1.draw(platforms, speedFactor);

  writePlatfomsInfo();

  frames++;
}

document.addEventListener("keydown", e => {
  if (!e.isTrusted) return;

  switch (e.keyCode) {
    case 37:
      character1.moveLeft();
      break;
    case 38:
      character1.jump();
      break;
    case 39:
      character1.moveRight();
      break;
    case 40:
      character1.moveDown();
      break;
  }
});

document.addEventListener("keyup", e => {
  if (!e.isTrusted) return;

  switch (e.keyCode) {
    case 37:
      character1.stopMovingLeft();
      break;
    case 38:
      // character1.jump();
      break;
    case 39:
      character1.stopMovingRight();
      break;
    case 40:
      // character1.moveDown();
      break;
  }
});

addEventListener("load", () => {
  images.background = loadImage("../images/clouds.png");
  images.background.addEventListener("load", () => {
    board = new Board(canvas.width, canvas.height, images.background);
  });

  images.character1 = loadImage("../images/flappy.png");
  images.character1.addEventListener("load", () => {
    character1 = new Character(
      50,
      canvas.height - 50,
      20,
      20,
      images.character1
    );
  });

  images.platform = loadImage("../images/platform.png");
  images.platform.addEventListener("load", () => {
    platforms = Platform.GenerateInitial(images.platform);
    Platform.GenerateRandom(platforms, images.platform);
  });

  document.querySelector("button").addEventListener("click", () => {
    interval = setInterval(update, 1000 / 60);
  });
});
