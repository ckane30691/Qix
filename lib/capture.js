const Util = require('./util');
const MovingObject = require('./moving_object');
const Ufo = require('./enemy');

class Capture extends MovingObject {
	constructor(options = {}) {
		options.radius = 1;
		options.game = options.game;
		super(options);
		this.vertices = options.vertices;
		this.startDir = options.startDir;
		this.endDir = options.endDir;
		this.stacked = options.stacked;
		this.allPoints = options.allPoints;
		this.gRadius = this.radius + 20;
		this.startPos = options.startPos;
		this.endPos = options.endPos;
		this.vel = [ 0, 0 ];
		this.pos = [ 0, 0 ];
	}

	collideWith(otherObject) {
		if (otherObject instanceof Ufo) {
			[ otherObject.vel[0], otherObject.vel[1] ] = [
				-otherObject.vel[0],
				-otherObject.vel[1]
			];
			let impactSound = document.getElementsByClassName(
				'impact-sound'
			)[0];
			impactSound.play();
		}
	}

	getQuadrantCoords(pos) {
		switch (this.game.determineQuadrant(pos)) {
			case 1:
				return [ 0, 0 ];
			case 2:
				return [ 1000, 0 ];
			case 3:
				return [ 1000, 600 ];
			case 4:
				return [ 0, 600 ];
		}
	}

	isCollidedWith(otherObject) {
		for (var i = 0; i < this.allPoints.length; i++) {
			const centerDist = Util.dist(this.allPoints[i], otherObject.pos);
			if (centerDist < this.radius + otherObject.radius) return true;
		}
		return false;
	}

	opposite(dir1, dir2) {
		if (dir1 === 'right' && dir2 === 'left') {
			return true;
		} else if (dir1 === 'left' && dir2 === 'right') {
			return true;
		} else if (dir1 === 'up' && dir2 === 'down') {
			return true;
		} else if (dir1 === 'down' && dir2 === 'up') {
			return true;
		} else {
			return false;
		}
	}

	determineStacked() {
		if (this.stacked === true) return true;
		return this.opposite(this.startDir, this.endDir) ? true : false;
	}

	oneLiner() {
		if (this.startDir === this.endDir) {
			return true;
		}
	}

