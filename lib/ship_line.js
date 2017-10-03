const MovingObject = require("./moving_object");

class ShipLine extends MovingObject {
  constructor(options) {
    options.radius = ShipLine.RADIUS;
    super(options);
    this.pos = options.pos
    this.game = options.game;
    this.type = 'mobile'
  }
}

ShipLine.RADIUS = 5;

module.exports = ShipLine;
