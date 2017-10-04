const Util = require("./util");
const MovingObject = require("./moving_object");

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
			this.type = 'mobile'
			// this.sprite = "images/qix_enemy.png"
    }

    collideWith(otherObject) {
    }
}

module.exports = Ufo;