	diagCapture() {
		(this.game.determineQuadrant(this.startPos) == 1 &&
			this.game.determineQuadrant(this.endPos) == 3) ||
		(this.game.determineQuadrant(this.endPos) == 3 &&
			this.game.determineQuadrant(this.startPos) == 1) ||
		(this.game.determineQuadrant(this.endPos) == 2 &&
			this.game.determineQuadrant(this.startPos) == 4) ||
		(this.game.determineQuadrant(this.endPos) == 4 &&
			this.game.determineQuadrant(this.startPos) == 2)
			? true
			: false;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		// ctx.strokeStyle = this.color;
		console.log(this.allPoints);
		ctx.lineWidth = 2.5;
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		for (let i = 0; i < this.allPoints.length; i++) {
			let point = this.allPoints[i];
			ctx.lineTo(point[0], point[1]);
			ctx.stroke();
		}
		// ctx.fill();
		// if (this.determineStacked()) {
		// 	ctx.moveTo(this.startPos[0], this.startPos[1]);
		// } else {
		// 	ctx.moveTo(...this.getQuadrantCoords(this.startPos));
		// }

		// this.vertices.forEach((pos, idx) => {
		// 	if (idx === this.vertices.length - 1) {
		// 		if (this.determineStacked()) {
		// 			if (this.diagCapture() === true) {
		// 				// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
		// 				// ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
		// 				// ctx.stroke()
		// 				// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
		// 				// // ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
		// 				// // ctx.stroke()
		// 				// ctx.lineTo(this.startPos[0], this.startPos[1]);
		// 				// ctx.moveTo(this.startPos[0], this.startPos[1]);
		// 				// // ctx.stroke()
		// 				// ctx.closePath()
		// 				// ctx.fill()
		// 				// console.log(true);
		// 			} else if (this.oneLiner()) {
		// 				if (
		// 					this.startDir === 'up' ||
		// 					this.startDir === 'down'
		// 				) {
		// 					// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0] + 50, this.endPos[1] + 50);
		// 					// // ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
		// 					// ctx.stroke()
		// 					// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0] + 50, this.startPos[1] + 50);
		// 					// // ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
		// 					// // ctx.stroke()
		// 					// ctx.lineTo(this.startPos[0] + 50, this.startPos[1] + 50);
		// 					// // ctx.moveTo(this.startPos[0] + 50, this.startPos[1] + 50);
		// 					// ctx.stroke()
		// 					// ctx.closePath()
		// 					// ctx.fill()
		// 					ctx.lineTo(this.endPos[0], this.startPos[1]);
		// 					ctx.moveTo(this.endPos[0], this.startPos[1]);
		// 					// ctx.moveTo(pos[0], pos[1]);
		// 					ctx.stroke();
		// 					ctx.lineTo(this.startPos[0], this.startPos[1]);
		// 					ctx.moveTo(this.startPos[0], this.startPos[1]);
		// 					ctx.stroke();
		// 					ctx.closePath();
		// 					ctx.fill();
		// 				} else {
		// 					// ctx.lineTo( this.endPos[0], this.getQuadrantCoords(this.startPos)[1]);
		// 					// ctx.moveTo( this.endPos[0], this.getQuadrantCoords(this.startPos)[1]);
		// 					// ctx.stroke()
		// 					// ctx.lineTo(this.startPos[0], this.getQuadrantCoords(this.startPos)[1]);
		// 					// // ctx.moveTo(this.startPos[0], this.getQuadrantCoords(this.startPos)[1]);
		// 					// // ctx.stroke()
		// 					// ctx.lineTo(this.startPos[0], this.startPos[1]);
		// 					// // ctx.moveTo(this.startPos[0], this.startPos[1]);
		// 					// ctx.stroke()
		// 					// ctx.closePath()
		// 					// ctx.fill()
		// 					ctx.lineTo(this.startPos[0], this.endPos[1]);
		// 					ctx.moveTo(this.startPos[0], this.endPos[1]);
		// 					// ctx.moveTo(pos[0], pos[1]);
		// 					ctx.stroke();
		// 					ctx.lineTo(this.startPos[0], this.startPos[1]);
		// 					ctx.moveTo(this.startPos[0], this.startPos[1]);
		// 					ctx.stroke();
		// 					ctx.closePath();
		// 					ctx.fill();
		// 				}
		// 			} else {
		// 				if (
		// 					this.startDir === 'up' ||
		// 					this.startDir === 'down'
		// 				) {
		// 					ctx.lineTo(this.endPos[0], this.startPos[1]);
		// 					ctx.moveTo(this.endPos[0], this.startPos[1]);
		// 					// ctx.moveTo(pos[0], pos[1]);
		// 					ctx.stroke();
		// 					ctx.lineTo(this.startPos[0], this.startPos[1]);
		// 					ctx.moveTo(this.startPos[0], this.startPos[1]);
		// 					ctx.stroke();
		// 					ctx.closePath();
		// 					ctx.fill();
		// 				} else {
		// 					ctx.lineTo(this.startPos[0], this.endPos[1]);
		// 					ctx.moveTo(this.startPos[0], this.endPos[1]);
		// 					// ctx.moveTo(pos[0], pos[1]);
		// 					ctx.stroke();
		// 					ctx.lineTo(this.startPos[0], this.startPos[1]);
		// 					ctx.moveTo(this.startPos[0], this.startPos[1]);
		// 					ctx.stroke();
		// 					ctx.closePath();
		// 					ctx.fill();
		// 				}
		// 			}
		// 		} else {
		// 			ctx.lineTo(...this.getQuadrantCoords(this.endPos));
		// 			// ctx.stroke()
		// 			ctx.closePath();
		// 			ctx.fill();
		// 		}
		// 	} else {
		// 		ctx.lineTo(pos[0], pos[1]);
		// 		ctx.stroke();
		// 	}
		// });
	}
}

module.exports = Capture;
