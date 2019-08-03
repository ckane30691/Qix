const Util = require('./util');
class Track {
	constructor() {
		this.color = '#04F2D4';
		this.track = this.initTrack();
	}

	initTrack() {
		let track = {};
		for (let i = 75; i < 925; i++) {
			track[[ i, 75 ]] = true;
			track[[ i, 525 ]] = true;
			if (i < 550) {
				track[[ 75, i ]] = true;
				track[[ 925, i ]] = true;
			}
		}
		return track;
	}

	move(timeDelta) {}

	getEdge(pos) {
		if (pos[0] === 75) return 75;
		if (pos[0] === 925) return 925;
		if (pos[1] === 525) return 525;
		if (pos[1] === 75) return 75;
	}

	areOnSameEdge(pos1, pos2) {
		return (
			this.getEdge(pos1) === this.getEdge(pos2) &&
			(pos1[0] === pos2[0] || pos1[1] === pos2[1])
		);
	}

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

	isOnEdge(pos) {
		return Boolean(this.getEdge(pos));
	}

	determineCorner(startPos, endPos) {
		let startPointX = startPos[0];
		let startPointY = startPos[1];
		let endPointX = endPos[0];
		let endPointY = endPos[1];
		let corners = [ 75, 525, 925 ];
		let finalPointOne = corners.includes(startPointY)
			? startPointY
			: startPointX;
		let finalPointTwo = corners.includes(endPointX) ? endPointX : endPointY;
		if (finalPointOne === startPointY) {
			return [ finalPointTwo, finalPointOne ];
		} else {
			return [ finalPointOne, finalPointTwo ];
		}
	}

	getLeftCornerCoordX(pos) {
		if (pos[1] === 75) {
			return [ 75, 75 ];
		} else {
			return [ 75, 525 ];
		}
	}

	getRightCornerCoordX(pos) {
		if (pos[1] === 75) {
			return [ 925, 75 ];
		} else {
			return [ 925, 525 ];
		}
	}

	getTopCornerCoordY(pos) {
		if (pos[0] === 75) {
			return [ 75, 75 ];
		} else {
			return [ 925, 75 ];
		}
	}
	getBottomCornerCoordY(pos) {
		if (pos[0] === 75) {
			return [ 75, 525 ];
		} else {
			return [ 925, 525 ];
		}
	}

	formatShape(pointsArr, cornerPair) {
		let allPointsX = [];
		let allPointsY = [];
		pointsArr.forEach((point) => {
			allPointsX.push(point[0]);
			allPointsY.push(point[1]);
		});
		let xPointArray = [].concat(
			cornerPair[0][0],
			allPointsX,
			cornerPair[1][0]
		);
		// console.log(xPointArray);
		let yPointArray = [].concat(
			cornerPair[0][1],
			allPointsY,
			cornerPair[1][1]
		);
		return [ xPointArray, yPointArray, xPointArray.length ];
	}

	buildCornerPairs(startPoint, endPoint) {
		if (startPoint[1] === 75 || startPoint[1] === 525) {
			return [
				[
					this.getLeftCornerCoordX(startPoint),
					this.getLeftCornerCoordX(endPoint)
				],
				[
					this.getRightCornerCoordX(startPoint),
					this.getRightCornerCoordX(endPoint)
				]
			];
		} else {
			return [
				[
					this.getTopCornerCoordY(startPoint),
					this.getTopCornerCoordY(endPoint)
				],
				[
					this.getBottomCornerCoordY(startPoint),
					this.getBottomCornerCoordY(endPoint)
				]
			];
		}
	}

	updateTrack(newPoints) {
		// https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line
		const _deleteOldTrack = (startPoint, endPoint) => {
			let currentTrack = Object.keys(this.track);
			for (let i = 0; i < currentTrack.length; i++) {
				let currPoint = Util.formatPoint(currentTrack[i]);
				if (
					Util.isPointOnLine(startPoint, endPoint, currPoint) ===
						true &&
					!Util.areSamePos(startPoint, currPoint) &&
					!Util.areSamePos(endPoint, currPoint)
				) {
					this.track[currPoint] = false;
				}
			}
		};

		const _addCapturePointsToTrack = (newPoints) => {
			newPoints.forEach((point) => {
				this.track[point] = true;
			});
		};

		let startPoint = newPoints[0];
		let endPoint = newPoints.slice(-1)[0];

		_addCapturePointsToTrack(newPoints);

		if (this.areOnSameEdge(startPoint, endPoint)) {
			_deleteOldTrack(startPoint, endPoint);
		} else if (!this.oppositeEdges(startPoint, endPoint)) {
			let corner = this.determineCorner(startPoint, endPoint);
			_deleteOldTrack(startPoint, corner);
			_deleteOldTrack(endPoint, corner);
		} else {
			// TODO: Handle case where you can move along edges of connected shapes
			let cornerPairs = this.buildCornerPairs(startPoint, endPoint);
			let cornerPairOne = cornerPairs[0];
			let cornerPairTwo = cornerPairs[1];

			let shapeOne = this.formatShape(newPoints, cornerPairOne);
			let shapeTwo = this.formatShape(newPoints, cornerPairTwo);

			let shapeOneArea = Util.getArea(...shapeOne);
			let shapeTwoArea = Util.getArea(...shapeTwo);
			// debugger;
			if (Math.abs(shapeOneArea) <= Math.abs(shapeTwoArea)) {
				_deleteOldTrack(startPoint, cornerPairOne[0]);
				_deleteOldTrack(endPoint, cornerPairOne[1]);
			} else {
				_deleteOldTrack(startPoint, cornerPairTwo[0]);
				_deleteOldTrack(endPoint, cornerPairTwo[1]);
			}
		}
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2.5;
		ctx.moveTo(75, 75);
		ctx.lineTo(925, 75);
		ctx.stroke();
		ctx.lineTo(925, 525);
		ctx.stroke();
		ctx.lineTo(75, 525);
		ctx.stroke();
		ctx.lineTo(75, 75);
		ctx.stroke();
		ctx.closePath();
	}
}

module.exports = Track;
