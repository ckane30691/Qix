const MovingObject = require('./moving_object');
const Capture = require('./capture');
const Ufo = require('./enemy');

class ShipLine extends MovingObject {
	constructor(options) {
		options.radius = ShipLine.RADIUS;
		super(options);
		this.gRadius = 5;
		this.shipDir = options.shipDir;
		this.startPos = options.startPos;
		this.endPos = options.endPos;
		this.game = options.game;
		this.pos = options.pos;
		this.type = 'mobile';
		this.vel = [ 0, 0 ];
		this.moveStartTime = options.moveStartTime;
	}
	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2.5;
		ctx.moveTo(this.endPos[0], this.endPos[1]);
		ctx.lineTo(this.startPos[0], this.startPos[1]);
		ctx.stroke();
		ctx.closePath();
	}

	// move() {
	// 	if (!this.moveStartTime || !this.endPos) {
	// 		return;
	// 	}
	// 	let percentDone = (performance.now() - this.moveStartTime) / 90;
	// 	// console.log(this.endPos);
	// 	// console.log(this.isValidMove(this.endPos));
	// 	let differenceX = this.endPos[0] - this.startPos[0];
	// 	let differenceY = this.endPos[1] - this.startPos[1];
	// 	this.pos[0] = Math.round(this.startPos[0] + differenceX * percentDone);
	// 	this.pos[1] = Math.round(this.startPos[1] + differenceY * percentDone);
	// 	// console.log(percentDone >= 1);
	// 	if (percentDone >= 1) {
	// 		// console.log(percentDone);
	// 		this.startPos = null;
	// 		this.pos = this.endPos.slice();
	// 		this.endPos = null;
	// 		this.moveStartTime = null;
	// 		this.moveEndTime = null;
	// 	}
	// }

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

ShipLine.RADIUS = 3;

module.exports = ShipLine;
