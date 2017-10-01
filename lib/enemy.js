const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const ShipLine = require("./ship_line");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 25,
	SPEED: 4
};

class Ufo extends MovingObject {
    constructor(options = {}) {
      options.color = DEFAULTS.COLOR;
      options.pos = options.pos || options.game.randomPosition();
      options.radius = DEFAULTS.RADIUS;
      options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
			super(options);
			this.sprite = "images/qix_enemy.png"
    }

    collideWith(otherObject) {
     		if (otherObject instanceof Ship ||
					otherObject instanceof ShipLine) {
            otherObject.removeAll();
            return true;
        }
    }
}

module.exports = Ufo;
