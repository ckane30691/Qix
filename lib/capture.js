const Util = require('./util');
const MovingObject = require('./moving_object');
const Ufo = require('./enemy');

class Capture extends MovingObject {
	constructor(options = {}) {
		options.radius = 1;
		options.game = options.game;
		super(options);
		this.vertices = options.vertices;
		this.stacked = options.stacked;
		this.allPoints = options.allPoints;
		this.gRadius = this.radius + 20;
		this.startPos = options.startPos;
		this.endPos = options.endPos;
		this.vel = [ 0, 0 ];
		this.pos = [ 0, 0 ];
		this.capturePoints = options.capturePoints;
		this.captureStartPoints = options.captureStartPoints;
		this.track = options.track;
		debugger;
		// Possible move to Game and call before instantiation
		if (this.captureStartPoints) {
			this._addStartPointsToAllPoints();
		}
		if (this.stacked) {
			this._addStackedPointsToAllPoints();
		}
		this.area = this.calculateArea();
		// TODO: Set start and end pos based on allPoints
	}

	calculateArea() {}

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

	intersects(point) {
		// https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
		let startPoint,
			endPoint,
			pointToCheck = point,
			length = this.allPoints.length;
		for (let i = 0; i < length - 1; i++) {
			startPoint = this.allPoints[i];
			endPoint = this.allPoints[i + 1];
			if (
				pointToCheck[0] <= Math.max(startPoint[0], endPoint[0]) &&
				pointToCheck[0] >= Math.min(startPoint[0], endPoint[0]) &&
				pointToCheck[1] <= Math.max(startPoint[1], endPoint[1]) &&
				pointToCheck[1] >= Math.min(startPoint[1], endPoint[1])
			) {
				return true;
			}
		}
		return false;
	}

	isCollidedWith(otherObject) {
		for (var i = 0; i < this.allPoints.length; i++) {
			const centerDist = Util.dist(this.allPoints[i], otherObject.pos);
			if (centerDist < this.radius + otherObject.radius) return true;
		}
		return false;
	}

	getRemainingPoints() {
		if (!this.track.oppositeEdges(this.startPos, this.endPos)) {
			return [ this.track.determineCorner(this.startPos, this.endPos) ];
		} else {
			// Probably replace with a call to either calculate area or just accessing the area property of the capture
			let cornerPairs = this.track.buildCornerPairs(
				this.startPos,
				this.endPos
			);
			let cornerPairOne = cornerPairs[0];
			let cornerPairTwo = cornerPairs[1];
			let shapeOne = this.track.formatShape(
				this.allPoints,
				cornerPairOne
			);
			let shapeTwo = this.track.formatShape(
				this.allPoints,
				cornerPairTwo
			);
			let shapeOneArea = Util.getArea(...shapeOne);
			let shapeTwoArea = Util.getArea(...shapeTwo);
			//   debugger;
			if (Math.abs(shapeOneArea) <= Math.abs(shapeTwoArea)) {
				return this.track.areOnSameEdge(cornerPairOne[0], this.endPos)
					? cornerPairOne
					: cornerPairOne.reverse();
			} else {
				return this.track.areOnSameEdge(cornerPairTwo[0], this.endPos)
					? cornerPairTwo
					: cornerPairTwo.reverse();
			}
		}
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.lineWidth = 2.5;
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		for (let i = 1; i < this.allPoints.length; i++) {
			let point = this.allPoints[i];
			ctx.lineTo(point[0], point[1]);
			ctx.stroke();
		}
		if (!this.track.areOnSameEdge(this.startPos, this.endPos)) {
			let remainingPoints = this.getRemainingPoints() || [];

			for (let i = 0; i < remainingPoints.length; i++) {
				let point = remainingPoints[i];
				ctx.lineTo(point[0], point[1]);
				ctx.stroke();
			}
		}
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		ctx.fill('evenodd');
	}

