const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const ShipLine = require("./ship_line");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 100,
	SPEED: 4
};

class Capture extends MovingObject {
    constructor(options = {}) {
			options.color = DEFAULTS.COLOR;
			options.radius = Math.abs(Math.floor(options.startPos[0] - options.startPos[1])/3);
			super(options);
      this.startPos = options.startPos;
			this.endPos = options.endPos;
			// this.sprite = "images/qix_enemy.png"
			this.type = 'static'
			this.pos = Math.abs(this.startPos[0] - this.endPos[0]) > Math.abs(this.startPos[1] - this.endPos[1]) ?
				[this.endPos[0], this.endPos[1]]
				: [this.endPos[0], this.endPos[1]]
    }

    collideWith(otherObject) {

    }
}

module.exports = Capture;
