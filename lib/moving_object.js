const Util = require('./util');

class MovingObject {
	constructor(options) {
		this.pos = options.pos;
		this.vel = options.vel;
		this.radius = options.radius;
		this.color = options.color;
		this.game = options.game;
		this.isWrappable = true;
	}

	collideWith(otherObject) {
		// default do nothing
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		let radius = this.gRadius || this.radius;
		ctx.arc(this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true);
		ctx.fill();
	}

	isCollidedWith(otherObject) {
		const centerDist = Util.dist(this.pos, otherObject.pos);
		return centerDist < this.radius + otherObject.radius;
	}

	move(timeDelta) {
		//timeDelta is number of milliseconds since last move
		//if the computer is busy the time delta will be larger
		//in this case the MovingObject should move farther in this frame
		//velocity of object is how far it should move in 1/60th of a second
		const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
		let offsetX = this.vel[0] * velocityScale;
		let offsetY = this.vel[1] * velocityScale;
		let impactSound = document.getElementsByClassName('impact-sound')[0];

		this.pos = [ this.pos[0] + offsetX, this.pos[1] + offsetY ];

		if (this.pos[0] + offsetX < 70) {
			this.vel[0] = -this.vel[0];
		}
		if (this.pos[0] + offsetX > 935) {
			this.vel[0] = -this.vel[0];
		}
		if (this.pos[1] + offsetY < 70) {
			this.vel[1] = -this.vel[1];
		}
		if (this.pos[1] + offsetY > 535) {
			this.vel[1] = -this.vel[1];
		}
	}

	remove() {
		this.game.remove(this);
	}

	removeAll() {
		this.game.removeAll(this);
	}
}

const NORMAL_FRAME_TIME_DELTA = 1000 / 60;

module.exports = MovingObject;
