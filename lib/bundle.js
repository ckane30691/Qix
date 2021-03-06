/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const Util = {
	// Normalize the length of the vector to 1, maintaining direction.
	dir(vec) {
		var norm = Util.norm(vec);
		return Util.scale(vec, 1 / norm);
	},

	direction(vel) {
		if (vel[0] > 0 && vel[1] === 0) {
			return 'right';
		} else if (vel[0] === 0 && vel[1] < 0) {
			return 'up';
		} else if (vel[0] < 0 && vel[1] === 0) {
			return 'left';
		} else {
			return 'down';
		}
	},
	// Find distance between two points.
	dist(pos1, pos2) {
		return Math.sqrt(
			Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
		);
	},
	// https://www.mathopenref.com/coordpolygonarea2.html
	getArea(X, Y, numPoints) {
		let area = 0; // Accumulates area in the loop
		let j = numPoints - 1; // The last vertex is the 'previous' one to the first
		for (let i = 0; i < numPoints; i++) {
			area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
			j = i; //j is previous vertex to i
			debugger;
		}
		debugger;
		return area / 2;
	},

	areSamePos(pos1, pos2) {
		if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) return true;
		return false;
	},
	formatPoint(strPoint) {
		if (typeof strPoint !== 'string') throw `you done goofed ${strPoint}`;
		strPoint = strPoint.split(',');
		return [ Number(strPoint[0]), Number(strPoint[1]) ];
	},
	isPointOnLine(startOfline, endOfLine, pointToCheck) {
		if (
			Util.dist(startOfline, pointToCheck) +
				Util.dist(endOfLine, pointToCheck) ==
			Util.dist(startOfline, endOfLine)
		)
			return true; // pointToCheck is on the line.
		// debugger;
		return false;
	},
	intersects(startPoint, endPoint, pointToCheck) {},
	// Find the length of the vector.
	norm(vec) {
		return Util.dist([ 0, 0 ], vec);
	},
	// Return a randomly oriented vector with the given length.
	randomVec(length) {
		var deg = 2 * Math.PI * Math.random();
		return Util.scale([ Math.sin(deg), Math.cos(deg) ], length);
	},
	// Scale the length of a vector by the given amount.
	scale(vec, m) {
		return [ vec[0] * m, vec[1] * m ];
	}
};

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(2);

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
			this.type = 'mobile';
    }

    collideWith(otherObject) {
    }
}

module.exports = Ufo;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(2);
const Ufo = __webpack_require__(1);

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
		// Possible move to Game and call before instantiation
		if (this.captureStartPoints) {
			this._addStartPointsToAllPoints();
		}
		if (this.stacked) {
			this._addStackedPointsToAllPoints();
		}
		// TODO: Set start and end pos based on allPoints
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
				return cornerPairOne;
			} else {
				return cornerPairTwo;
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
		ctx.moveTo(this.startPos[0], this.startPos[1]);
		if (!this.track.areOnSameEdge(this.startPos, this.endPos)) {
			let remainingPoints = this.getRemainingPoints() || [];

			for (let i = 0; i < remainingPoints.length; i++) {
				let point = remainingPoints[i];
				ctx.lineTo(point[0], point[1]);
				ctx.stroke();
			}
		}
		ctx.lineTo(this.endPos[0], this.endPos[1]);
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
		this.stacked = false;
		return;
	}
}

module.exports = Capture;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(2);
const Capture = __webpack_require__(3);
const Ufo = __webpack_require__(1);

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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(6);
const GameView = __webpack_require__(9);

