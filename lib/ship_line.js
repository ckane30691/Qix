const MovingObject = require("./moving_object");
const Capture = require('./capture')
const Ufo = require('./enemy')

class ShipLine extends MovingObject {
  constructor(options) {
    options.radius = ShipLine.RADIUS;
    super(options);
    this.shipDir = options.shipDir;
    this.pos = options.pos
    this.game = options.game;
    this.type = 'mobile'
    this.vel = [0, 0]
    // console.log(this.shipDir);
  }
  isInCapture(otherObject) {
    if (otherObject instanceof Capture) {
      if (otherObject.isCollidedWith(this)) {
        return true;
      }
    }
  }

  collideWith(otherObject) {
    if (otherObject instanceof Ufo) {
      this.removeAll();
      return true;
    }
  }
}

ShipLine.RADIUS = 5;

module.exports = ShipLine;
