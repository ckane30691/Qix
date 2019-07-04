const MovingObject = require('./moving_object');
const ShipLine = require('./ship_line');
const Util = require('./util');
const Capture = require('./capture');
const Ufo = require('./enemy');

function randomColor() {
	const hexDigits = '0123456789ABCDEF';

	let color = '#';
	for (let i = 0; i < 3; i++) {
		color += hexDigits[Math.floor(Math.random() * 16)];
	}

	return color;
}

class Ship extends MovingObject {
	constructor(options) {
		options.radius = Ship.RADIUS;
		options.vel = options.vel || [ 0, 0 ];
		options.color = options.color || randomColor();
		super(options);
		this.isDrawing = false;
		this.canDraw = false;
		this.game = options.game;
		this.isHiding = true;
		this.gRadius = 11;
		this.betweenPos = [ null, null ];
	}

	drawLine() {
		let delta = new Date().getTime() - this.lastCall;
		if (
			this.canDraw === true &&
			this.isDrawing === true &&
			(this.pos[0] !== this.prevPos[0] || this.pos[1] !== this.prevPos[1])
		) {
			const shipLine = new ShipLine({
				pos: this.pos,
				vel: [ 0, 0 ],
				color: this.color,
				game: this.game,
				shipDir: Util.direction(this.vel)
			});
			this.lastCall = new Date().getTime();
			this.game.add(shipLine);
			this.prevPos = this.pos;
		}
	}

	draw(ctx, isBetween) {
		// console.log(isBetween);
		if (!isBetween) {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			let radius = this.gRadius || this.radius;
			ctx.arc(this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true);
			ctx.fill();
		} else {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			let radius = this.gRadius || this.radius;
			ctx.arc(this.betweenPos[0], this.betweenPos[1], radius, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	}
	move(timeDelta) {
		// console.log(this.vel);
		window.timeDelta = timeDelta;
		MovingObject.prototype.move.call(this, timeDelta);
	}
	// draw(ctx) {
	// 	ctx.fillStyle = this.color;
	// 	ctx.beginPath();
	// 	let radius = this.gRadius || this.radius;
	// 	ctx.arc(this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true);
	// 	ctx.fill();
	// 	// this.pos[0] += 5;
	// 	// this.pos[1] += 5;
	// }

	power(impulse, k) {
		// isUp(k);
		// console.log(window.timeDelta);
		// let currTime = performance.now();
		let deltaTime = window.timeDelta / (1000 / 60);
		console.log(deltaTime);
		let currentX = this.pos[0] + (this.pos[0] + impulse[0] - this.pos[0]) * deltaTime;
		let currentY = this.pos[1] + (this.pos[1] + impulse[1] - this.pos[1]) * deltaTime;
		this.pos[0] += impulse[0] + currentX;
		this.pos[1] += impulse[1] + currentY;
		// this.betweenPos[0] = currentX;
		// this.betweenPos[1] = currentY;

		// if (deltaTime >= 1) {
		// 	this.draw(window.ctx);
		// } else {
		// 	this.draw(window.ctx, true);
		// }
		// if (k === 'w') {
		// 	this.pos[0] += impulse[0];
		// 	this.pos[1] += impulse[1];
		// } else if (k === 's') {
		// 	this.pos[0] += impulse[0];
		// 	this.pos[1] += impulse[1];
		// } else if (k === 'a') {
		// 	this.pos[0] += impulse[0];
		// 	this.pos[1] += impulse[1];
		// 	// this.pos[0] = 0;
		// 	// this.pos[1] = 0;
		// } else if (k === 'd') {
		// 	this.pos[0] += impulse[0];
		// 	this.pos[1] += impulse[1];
		// }
	}

	relocate() {
		this.pos = this.game.shipRandomPos();
		this.vel = [ 0, 0 ];
	}

	collideWith(otherObject) {
		if (otherObject instanceof ShipLine) {
			// console.log(this.game.shipLines.indexOf(otherObject))
			// console.log(this.game.shipLines.length)
			if (this.game.shipLines.indexOf(otherObject) - this.game.shipLines.length < -5) {
				this.removeAll();
				this.canDraw = false;
				this.color = '#f71b3c';
			}
		} else if (otherObject instanceof Ufo) {
			this.removeAll();
			this.canDraw = false;
			this.color = '#f71b3c';
			return true;
		} else if (otherObject instanceof Capture) {
			let dir = Util.direction(this.vel);
			switch (dir) {
				case 'up':
					this.vel = [ 0, 2 ];
					break;
				case 'down':
					this.vel = [ 0, 2 ];
					break;
				case 'left':
					this.vel = [ -2, 0 ];
					break;
				default:
					this.vel = [ -2, 0 ];
			}
		}
	}

	isInCapture(otherObject) {
		if (otherObject instanceof Capture) {
			if (otherObject.isCollidedWith(this)) {
				// console.log("ture")
				return true;
			}
		}
	}
}

Ship.RADIUS = 5;
module.exports = Ship;
