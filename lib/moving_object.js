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
      let radius = this.gRadius || this.radius
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
      let moves = this.nextPossibleMoves(this.pos)
      let quad = this.game.determineQuadrant(this.pos)
      let direction = Util.direction(this.vel)
      // console.log(direction)
      // console.log(this.game.allowedTrack)
      // console.log(this.pos)
      switch (direction) {
        case 'up':
          if (this.game.allowedTrack[[this.pos[0], this.pos[1] + 1]] !== true) {
            // this.game.allowedTrack[[this.pos[0] + 1, this.pos[1]]] !== true ? this.vel[0] = this.vel[1]
            
          }
        case 'down':
          if (this.isOnYTrack(this.pos) !== true) {
            if (this.isOnXTrack([this.pos[0] - 1, this.pos[1]])) {
              this.vel[0] = -2;
              this.vel[1] = 0;
            } else {
              this.vel[0] = 2;
              this.vel[1] = 0;
            }
            console.log("adfkljasdlk")
          }
        case 'left':
          if (this.game.allowedTrack[[this.pos[0] - 1, this.pos[1]]] !== true) {
            // this.game.allowedTrack[[this.pos[0], this.pos[1]] + 1] !== true ? this.vel[0] = this.vel[1]
            
          }
        case 'right':
          if (this.isOnXTrack(this.pos) !== true) {
            if (this.isOnYTrack([this.pos[0], this.pos[1] + 1])) {
              this.vel[0] = 0;
              this.vel[1] = 2;
            } else {
              this.vel[0] = 0;
              this.vel[1] = 2;
            }
          }
          // if (this.game.allowedTrack[[this.pos[0], this.pos[1]]] !== true) {
          //   console.log(this.game.allowedTrack[[this.pos[0], this.pos[1] + 1]])
          //   if (this.game.allowedTrack[[this.pos[0], this.pos[1]] + 1] === true) {
          //     this.vel[0] = 0;
          //     this.vel[1] = 2;
          //   } 
          // }
      }
      // moves.forEach(move => {
      //   if (this.game.allowedTrack[move]) {
      //     this.pos = move
      //     console.log("TEST")
      //   }
      // })
      // if (this.game.allowedTrack[this.pos]) {
      //   console.log(true)
      // }
      
      
      // if (this.pos[0] + offsetX < 52) {
      //   if (quad === 4) {
      //     this.vel[1] = this.vel[0];
      //     this.vel[0] = 0;
      //   } else {
      //     this.vel[1] = -this.vel[0];
      //     this.vel[0] = 0;
      //   }
      // }
  		// if (this.pos[0] + offsetX > 950) {
      //   if (quad === 2) {
      //     this.vel[1] = this.vel[0];
      //     this.vel[0] = 0;
      //   } else {
      //     this.vel[1] = -this.vel[0];
      //     this.vel[0] = 0;
      //   }
  		// }
      // if (this.pos[1] + offsetY < 52) {
      //   if (quad === 2) {
      //     this.vel[0] = this.vel[1];
      //     this.vel[1] = 0;
      //   } else {
      //     this.vel[0] = -this.vel[1];
      //     this.vel[1] = 0;
      //   }
        
      //   }
  		// if (this.pos[1] + offsetY > 550) {
      //   if (quad === 4) {
      //     this.vel[0] = this.vel[1];
      //     this.vel[1] = 0;
      //   } else {
      //     this.vel[0] = -this.vel[1];
      //     this.vel[1] = 0;
      //   }
      // }
    }
  }

  isOnXTrack(pos) {
    console.log(pos)
    for (let i = 0; i < 50; i++) {
      // console.log(i)
      if (this.game.allowedTrack[[pos[0], pos[1] + i]] === true) {
        return true
      } else if (this.game.allowedTrack[[pos[0], pos[1] - i]] === true){
        return true
      }
    }
  }

  isOnYTrack(pos) {
    console.log(pos)
    for (let i = 0; i < 50; i++) {
      if (this.game.allowedTrack[[pos[0] + i, pos[1]]] === true) {
        return true
      } else if (this.game.allowedTrack[[pos[0] - i, pos[1]]] === true) {
        return true
      }
    }
  }

  remove() {
    this.game.remove(this);
  }

  removeAll() {
    this.game.removeAll(this);
  }

  nextPossibleMoves(pos) {
    return [[pos[0] + 1, pos[1]], [pos[0], pos[1] + 1], [pos[0] - 1], pos[1], [pos[0], pos[1] - 1]]
  }
}
  


const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
