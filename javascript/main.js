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
    if (e.keyCode === 86) {
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
        loadImage("./images/stickman_walk-left.png"),
        loadImage("./images/stickman_run-left_1.png"),
        loadImage("./images/stickman_run-left_2.png")
      ],
      loadImage("./images/stickman.png"),
      [
        loadImage("./images/stickman_walk-right.png"),
        loadImage("./images/stickman_run-right_1.png"),
        loadImage("./images/stickman_run-right_2.png")
      ]
    ],
    jumping: [
      loadImage("./images/stickman_jump-left.png"),
      loadImage("./images/stickman_jump.png"),
      loadImage("./images/stickman_jump-right.png")
    ]
  };

  images.character2 = {
    grounded: [
      [
        loadImage("./images/stickgirl_walk-left.png"),
        loadImage("./images/stickgirl_run-left_1.png"),
        loadImage("./images/stickgirl_run-left_2.png")
      ],
      loadImage("./images/stickgirl.png"),
      [
        loadImage("./images/stickgirl_walk-right.png"),
        loadImage("./images/stickgirl_run-right_1.png"),
        loadImage("./images/stickgirl_run-right_2.png")
      ]
    ],
    jumping: [
      loadImage("./images/stickgirl_jump-left.png"),
      loadImage("./images/stickgirl_jump.png"),
      loadImage("./images/stickgirl_jump-right.png")
    ]
  };

  images.platform = loadImage("./images/eraser.png");

  images.clouds = [
    loadImage("./images/cloud1.png"),
    loadImage("./images/cloud2.png"),
    loadImage("./images/cloud3.png"),
    loadImage("./images/cloud4.png"),
    loadImage("./images/cloud5.png"),
    loadImage("./images/cloud6.png")
  ];
  
  images.weapon = loadImage("./images/gun.png");
  images.enemy = loadImage("./images/badguy.png");
});

document.querySelector("#twoPlayers").addEventListener("change", e => {
  if (e.target.checked) {
    document.querySelector("#singlePlayer").checked = false;
    document.querySelector("#player2").style.display = "inherit";
  } else {
    document.querySelector("#singlePlayer").checked = true;
    document.querySelector("#player2").style.display = "none";
  }
});

document.querySelector("#singlePlayer").addEventListener("change", e => {
  if (e.target.checked) {
    document.querySelector("#twoPlayers").checked = false;
    document.querySelector("#player2").style.display = "none";
  } else {
    document.querySelector("#twoPlayers").checked = true;
    document.querySelector("#player2").style.display = "inherit";
  }
});

document.querySelector("button").addEventListener("click", () => {
  

  currentPlayers = [];

  let name1 = document.querySelector("#player1-name").value;
  if (name1.length === 0) {
    alert("Dale un nombre al jugador 1.");
    return;
  }

  let images1;

  if (monito1.classList.contains("selected")){
    images1 = images.character1;
  }
  else{
    images1 = images.character2;
  }

  let player1 = new Player(
    name1,
    new Character(
      50,
      canvas.height - 100,
      40,
      80,
      images1.grounded[1],
      images1.grounded,
      images1.jumping,
      controls1
    ),
    controls1
  );

  currentPlayers.push(player1);

  if (document.querySelector("#twoPlayers").checked) {
    let name2 = document.querySelector("#player2-name").value;
    if (name2.length === 0) {
      alert("Dale un nombre al jugador 2.");
      return;
    }

    if (name1 === name2) {
      alert("Los jugadores no puden tener el mismo nombre.");
      return;
    }

    let images2;

    if (monito2.classList.contains("selected")){
      images2 = images.character1;
    }
    else{
      images2 = images.character2;
    }

    let player2 = new Player(
      document.querySelector("#player2-name").value,
      new Character(
        canvas.width - 50,
        canvas.height - 100,
        40,
        80,
        images2.grounded[1],
        images2.grounded,
        images2.jumping,
        controls2
      ),
      controls2
    );

    currentPlayers.push(player2);
  }

  document.querySelector(".config").style.display = "none";
  document.querySelector(".game").style.display = "inherit";
  startGame();
});

let scoreboard = document.querySelector(".scoreboard ul");

function updateScoreboard() {
  document
    .querySelectorAll(".scoreboard li")
    .forEach(li => li.parentNode.removeChild(li));

  players.forEach(player => {
    let li = document.createElement("li");
    li.innerText = `${player.name}: ${player.score}`;
    scoreboard.appendChild(li);
  });
}

let monito1 = document.querySelector("#monito1");
let monita1 = document.querySelector("#monita1");
let monito2 = document.querySelector("#monito2");
let monita2 = document.querySelector("#monita2");

monito1.addEventListener("click", () =>{
  if (!monito1.classList.contains("selected")){
    monito1.classList.toggle("selected");
    monita1.classList.toggle("selected");
  }
})

monita1.addEventListener("click", () =>{
  if (!monita1.classList.contains("selected")){
    monito1.classList.toggle("selected");
    monita1.classList.toggle("selected");
  }
})

monito2.addEventListener("click", () =>{
  if (!monito2.classList.contains("selected")){
    monito2.classList.toggle("selected");
    monita2.classList.toggle("selected");
  }
})

monita2.addEventListener("click", () =>{
  if (!monita2.classList.contains("selected")){
    monito2.classList.toggle("selected");
    monita2.classList.toggle("selected");
  }
})