class Platform extends GameImage {
    constructor(x, y, width, height, img) {
      super(x, y, width, height, img);
    }
  
    static GenerateInitial(img) {
      let list = [];
      let platWidth = 100;
      let platHeight = 20;
      let i = 0;
  
      do {
        let platLeft = new Platform(
          i * platWidth,
          canvas.height - platHeight - i * platHeight,
          platWidth,
          platHeight,
          img
        );
        let platRight = new Platform(
          canvas.width - platWidth - i * platWidth,
          canvas.height - platHeight - i * platHeight,
          platWidth,
          platHeight,
          img
        );
        list.push(platLeft, platRight);
        i++;
      } while (i < 5);
  
      let platMiddle = new Platform(
        i * platWidth + platWidth / 2,
        canvas.height - platHeight - (i + 1) * platHeight,
        platWidth,
        platHeight,
        img
      );
      list.push(platMiddle);
  
      //Tests
      // list.push(new Platform(0, 320, canvas.width, 20, img));
  
      return list;
    }
  
    static GenerateRandom(platforms, img) {
      let maxXDistance = 30;
      let maxYDistance = 70;
      let minYDistance = 35;
      let minWidth = 30;
      let maxWidth = 100;
      let prevPlat = platforms[platforms.length - 1];
  
      let rndWidth = randomIntFromInterval(minWidth, maxWidth);
  
      let leftX, rightX;
  
      let rndDir = randomIntFromInterval(0, 1) === 0;
  
      if (prevPlat.x - rndWidth - maxXDistance < 10) {
        rndDir = false;
      } else if (prevPlat.x + prevPlat.width + maxXDistance > canvas.width - 10) {
        rndDir = true;
      }
  
      if (rndDir) {
        // Left direction
        leftX = prevPlat.x - rndWidth - maxXDistance;
        if (leftX < 0) leftX = 0;
        rightX = prevPlat.x - rndWidth;
      } else {
        // Light direction
        leftX = prevPlat.x + prevPlat.width + minWidth;
        if (leftX > canvas.width - 20) {
          leftX = canvas.width - 20;
        }
  
        rightX = prevPlat.x + prevPlat.width + maxXDistance;
        if (rightX > canvas.width - 10) {
          rightX = canvas.width - 10;
        }
      }
  
      let rndX = randomIntFromInterval(leftX, rightX);
  
      let rndY = randomIntFromInterval(
        prevPlat.y - 20 - maxYDistance,
        prevPlat.y - 20 - minYDistance
      );
  
      // let plat = new Platform(rndX, rndY, rndWidth, 20, img);
      let plat = new VanishingPlatform(rndX, rndY, rndWidth, 20, img, 10);
      platforms.push(plat);
    }
  
    static IsOutLimits(plat) {
      return plat.y > canvas.height;
    }
  
    static Clean(list) {
      for (let i = 0; i < list.length; i++) {
        if (Platform.IsOutLimits(list[i])) {
          list.splice(i, 1);
          i--;
        }
      }
    }
  
    static DrawAll(list) {
      list.forEach(function(p) {
        p.draw();
      });
    }
  
    static MoveAll(list) {
      list.forEach(function(item) {
        item.move();
      });
    }
  
    move() {
      this.y++;
    }
  }
  
  
  class VanishingPlatform extends Platform{
    constructor(x, y, width, height, img, timeout){
      super(x, y, width, height, img, timeout);
      this.timeout = timeout;
      this.countdonwOn = false;
    }
  
    draw(){
      if (!this.active) return;
  
      super.draw();
      ctx.fillStyle = "#e0dbd1";
      ctx.font = "18px crayon";
      ctx.fillText(`${this.timeout} s`, this.x + (this.width / 2)-10, this.y + (this.height / 2) + 30);
    }
  
    countdown(){
      if (this.countdonwOn) return;
  
      this.countdonwOn = true;
  
      setInterval(() => {
        this.timeout--;
        if (this.timeout <= 0){
          this.active = false;
        }
  
      }, 1000)
    }
  }
  
  // class MovingPlatform extends Platform{
  //   constructor(x, y, width, height, img, direction, speed, ){
  //     super(x, y, width, height, img, timeout);
  //     this.timeout = timeout;
  //     this.countdonwOn = false;
  //   }
  
  //   draw(){
  //     if (!this.active) return;
  
  //     super.draw();
  //     ctx.fillStyle = "red";
  //     ctx.font = "15px Arial";
  //     ctx.fillText(`${this.timeout} s`, this.x + (this.width / 2)-10, this.y + (this.height / 2) + 30);
  //   }
  
  //   countdown(){
  //     if (this.countdonwOn) return;
  
  //     this.countdonwOn = true;
  
  //     setInterval(() => {
  //       this.timeout--;
  //       if (this.timeout <= 0){
  //         this.active = false;
  //       }
  
  //     }, 1000)
  //   }
  // }