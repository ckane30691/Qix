const Util = require("./util");

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;
  }

  collideWith(otherObject) {
    // default do nothing
  }

  draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      let radius = this.gRadius || this.radius;
      ctx.arc(
        this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

  move(timeDelta) {
    //timeDelta is number of milliseconds since last move
    //if the computer is busy the time delta will be larger
    //in this case the MovingObject should move farther in this frame
    //velocity of object is how far it should move in 1/60th of a second
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
    let offsetX = this.vel[0] * velocityScale;
    let offsetY = this.vel[1] * velocityScale;
    let impactSound = document.getElementsByClassName("impact-sound")[0];
    if (this.type === 'mobile') {

      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

      if (this.pos[0] + offsetX < 70) {
        this.vel[0] = -this.vel[0];
        }
  		if (this.pos[0] + offsetX > 935) {
  			this.vel[0] = -this.vel[0];
  		}
      if (this.pos[1] + offsetY < 70) {
        this.vel[1] = -this.vel[1];
        }
  		if (this.pos[1] + offsetY > 535) {
  			this.vel[1] = -this.vel[1];
  		}
    } else {
      this.pos = [Math.floor(this.pos[0] + offsetX), Math.floor(this.pos[1] + offsetY)];
      let moves = this.nextPossibleMoves(this.pos);
      let quad = this.game.determineQuadrant(this.pos);
      let direction = Util.direction(this.vel);
      console.log(direction);
      // console.log(this.game.allowedTrack)
      // console.log(this.pos)
      switch (direction){
        case 'up':
          if (direction === 'up' && this.isOnYTrack(this.pos) !== true) {
          console.log("OFFTRACK UP");
            if (this.isOnXTrack([this.pos[0] - 1, this.pos[1]])) {
              console.log("moving up heading left");
              this.vel[0] = -2;
              this.vel[1] = 0;
              break;
            } else if (this.isOnXTrack([this.pos[0] + 1, this.pos[1]])) {
              console.log("moving up heading right");
              this.vel[0] = 2;
              this.vel[1] = 0;
              break;
            } else {
              this.vel[0] = 0;
              this.vel[1] = -this.vel[1];
              break;
          }
          }
        case 'down':
          if (direction === 'down' && this.isOnYTrack(this.pos) !== true) {
            console.log("END OF THE LINE");
            if (this.isOnXTrack([this.pos[0] - 1, this.pos[1]]) !== true) {
              console.log("moving down heading left");
              this.vel[0] = -2;
              this.vel[1] = 0;
              break;
            } else if (this.isOnXTrack([this.pos[0] + 1, this.pos[1]]) !== true) {
              console.log("moving down heading right");
              this.vel[0] = 2;
              this.vel[1] = 0;
              break;
            } else {
              this.vel[0] = 0;
              this.vel[1] = -this.vel[1];
              break;
            }
          }
        case 'left':
          console.log("LEFT WTF", direction);
          if (direction === 'left' && this.isOnXTrack(this.pos) !== true) {
            console.log("OFFTRACK LEFT");
            if (this.isOnYTrack([this.pos[0], this.pos[1] - 1]) !== true) {
              console.log("moving left heading Down");
              this.vel[0] = 0;
              this.vel[1] = 2;
              break;
            } else if (this.isOnYTrack([this.pos[0], this.pos[1] + 1]) !== true) {
              // console.log("moving left heading Up");
              // this.vel[0] = 0;
              // this.vel[1] = -2;
              break;
            } else {
              // this.vel[0] = -this.vel[0];
              // this.vel[1] = 0;
              break;
            }
          }
        case 'right':
          if (direction === 'right' && this.isOnXTrack(this.pos) !== true) {
          console.log("OFFTRACK RIGHT");
            if (this.isOnYTrack([this.pos[0], this.pos[1] + 1]) !== true) {
              this.vel[0] = 0;
              this.vel[1] = -2;
              break;
            } else if (this.isOnYTrack([this.pos[0], this.pos[1] - 1]) !== true) {
              this.vel[0] = 0;
              this.vel[1] = 2;
              break;
            } else {
              this.vel[0] = -this.vel[0];
              this.vel[1] = 0;
              break;
            }
          }
      }
    }
  }

  isOnXTrack(pos) {
    console.log(pos);
    for (let i = 0; i < 5; i++) {

      // console.log(i)
      if (this.game.allowedTrack[[pos[0] + 1, pos[1] + i]] === true) {
        console.log("FIRST X");
        return true;
      } else if (this.game.allowedTrack[[pos[0] + 1, pos[1] - i]] === true){
        console.log("SECOND X");
        return true;
      }
    }
  }

  isOnYTrack(pos) {
    for (let i = 0; i < 5; i++) {
      if (this.game.allowedTrack[[pos[0] + i, pos[1]]] === true) {
        console.log("FIRST Y");
        return true;
      } else if (this.game.allowedTrack[[pos[0] - i, pos[1]]] === true) {
        console.log("SECOND Y");
        return true;
      }
    }
    console.log(pos);
  }

  remove() {
    this.game.remove(this);
  }

  removeAll() {
    this.game.removeAll(this);
  }

  nextPossibleMoves(pos) {
    return [[pos[0] + 1, pos[1]], [pos[0], pos[1] + 1], [pos[0] - 1], pos[1], [pos[0], pos[1] - 1]];
  }
}



const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
