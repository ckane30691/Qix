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

	getCornerCoords(pos) {
		switch (this.game.determineQuadrant(pos)) {
			case 1:
				return [ 75, 75 ];
			case 2:
				return [ 925, 75 ];
			case 3:
				return [ 75, 525 ];
			case 4:
				return [ 925, 525 ];
		}
	}
	getEdge(pos) {
		return [ 75, 525, 925 ].filter((edge) => {
			if (edge === pos[0] || edge === pos[1]) {
				return true;
			}
		})[0];
	}

	getOppositeCornerCoord(pos) {
		let edge = this.getEdge(pos);
		let quadrant = this.game.determineQuadrant(pos);
		// debugger;
		if (edge === pos[0]) {
			if (edge === 75) {
				if (quadrant === 1) {
					return [ 75, 525 ];
				} else {
					return [ 75, 75 ];
				}
			} else if (quadrant === 2) {
				return [ 925, 525 ];
			} else if (quadrant === 4) {
				return [ 925, 75 ];
			}
		} else if (edge === pos[1]) {
			debugger;
			if (edge === 75) {
				if (quadrant === 1) {
					return [ 925, 75 ];
				} else {
					return [ 75, 75 ];
				}
			} else if (quadrant === 3) {
				return [ 925, 525 ];
			} else {
				return [ 75, 525 ];
			}
		} else {
			console.log('u done goofed son');
		}
	}

	isCollidedWith(otherObject) {
		for (var i = 0; i < this.allPoints.length; i++) {
			const centerDist = Util.dist(this.allPoints[i], otherObject.pos);
			if (centerDist < this.radius + otherObject.radius) return true;
		}
		return false;
	}

	// opposite(dir1, dir2) {
	// 	if (dir1 === 'right' && dir2 === 'left') {
	// 		return true;
	// 	} else if (dir1 === 'left' && dir2 === 'right') {
	// 		return true;
	// 	} else if (dir1 === 'up' && dir2 === 'down') {
	// 		return true;
	// 	} else if (dir1 === 'down' && dir2 === 'up') {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	// determineStacked() {
	// 	if (this.stacked === true) return true;
	// 	return this.opposite(this.startDir, this.endDir) ? true : false;
	// }

	oppositeEdges(startPos, endPos) {
		let startY = startPos[1],
			startX = startPos[0],
			endY = endPos[1],
			endX = endPos[0];
		if (
			(startY === 75 && endY === 525) ||
			(startY === 525 && endY === 75) ||
			(startX === 75 && endX === 925) ||
			(startX === 925 && endX === 75)
		) {
			return true;
		}
		return false;
	}

	diagCapture() {
		// move startingQuadrant & endingQuadrant to constructor
		let startingQuad = this.game.determineQuadrant(this.startPos);
		let endingQuad = this.game.determineQuadrant(this.endPos);
		return (startingQuad == 1 && endingQuad == 3) ||
		(endingQuad == 3 && startingQuad == 1) ||
		(endingQuad == 2 && startingQuad == 4) ||
		(endingQuad == 4 && startingQuad == 2)
			? true
			: false;
	}

	getRemainingPoints() {
		if (this.diagCapture()) return;
		let startPointX = this.startPos[0];
		let startPointY = this.startPos[1];
		let endPointX = this.endPos[0];
		let endPointY = this.endPos[1];
		let corners = [ 75, 525, 925 ];
		let finalPointOne = corners.includes(startPointY)
			? startPointY
			: startPointX;
		let finalPointTwo = corners.includes(endPointX) ? endPointX : endPointY;
		if (!this.oppositeEdges(this.startPos, this.endPos)) {
			if (finalPointOne === startPointY) {
				return [ [ finalPointTwo, finalPointOne ] ];
			} else {
				return [ [ finalPointOne, finalPointTwo ] ];
			}
		} else {
			let shapeOne = [
				this.getCornerCoords(this.startPos),
				this.getCornerCoords(this.endPos)
			];
			let shapeTwo = [
				this.getOppositeCornerCoord(this.startPos),
				this.getOppositeCornerCoord(this.endPos)
			];
			// debugger;
			let shapeOneArea = this.getArea(shapeOne);
			let shapeTwoArea = this.getArea(shapeTwo);
			debugger;
			if (shapeOneArea <= shapeTwoArea) {
				return shapeOne;
			} else {
				return shapeTwo;
			}
		}
	}
	getArea(shape) {
		// possible move to constructor
		let allPointsX = [];
		let allPointsY = [];
		this.allPoints.forEach((point) => {
			allPointsX.push(point[0]);
			allPointsY.push(point[1]);
		});
		let xPointArray = [ this.startPos[0] ].concat(
			allPointsX,
			this.endPos[0],
			shape[0][0],
			shape[1][0]
		);
		let yPointArray = [ this.startPos[1] ].concat(
			allPointsY,
			this.endPos[1],
			shape[0][1],
			shape[1][1]
		);
		// https://www.mathopenref.com/coordpolygonarea2.html
		function polygonArea(X, Y, numPoints) {
			let area = 0; // Accumulates area in the loop
			let j = numPoints - 1; // The last vertex is the 'previous' one to the first

			for (let i = 0; i < numPoints; i++) {
				area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
				j = i; //j is previous vertex to i
			}
			return area / 2;
		}
		// debugger;
		return polygonArea(xPointArray, yPointArray, xPointArray.length);
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		// ctx.strokeStyle = this.color;
		// console.log(this.startPos, this.endPos);
		ctx.lineWidth = 2.5;
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		for (let i = 0; i < this.allPoints.length; i++) {
			let point = this.allPoints[i];
			ctx.lineTo(point[0], point[1]);
			ctx.stroke();
		}
		if (
			this.startPos[1] === this.endPos[1] ||
			this.startPos[0] === this.endPos[0]
		) {
			ctx.fill();
		} else {
			ctx.moveTo(this.startPos[0], this.startPos[1]);
			let remainingPoints = this.getRemainingPoints();
			for (let i = 0; i < remainingPoints.length; i++) {
				let point = remainingPoints[i];
				// debugger;
				ctx.lineTo(point[0], point[1]);
				ctx.stroke();
			}
			ctx.lineTo(this.endPos[0], this.endPos[1]);
			ctx.fill('evenodd');
		}
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
