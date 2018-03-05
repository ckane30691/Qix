const MovingObject = require("./moving_object");
const ShipLine = require("./ship_line");
const Util = require("./util");
const Capture = require("./capture");
const Ufo = require('./enemy');

function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [2, 0];
    options.color = options.color || randomColor();
    super(options);
    this.isDrawing = false;
    this.canDraw = false;
    this.game = options.game;
    this.isHiding = true;
    this.gRadius = 11;
    this.prevPos = [null, null];
  }

  drawLine() {
    let delta = new Date().getTime() - this.lastCall;
    if (this.canDraw === true && this.isDrawing === true &&
      (this.pos[0] !== this.prevPos[0] ||
      this.pos[1] !== this.prevPos[1])) {
      const shipLine = new ShipLine({
        pos: this.pos,
        vel: [0,0],
        color: this.color,
        game: this.game,
        shipDir: Util.direction(this.vel)
      });
      this.lastCall = new Date().getTime();
      this.game.add(shipLine);
      this.prevPos = this.pos;
    }

  }

  power(impulse, k) {
    if (this.canDraw === false) {
      // console.log(this.game.allowedTrack[this.pos]);
      // console.log(this.game.allowedTrack[[this.pos[0] - 1, this.pos[1]]]);
      if (Util.direction(this.vel) === 'up' && k === 's' &&
        this.isValidMove([this.pos[0], this.pos[1] - 1])) {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
      } else if (Util.direction(this.vel) === 'down' && k === 'w' &&
        this.isValidMove([this.pos[0], this.pos[1] + 1])) {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
      } else if (Util.direction(this.vel) === 'left' && k === 'd' &&
        this.isValidMove([this.pos[0] + 1, this.pos[1]])) {
        this.vel[0] = impulse[0];
        this.vel[1] = impulse[1];
        // this.pos[0] += 1
      } else if (Util.direction(this.vel) === 'right' && k === 'a' &&
        this.isValidMove([this.pos[0] - 1, this.pos[1]])) {
        this.vel[0] = impulse[0];
        this.vel[1] = impulse[1];
        // this.pos[0] -= 1;
        // console.log("Kkkkasdlfkj")
      }

    } else {
      if (this.canDraw === true) {
        this.isDrawing = true;
        if (Util.direction(this.vel) === 'up' && k != 's') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        } else if (Util.direction(this.vel) === 'down' && k != 'w') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        } else if (Util.direction(this.vel) === 'left' && k != 'd') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        } else if (Util.direction(this.vel) === 'right' && k != 'a') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        }
      }
    }
  }

  relocate() {
    this.pos = this.game.shipRandomPos();
    this.vel = [2, 0];
  }

  collideWith(otherObject) {
    if (otherObject instanceof ShipLine) {
      // console.log(this.game.shipLines.indexOf(otherObject))
      // console.log(this.game.shipLines.length)
      if (this.game.shipLines.indexOf(otherObject) - this.game.shipLines.length < -5) {
        this.removeAll();
        this.canDraw = false;
        this.color = '#f71b3c';
      }
    } else if (otherObject instanceof Ufo) {
      this.removeAll();
      this.canDraw = false;
      this.color = '#f71b3c';
      return true;
    } else if (otherObject instanceof Capture) {
      let dir = Util.direction(this.vel);
          switch (dir) {
        case 'up':
          this.vel = [0, 2];
          break;
        case 'down':
          this.vel = [0, 2];
          break;
        case 'left':
          this.vel = [-2, 0];
          break;
        default:
          this.vel = [-2, 0];
      }
    }
  }

  isInCapture(otherObject) {
    if (otherObject instanceof Capture) {
      if (otherObject.isCollidedWith(this)) {
        // console.log("ture")
        return true;
      }
    }
  }
}

Ship.RADIUS = 5;
module.exports = Ship;
