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
      if (this.pos[0] > 1000 ||
        this.pos[0] < 0 ||
        this.pos[1] > 600 ||
        this.pos[1] < 0) {
          this.relocate();
      }
      switch (direction){
        case 'right':
          if (direction === 'right' && this.isValidMove(this.pos) !== true) {
            console.log("OFFTRACK RIGHT");
            if (this.findNextMove(this.pos) === 'up') {
              console.log("ontrack up");
              this.vel[0] = 0;
              this.vel[1] = -2;
              break;
            } else if (this.findNextMove(this.pos) === 'down') {
              console.log("ontrack right");
              this.vel[0] = 0;
              this.vel[1] = 2;
              break;
            }
          } break;
        case 'up':
          if (direction === 'up' && this.isValidMove(this.pos) !== true) {
          console.log("OFFTRACK UP");
            if (this.findNextMove(this.pos) === 'left') {
              console.log("ontrack left");
              this.vel[0] = -2;
              this.vel[1] = 0;
              break;
            } else if (this.findNextMove(this.pos) === 'right') {
              console.log("ontrack right");
              this.vel[0] = 2;
              this.vel[1] = 0;
              break;
            }
        } break;
        case 'down':
          if (direction === 'down' && this.isValidMove(this.pos) !== true) {
            console.log("OFFTRACK DOWN", this.pos);
            if (this.findNextMove(this.pos) === 'right') {
              console.log("ontrack right");
              this.vel[0] = 2;
              this.vel[1] = 0;
              break;
            } else {
              console.log("ontrack left");
              this.vel[0] = -2;
              this.vel[1] = 0;
              break;
            }
          } break;
        case 'left':
          if (direction === 'left' && this.isValidMove(this.pos) !== true) {
            console.log(this.findNextMove(this.pos));
            if (this.findNextMove(this.pos) === 'down') {
              this.vel[0] = 0;
              this.vel[1] = -2;
              console.log("ontrack down");
              break;
            } else if (this.findNextMove(this.pos) === 'up') {
              this.vel[0] = 0;
              this.vel[1] = 2;
              console.log("ontrack up");
              break;
            }
          } break;
        }
    }
  }

  isValidMove(pos) {
    return this.game.allowedTrack[pos];
  }

  findNextMove(pos, dir) {
    for (let j = 0; j < 5; j++) {
      for (let i = 0; i < 5; i++) {
        console.log(pos[0] + i, pos[1])
        console.log(this.game.allowedTrack[[pos[0] + i, pos[1]]]);
        if (this.game.allowedTrack[[pos[0] + i, pos[1] + j]] === true ||
          this.game.allowedTrack[[pos[0] + i, pos[1] - j]] === true) {
          return 'right';
        } else if (this.game.allowedTrack[[pos[0] - i, pos[1] + j]] === true ||
          this.game.allowedTrack[[pos[0] - i, pos[1] - j]] === true) {
          return 'left';
        } else if (this.game.allowedTrack[[pos[0] - j, pos[1] + i]] === true ||
          this.game.allowedTrack[[pos[0] + j, pos[1] + i]] === true ||
          this.game.allowedTrack[[pos[0], pos[1] + i]] === true) {
          return 'down';
        } else if (this.game.allowedTrack[[pos[0] - j, pos[1] - i]] === true ||
          this.game.allowedTrack[[pos[0] + j, pos[1] - i]] === true) {
          return'up';
        }
      }
    }
    console.log("fucked");
  }

  remove() {
    this.game.remove(this);
  }

  removeAll() {
    this.game.removeAll(this);
  }

  nextPossibleMoves(pos) {
    return [
      [
        pos[0] + 1, pos[1]
      ],
      [
        pos[0], pos[1] + 1
      ],
      [
        pos[0] - 1, pos[1]
      ],
      [
        pos[0], pos[1] - 1
      ]
    ];
  }
}



const NORMAL_FRAME_TIME_DELTA = 1000/50;

module.exports = MovingObject;
