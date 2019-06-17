function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  function loadImage(imgSrc) {
    let img = new Image();
    img.src = imgSrc;
    return img;
  }


  function writePlatfomsInfo(){
    span.innerText= platforms.length

    let lis = document.querySelectorAll("li");
    lis.forEach(li => ul.removeChild(li));

    platforms.forEach(plat => {
        let li = document.createElement("li");
        li.innerText = `(${plat.x}, ${plat.y}), (${plat.x+plat.width}, ${plat.y})`;
        ul.appendChild(li)
    })
    
  }