const MovingObject = require("./moving_object");
const ShipLine = require("./ship_line");
const Util = require("./util");
const Capture = require("./capture")
const Ufo = require('./enemy')

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
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    super(options);
    // this.sprite = 'images/qix_ship.png'
    this.isDrawing = false;
    this.canDraw = true;
    this.isHiding = true;
    this.type = 'none'
  }

  drawLine() {
    if (this.isDrawing === true) {
      const shipLine = new ShipLine({
        pos: this.pos,
        vel: [0,0],
        color: this.color,
        game: this.game,
        shipDir: Util.direction(this.vel)
      });

      this.game.add(shipLine);
    }

  }

  power(impulse) {
    if (impulse[0] != -this.vel[0]) {
      this.vel[0] = impulse[0];
    }
    if (impulse[1] != -this.vel[1]) {
      this.vel[1] = impulse[1];
    }
  }

  // hide() {
  //   this.isHiding ? this.isHiding = false : this.isHiding = true
  // }

  relocate() {
    this.pos = this.game.shipRandomPos();
    this.vel = [0, 0];
  }

  collideWith(otherObject) {
    if (otherObject instanceof Capture && !this.isHiding) {
      [this.vel[0], this.vel[1]] = [-this.vel[0], -this.vel[1]]
    } else if (otherObject instanceof Ufo) {
      this.removeAll();
      return true;
    }
  }

  isInCapture(otherObject) {
    if (otherObject instanceof Capture) {
      if (otherObject.isCollidedWith(this)) {
        return true;
      }
    }
  }
}

Ship.RADIUS = 15;
module.exports = Ship;
