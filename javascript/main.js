const span = document.querySelector("span");
const ul = document.querySelector("ul");

const images = {};

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let controls1 = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  shoot: 13
};

let controls2 = {
  left: 65,
  up: 87,
  right: 68,
  down: 83,
  shoot: 32
};

document.addEventListener("keydown", e => {
  if (!e.isTrusted) return;

  if (gameStarted) {
    currentPlayers.forEach(player => (player.char.keys[e.keyCode] = true));
  }
});

document.addEventListener("keyup", e => {
  if (!e.isTrusted) return;

  if (gameStarted) {
    currentPlayers.forEach(player => (player.char.keys[e.keyCode] = false));
  }
});

addEventListener("load", () => {
  images.background = loadImage("../images/chalkboard.png");
  images.background.addEventListener("load", () => {
    board = new Board(canvas.width, canvas.height, images.background);
  });

  limits.push(
    new Limits(-1, 0, 0, canvas.height, "black"),
    new Limits(canvas.width, 0, 0, canvas.height, "black"),
    new Limits(0, -1, canvas.width, 0, "black")
  );

  images.character1 = loadImage("../images/martona/stickman.png");
});

images.platform = loadImage("../images/platform.png");
// images.platform.addEventListener("load", () => {});

images.cloud = loadImage("../images/pushpin.png");

images.weapon = loadImage("../images/martona/gun.png");

document.querySelector("#twoPlayers").addEventListener("change", e => {
  if (e.target.checked) {
    document.querySelector("#singlePlayer").checked = false;
    document.querySelector(".player2").style.display = "inherit";
  } else {
    document.querySelector("#singlePlayer").checked = true;
    document.querySelector(".player2").style.display = "none";
  }
});

document.querySelector("#singlePlayer").addEventListener("change", e => {
  if (e.target.checked) {
    document.querySelector("#twoPlayers").checked = false;
    document.querySelector(".player2").style.display = "none";
  } else {
    document.querySelector("#twoPlayers").checked = true;
    document.querySelector(".player2").style.display = "inherit";
  }
});

document.querySelector("button").addEventListener("click", () => {
  document.querySelector(".config").style.display = "none";
  document.querySelector(".game").style.display = "inherit";

  currentPlayers = [];

    let player1 = new Player(
      document.querySelector("#player1").value,
      new Character(50, canvas.height - 100, 30, 50, images.character1),
      controls1
    );

    currentPlayers.push(player1);

    if (document.querySelector("#twoPlayers").checked) {
      let player2 = new Player(
        document.querySelector("#player2").value,
        new Character(
          canvas.width - 50,
          canvas.height - 100,
          30,
          50,
          images.character1
        ),
        controls2
      );

      currentPlayers.push(player2);
    }

    startGame();
});
