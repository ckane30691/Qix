const MovingObject = require("./moving_object");

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
}

ShipLine.RADIUS = 5;

module.exports = ShipLine;
