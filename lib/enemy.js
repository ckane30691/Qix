const Util = require('./util');
const MovingObject = require('./moving_object');

const DEFAULTS = {
	COLOR: '#505050',
	RADIUS: 25,
	SPEED: 4
};

class Ufo extends MovingObject {
	constructor(options = {}) {
		options.color = DEFAULTS.COLOR;
		options.pos = options.pos || options.game.randomPosition();
		options.radius = DEFAULTS.RADIUS;
		options.vel = [ 0, 0 ] || options.vel || Util.randomVec(DEFAULTS.SPEED);
		super(options);
		this.type = 'mobile';
		// console.log(this.pos);
	}

	collideWith(otherObject) {}
}

module.exports = Ufo;