	_getClosestEndPointFromCapturePoints() {
		let startPointOfConnectedCapture = this.capturePoints[0];
		let endPointOfConnectedCapture = this.capturePoints.slice(-1)[0];
		let distanceToStartPos = Util.dist(
			this.startPos,
			startPointOfConnectedCapture
		);
		let distanceToEndPos = Util.dist(
			this.startPos,
			endPointOfConnectedCapture
		);
		return distanceToStartPos <= distanceToEndPos
			? startPointOfConnectedCapture
			: endPointOfConnectedCapture;
	}

	_getAllVerticiesToClosestEndpoint(endPointOfCapture) {
		let points = this.capturePoints;
		let index;
		for (let i = 0; i < points.length; i++) {
			if (
				this.endPos[0] === points[i][0] &&
				this.endPos[1] === points[i][1]
			) {
				index = i;
			}
		}
		console.log(endPointOfCapture, points[0]);
		if (
			endPointOfCapture[0] === points[0][0] &&
			endPointOfCapture[1] === points[0][1]
		) {
			return this.capturePoints.slice(0, index);
		} else {
			console.log('elsed');
			return this.capturePoints.slice(index);
		}

		// bool PointInPolygon(Point point, Polygon polygon) {
		//   vector < Point > points = polygon.getPoints();
		//   int i, j, nvert = points.size();
		//   bool c = false;

		//   for (i = 0, j = nvert - 1; i < nvert; j = i++) {
		//     if (((points[i].y >= point.y) != (points[j].y >= point.y)) &&
		//       (point.x <= (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y - points[i].y) + points[i].x)
		//     )
		//       c = !c;
		//   }

		//   return c;
		// }

		// TODO: Possibly Rename to extraStackedStartPoints & extraStackedEndPoints
	}

	_getClosestStartPointFromExtraStartPoints() {
		let startPointOfConnectedCapture = this.captureStartPoints[0];
		let endPointOfConnectedCapture = this.captureStartPoints.slice(-1)[0];
		let distanceToStartPos = Util.dist(
			this.startPos,
			startPointOfConnectedCapture
		);
		let distanceToEndPos = Util.dist(
			this.startPos,
			endPointOfConnectedCapture
		);
		return distanceToStartPos <= distanceToEndPos
			? startPointOfConnectedCapture
			: endPointOfConnectedCapture;
	}

	_getAllVerticiesToClosestStartpoint(closestStartpoint) {
		let points = this.captureStartPoints;
		let index;

		for (let i = 0; i < points.length; i++) {
			if (
				this.startPos[0] === points[i][0] &&
				this.startPos[1] === points[i][1]
			) {
				index = i;
			}
		}

		if (
			closestStartpoint[0] === points[0][0] &&
			closestStartpoint[1] === points[0][1]
		) {
			return this.captureStartPoints.slice(0, index);
		} else {
			return this.captureStartPoints.slice(index);
		}
	}

	_addStartPointsToAllPoints() {
		let closestStartpoint = this._getClosestStartPointFromExtraStartPoints();

		let extraVerticies = this._getAllVerticiesToClosestStartpoint(
			closestStartpoint
		);

		if (!this.track.isOnEdge(extraVerticies[0])) {
			extraVerticies = extraVerticies.reverse();
		}

		let updatedPoints = extraVerticies.concat(this.allPoints);
		this.allPoints = updatedPoints;
		this.startPos = closestStartpoint;
		this.captureStartPoints = false;
		return;
	}

	_addStackedPointsToAllPoints() {
		let closestEndpoint = this._getClosestEndPointFromCapturePoints();
		let extraVerticies = this._getAllVerticiesToClosestEndpoint(
			closestEndpoint
		);
		if (this.track.isOnEdge(extraVerticies[0])) {
			extraVerticies = extraVerticies.reverse();
		}
		this.allPoints = this.allPoints.concat(extraVerticies);
		this.endPos = closestEndpoint;
		// debugger;
		this.stacked = false;
		return;
	}
}

module.exports = Capture;
