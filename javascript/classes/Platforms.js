class Platform extends GameImage {
    constructor(x, y, width, height, img, creationDir) {
      super(x, y, width, height, img);

      this.creationDir = creationDir;
    }
  
    move() {
      this.y++;
    }
  }
  
  
  class VanishingPlatform extends Platform{
    constructor(x, y, width, height, img, creationDir, timeout){
      super(x, y, width, height, img, creationDir);
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
  
  class TractionPlatform extends Platform{
    constructor(x, y, width, height, img, creationDir, traction){
      super(x, y, width, height, img, creationDir);
      this.traction = traction;
    }
  
    draw(){
      if (!this.active) return;
  
      super.draw();
      ctx.fillStyle = "#e0dbd1";
      ctx.font = "18px crayon";
      ctx.fillText(this.traction ? `> > >` : `< < <`, this.x + (this.width / 2)-20, this.y + (this.height / 2) + 30);
    }
  }