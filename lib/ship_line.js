const MovingObject = require("./moving_object");

class ShipLine extends MovingObject {
  constructor(options) {
    options.radius = ShipLine.RADIUS;
    super(options);
    this.isWrappable = false;
  }
}

ShipLine.RADIUS = 15;

module.exports = ShipLine;
