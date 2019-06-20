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

let players = [];

document.addEventListener("keydown", e => {
  if (!e.isTrusted) return;

  if (gameStarted) {
    currentPlayers.forEach(player => (player.char.keys[e.keyCode] = true));
  } else {
    if (e.keyCode === 86){
    document.querySelector(".config").style.display = "inherit";
    document.querySelector(".game").style.display = "none";
    }
  }
});

document.addEventListener("keyup", e => {
  if (!e.isTrusted) return;

  if (gameStarted) {
    currentPlayers.forEach(player => (player.char.keys[e.keyCode] = false));
  }
});

addEventListener("load", () => {
  images.background = loadImage("./images/chalkboard.png");
  images.background.addEventListener("load", () => {
    board = new Board(canvas.width, canvas.height, images.background);
  });

  limits.push(
    new GameRect(-1, 0, 0, canvas.height, "black"),
    new GameRect(canvas.width, 0, 0, canvas.height, "black"),
    new GameRect(0, -1, canvas.width, 0, "black")
  );

  images.character1 = {
    grounded: [
      [
        loadImage("./images/martona/stickman_walk-left.png"),
        loadImage("./images/martona/stickman_run-left_1.png"),
        loadImage("./images/martona/stickman_run-left_2.png")
      ],
      loadImage("./images/martona/stickman.png"),
      [
        loadImage("./images/martona/stickman_walk-right.png"),
        loadImage("./images/martona/stickman_run-right_1.png"),
        loadImage("./images/martona/stickman_run-right_2.png")
      ]
    ],
    jumping: [
      loadImage("./images/martona/stickman_jump-left.png"),
      loadImage("./images/martona/stickman_jump.png"),
      loadImage("./images/martona/stickman_jump-right.png")
    ]
  };

  images.character2 = {
    grounded: [
      [
        loadImage("./images/martona/stickgirl_walk-left.png"),
        loadImage("./images/martona/stickgirl_run-left_1.png"),
        loadImage("./images/martona/stickgirl_run-left_2.png")
      ],
      loadImage("./images/martona/stickgirl.png"),
      [
        loadImage("./images/martona/stickgirl_walk-right.png"),
        loadImage("./images/martona/stickgirl_run-right_1.png"),
        loadImage("./images/martona/stickgirl_run-right_2.png")
      ]
    ],
    jumping: [
      loadImage("./images/martona/stickgirl_jump-left.png"),
      loadImage("./images/martona/stickgirl_jump.png"),
      loadImage("./images/martona/stickgirl_jump-right.png")
    ]
  };
  
  images.platform = loadImage("./images/martona/eraser.png");
  
  images.clouds = [
    loadImage("./images/martona/cloud1.png"),
    loadImage("./images/martona/cloud2.png"),
    loadImage("./images/martona/cloud3.png"),
    loadImage("./images/martona/cloud4.png"),
    loadImage("./images/martona/cloud5.png"),
    loadImage("./images/martona/cloud6.png")
  ];
  images.sun = loadImage("./images/martona/sun.png");
  
  images.weapon = loadImage("./images/martona/gun.png");
  images.enemy = loadImage("./images/martona/badguy.png");
});

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
    new Character(
      50,
      canvas.height - 100,
      40,
      80,
      images.character1.grounded[1],
      images.character1.grounded,
      images.character1.jumping,
      controls1
    ),
    controls1
  );

  currentPlayers.push(player1);

  if (document.querySelector("#twoPlayers").checked) {
    let player2 = new Player(
      document.querySelector("#player2").value,
      new Character(
        canvas.width - 50,
        canvas.height - 100,
        40,
        80,
        images.character2.grounded[1],
        images.character2.grounded,
        images.character2.jumping,
        controls2
      ),
      controls2
    );

    currentPlayers.push(player2);
  }

  startGame();
});

let scoreboard = document.querySelector(".scoreboard ul");

function updateScoreboard(){
  document.querySelectorAll(".scoreboard li").forEach(li => li.parentNode.removeChild(li));
  
  players.forEach(player => {
    let li = document.createElement("li");
    li.innerText = `${player.name}: ${player.score}`;
    scoreboard.appendChild(li);
  })
 
}