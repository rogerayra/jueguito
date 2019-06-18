function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function loadImage(imgSrc) {
  let img = new Image();
  img.src = imgSrc;
  return img;
}

function writePlatfomsInfo() {
  span.innerText = platforms.length;

  let lis = document.querySelectorAll("li");
  lis.forEach(li => ul.removeChild(li));

  platforms.forEach(plat => {
    let li = document.createElement("li");
    li.innerText = `(${plat.x}, ${plat.y}), (${plat.x + plat.width}, ${
      plat.y
    })`;
    ul.appendChild(li);
  });
}

function collisionCheck(gameObject1, gameObject2) {
  const vectorX = gameObject1.x + gameObject1.width / 2 - (gameObject2.x + gameObject2.width / 2);
  const vectorY = gameObject1.y + gameObject1.height / 2 - (gameObject2.y + gameObject2.height / 2);

  const halfWidths = gameObject1.width / 2 + gameObject2.width / 2;
  const halfHeights = gameObject1.height / 2 + gameObject2.height / 2;

  let collisionDirection = null;

  if (Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights) {
    var offsetX = halfWidths - Math.abs(vectorX);
    var offsetY = halfHeights - Math.abs(vectorY);
    if (offsetX < offsetY) {
      if (vectorX > 0) {
        collisionDirection = "left";
        gameObject1.x += offsetX;
      } else {
        collisionDirection = "right";
        gameObject1.x -= offsetX;
      }
    } else {
      if (vectorY > 0) {
        collisionDirection = "top";
        gameObject1.y += offsetY;
      } else {
        collisionDirection = "bottom";
        gameObject1.y -= offsetY;
      }
    }
  }
  return collisionDirection;
}