document.addEventListener('DOMContentLoaded', function() {
	const canvasEl = document.getElementsByTagName('canvas')[0];
	canvasEl.width = Game.DIM_X;
	canvasEl.height = Game.DIM_Y;

	let modal = document.getElementById('aboutModal');
	let openBtn = document.getElementsByClassName('openBtn')[0];
	let closeBtn = document.getElementsByClassName('closeBtn')[0];
	let prevBtn = document.getElementsByClassName('prev')[0];
	let nextBtn = document.getElementsByClassName('next')[0];
	let startBtn = document.getElementsByClassName('start-button')[0];
	let muteBtn = document.getElementsByClassName('mute')[0];

	openBtn.onclick = () => {
		modal.style.display = 'block';
	};

	closeBtn.onclick = () => {
		modal.style.display = 'none';
	};

	window.onclick = (event) => {
		if (event.target === modal) {
			modal.style.display = 'none';
		}
	};

	const showSlides = (n) => {
		let i;
		let slides = document.getElementsByClassName('mySlides');
		let captionText = document.getElementById('caption');
		if (n > slides.length) {
			slideIndex = 1;
		}
		if (n < 1) {
			slideIndex = slides.length;
		}
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = 'none';
		}
		slides[slideIndex - 1].style.display = 'block';
	};

	let slideIndex = 1;
	showSlides(slideIndex);

	const plusSlides = (n) => {
		showSlides((slideIndex += n));
	};

	const currentSlide = (n) => {
		showSlides((slideIndex = n));
	};

	prevBtn.onclick = () => plusSlides(-1);
	nextBtn.onclick = () => plusSlides(1);

	//disable space-bar scrolling
	window.onkeydown = (e) => {
		if (e.keyCode === 32 && e.target === document.body) {
			e.preventDefault();
		}
	};

	muteBtn.onclick = () => {
		let theme = document.getElementsByClassName('theme')[0];
		let captureSound = document.getElementsByClassName('capture-sound')[0];
		let impactSound = document.getElementsByClassName('impact-sound')[0];
		let deathSound = document.getElementsByClassName('death-sound')[0];

		deathSound.muted = deathSound.muted ? false : true;
		impactSound.muted = impactSound.muted ? false : true;
		theme.muted = theme.muted ? false : true;
		captureSound.muted = captureSound.muted ? false : true;
		muteBtn.className =
			muteBtn.className === 'mute true' ? 'mute' : 'mute true';
	};

	startBtn.onclick = () => {
		startBtn.className += ' hidden';
		let theme = document.getElementsByClassName('theme')[0];
		// theme.play()
		const ctx = canvasEl.getContext('2d');
		window.ctx = ctx;
		const game = new Game();
		new GameView(game, ctx).start();
	};
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Ufo = __webpack_require__(1);
const ShipLine = __webpack_require__(4);
const Ship = __webpack_require__(7);
const Capture = __webpack_require__(3);
const Track = __webpack_require__(8);

function randomColor() {
	const hexDigits = '0123456789ABCDEF';

	let color = '#';
	for (let i = 0; i < 3; i++) {
		color += hexDigits[Math.floor(Math.random() * 16)];
	}

	return color;
}

class Game {
	constructor() {
		this.ufos = [];
		this.shipLines = [];
		this.ships = [];
		this.captures = [];
		this.allowedTrack = new Track();
		this.addUfos();
	}

	add(object) {
		if (object instanceof Ufo) {
			this.ufos.push(object);
		} else if (object instanceof ShipLine) {
			this.shipLines.push(object);
		} else if (object instanceof Ship) {
			this.ships.push(object);
		} else if (object instanceof Capture) {
			this.captures.push(object);
		} else if (object instanceof Track) {
			// this.allowedTrack[object] = true;
		} else {
			throw 'wtf?';
		}
	}

	addUfos() {
		for (let i = 0; i < Game.NUM_UFOS; i++) {
			this.add(new Ufo({ game: this }));
		}
	}

	addShip() {
		const ship = new Ship({
			pos: this.shipRandomPos(),
			game: this,
			color: '#f71b3c',
			track: this.allowedTrack
		});

		this.add(ship);
		// debugger;
		return ship;
	}

	addCapture(
		startPos,
		endPos,
		stacked,
		vertices,
		capturePoints,
		captureStartPoints
	) {
		let allPoints = this.getAllPoints();
		const capture = new Capture({
			startPos: startPos,
			endPos: endPos,
			stacked: stacked,
			vertices: vertices,
			color: '#00f6fd',
			game: this,
			allPoints: allPoints,
			capturePoints: capturePoints,
			captureStartPoints: captureStartPoints,
			track: this.allowedTrack
		});
		this.add(capture);
		let captureSound = document.getElementsByClassName('capture-sound')[0];
		// this.deleteOutDatedTrack(startPos, endPos);
		// this.allowedTrack.updateTrack(allPoints);
		captureSound.play();
	}

	getAllPoints() {
		return [ this.shipLines[0].startPos ].concat(
			this.shipLines.map((shipLine) => {
				return [
					Math.round(shipLine.endPos[0]),
					Math.round(shipLine.endPos[1])
				];
			})
		);
	}

	includesPos(array, pos) {
		return array.some((el) => el[0] === pos[0] && el[1] === pos[1]);
	}

	allObjects() {
		return [].concat(
			this.ships,
			this.ufos,
			this.shipLines,
			this.captures,
			this.allowedTrack
		);
	}

	checkCollisions() {
		const allObjects = this.allObjects();
		for (let i = 0; i < allObjects.length; i++) {
			if (allObjects[i] instanceof Track) continue;
			for (let j = 0; j < allObjects.length; j++) {
				if (allObjects[j] instanceof Track) continue;
				const obj1 = allObjects[i];
				const obj2 = allObjects[j];

				if (obj1.isCollidedWith(obj2)) {
					const collision = obj1.collideWith(obj2);
					if (collision) {
						let deathSound = document.getElementsByClassName(
							'death-sound'
						)[0];
						deathSound.play();
						return;
					}
				}
			}
		}
	}

	checkLineComplete() {
		if (this.shipLines.length < 1) return;
		// debugger;
		let startsOnCapture;
		let startOfDrawnLinePos = this.shipLines[0].startPos;
		if (!this.allowedTrack.isOnEdge(startOfDrawnLinePos)) {
			startsOnCapture = true;
		}
		let allPoints = this.getAllPoints();
		let endOfDrawnLinePos = this.shipLines.slice(-1)[0].endPos;
		// console.log(endOfDrawnLinePos);
		let length = this.captures.length;
		for (let i = 0; i < length; i++) {
			let capture = this.captures[i];
			if (capture.intersects(endOfDrawnLinePos)) {
				let vertices = this.getVertices();
				let capturePoints = capture.allPoints;
				let captureStartPoints = null;
				if (startsOnCapture) {
					for (let j = 0; j < this.captures.length; j++) {
						let capture = this.captures[j];
						if (capture.intersects(startOfDrawnLinePos)) {
							captureStartPoints = capture.allPoints;
						}
					}
				}
				this.addCapture(
					startOfDrawnLinePos,
					endOfDrawnLinePos,
					true,
					vertices,
					capturePoints,
					captureStartPoints
				);
				this.completeLine();
				this.allowedTrack.updateTrack(allPoints);
				return;
			}
		}
		if (
			this.ships[0].canDraw &&
			this.shipLines.length > 5 &&
			this.allowedTrack.isOnEdge(endOfDrawnLinePos)
		) {
			let captureStartPoints = null;
			if (startsOnCapture) {
				for (let i = 0; i < this.captures.length; i++) {
					let capture = this.captures[i];
					if (capture.intersects(startOfDrawnLinePos)) {
						captureStartPoints = capture.allPoints;
					}
				}
			}

			let vertices = this.getVertices();
			this.addCapture(
				startOfDrawnLinePos,
				endOfDrawnLinePos,
				false,
				vertices,
				null,
				captureStartPoints
			);
			this.completeLine();
			this.allowedTrack.updateTrack(allPoints);
		}
	}

	draw(ctx) {
		ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
		ctx.fillStyle = Game.BG_COLOR;
		ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

		this.allObjects().forEach((object) => {
			object.draw(ctx);
		});
	}

	isOutOfBounds(pos) {
		return pos[0] < 75 || pos[1] < 75 || pos[0] > 925 || pos[1] > 525;
	}

	moveObjects(delta) {
		this.allObjects().forEach((object) => {
			object.move(delta);
		});
	}

	randomPosition() {
		return [
			Math.random() * 800 - 200 + 200,
			Math.random() * 300 - 200 + 200
		];
	}

	shipRandomPos() {
		return [ 525, 75 ];
	}

	remove(object) {
		if (object instanceof ShipLine) {
			this.shipLines.splice(this.shipLines.indexOf(object), 1);
		} else if (object instanceof Ufo) {
			this.ufos.splice(this.ufos.indexOf(object), 1);
		} else if (object instanceof Ship) {
			this.ships.splice(this.ships.indexOf(object), 1);
		} else {
			throw 'wtf?';
		}
	}

	removeAll(object) {
		if (object instanceof ShipLine || object instanceof Ship) {
			this.shipLines = [];
			this.captures = [];
			this.ships[0].isDrawing = false;
			this.ships[0].canDraw = false;
			this.ships[0].color = '#f71b3c';
			this.ships[0].relocate();
		}
	}

	getVertices() {
		let initialDir = this.shipLines[0].shipDir;
		let vertices = [ this.shipLines[0].pos ];
		this.shipLines.forEach((point) => {
			if (point.shipDir != initialDir) {
				vertices.push(point.pos);
				initialDir = point.shipDir;
			}
		});
		vertices.push(this.shipLines.slice(-1)[0].pos);
		return vertices;
	}

	completeLine() {
		this.shipLines = [];
		this.ships[0].isDrawing = false;
		this.ships[0].canDraw = false;
		this.ships[0].color = '#f71b3c';
	}

	determineQuadrant(pos) {
		if (pos[0] < 500 && pos[1] < 300) {
			return 1;
		} else if (pos[0] > 500 && pos[1] < 300) {
			return 2;
		} else if (pos[0] < 500 && pos[1] > 300) {
			return 3;
		} else if (pos[0] > 500 && pos[1] > 300) {
			return 4;
		}
	}

	isWon() {
		// Give capturePoints an area property
		// Calculate the total area of all captures
		// Subtract that from the total area of the canvas
		// if totalArea > 75% level is won
	}

	step(delta) {
		this.moveObjects(delta);
		this.checkCollisions();
		this.checkLineComplete();
		this.isWon();
	}
}

Game.BG_COLOR = 'rgba(226, 226, 232, 0.8)';
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 60;
Game.NUM_UFOS = 3;

module.exports = Game;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(2);
const ShipLine = __webpack_require__(4);
const Util = __webpack_require__(0);
const Capture = __webpack_require__(3);
const Ufo = __webpack_require__(1);

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
		this.track = options.track;
		this.isHiding = true;
		this.gRadius = 11;
		this.endPos = null;
		this.moveStartTime = null;
		this.moveEndTime = null;
		this.startPos = null;
		this.prevPos = null;
	}

	drawLine() {
		let delta = new Date().getTime() - this.lastCall;
		if (!this.endPos) return;
		if (this.endPos === this.prevPos) return;
		if (
			this.track.isOnEdge(this.startPos) &&
			this.track.isOnEdge(this.endPos)
		)
			return;
		if (this.canDraw === true) {
			const shipLine = new ShipLine({
				pos: this.pos,
				vel: [ 0, 0 ],
				color: this.color,
				game: this.game,
				shipDir: Util.direction(this.vel),
				startPos: this.startPos || this.pos,
				endPos: this.endPos,
				moveStartTime: this.moveStartTime
			});
			this.lastCall = new Date().getTime();
			this.game.add(shipLine);
			this.prevPos = this.endPos;
		}
	}

	move(timeDelta) {
		if (!this.moveStartTime || !this.endPos) {
			return;
		}
		let percentDone = (performance.now() - this.moveStartTime) / 90;
		// console.log(this.endPos);
		// console.log(this.isValidMove(this.endPos));
		let differenceX = this.endPos[0] - this.startPos[0];
		let differenceY = this.endPos[1] - this.startPos[1];
		this.pos[0] = Math.round(this.startPos[0] + differenceX * percentDone);
		this.pos[1] = Math.round(this.startPos[1] + differenceY * percentDone);
		// console.log(percentDone >= 1);
		if (percentDone >= 1) {
			// console.log(percentDone);
			this.startPos = null;
			this.pos = this.endPos.slice();
			this.endPos = null;
			this.moveStartTime = null;
			this.moveEndTime = null;
		}
	}

	power(impulse, k) {
		if (this.moveStartTime) return;
		this.moveStartTime = performance.now();
		this.moveEndTime = this.moveStartTime * 1000;
		this.startPos = this.pos.slice();
		if (!this.endPos) {
			let endPos = [
				Math.round(this.startPos[0] + impulse[0]),
				Math.round(this.startPos[1] + impulse[1])
			];
			if (this.game.isOutOfBounds(endPos)) {
				this.endPos = this.startPos.slice();
				return;
			}
			if (this.canDraw === true) return (this.endPos = endPos);
			if (!this.isValidMove(endPos)) {
				this.endPos = this.startPos.slice();
				return;
			}
			this.endPos = endPos;
		}
		// should assign a next Pos variable
		// moveStartTime and moveEndTime
		// Normalize the difference between movestart and movend
		// let deltaTime = window.timeDelta / (1000 / 60);
	}

	isValidMove(pos) {
		// console.log(this.game.allowedTrack);
		return Boolean(this.game.allowedTrack.track[pos]);
	}

	relocate() {
		this.pos = this.game.shipRandomPos();
		this.vel = [ 0, 0 ];
	}

	collideWith(otherObject) {
		if (otherObject instanceof ShipLine) {
			// console.log(this.game.shipLines.indexOf(otherObject))
			// console.log(this.game.shipLines.length)
			if (
				this.game.shipLines.indexOf(otherObject) -
					this.game.shipLines.length <
				-5
			) {
				// this.removeAll();
				// this.canDraw = false;
				// this.color = '#f71b3c';
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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
class Track {
	constructor() {
		this.color = '#04F2D4';
		this.track = this.initTrack();
		// TODO: Get rid of hardcoded values
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
		// debugger;
		return (
			this.isOnEdge(pos1) &&
			this.isOnEdge(pos2) &&
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


/***/ }),
/* 9 */
/***/ (function(module, exports) {

class GameView {
	constructor(game, ctx) {
		this.ctx = ctx;
		this.game = game;
		this.ship = this.game.addShip();
	}

	bindKeyHandlers() {
		const ship = this.ship;
		Object.keys(GameView.MOVES).forEach((k) => {
			let move = GameView.MOVES[k];
			key(k, () => {
				ship.power(move, k);
			});
		});

		key('space', () => {
			if (ship.isDrawing) {
				return;
			} else {
				if (ship.canDraw === true) {
					ship.canDraw = false;
					ship.color = '#f71b3c';
				} else {
					ship.canDraw = true;
					ship.color = '#00f6fd';
				}
			}
		});
	}

	// https://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
	asyncLoop(o) {
		var loop = function() {
			o.functionToLoop(loop);
		};
		loop(); //init
	}

	start() {
		this.bindKeyHandlers();
		this.lastTime = 0;
		const that = this;
		this.asyncLoop({
			length: 1000,
			functionToLoop: function(loop, i) {
				setTimeout(function() {
					that.ship.drawLine();
					loop();
				}, 1);
			},
			callback: function() {}
		});

		requestAnimationFrame(this.animate.bind(this));
	}

	animate(time) {
		const timeDelta = time - this.lastTime;
		window.animateTime = time;
		this.game.step(timeDelta);
		this.game.draw(this.ctx);
		this.lastTime = time;

		requestAnimationFrame(this.animate.bind(this));
	}
}

GameView.MOVES = {
	w: [ 0, -25 ],
	a: [ -25, 0 ],
	s: [ 0, 25 ],
	d: [ 25, 0 ]
};

module.exports = GameView;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map