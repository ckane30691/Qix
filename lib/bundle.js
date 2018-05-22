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
  dir (vec) {
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
  dist (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },
  // Find the length of the vector.
  norm (vec) {
    return Util.dist([0, 0], vec);
  },
  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
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
      ctx.arc(
        this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

  move(timeDelta) {
    //timeDelta is number of milliseconds since last move
    //if the computer is busy the time delta will be larger
    //in this case the MovingObject should move farther in this frame
    //velocity of object is how far it should move in 1/60th of a second
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
    let offsetX = this.vel[0] * velocityScale;
    let offsetY = this.vel[1] * velocityScale;
    let impactSound = document.getElementsByClassName("impact-sound")[0];
    if (this.type === 'mobile') {

      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

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
    } else {
      this.pos = [Math.floor(this.pos[0] + offsetX), Math.floor(this.pos[1] + offsetY)];
      let moves = this.nextPossibleMoves(this.pos);
      let quad = this.game.determineQuadrant(this.pos);
      let direction = Util.direction(this.vel);
      if (this.pos[0] > 1000 ||
        this.pos[0] < 0 ||
        this.pos[1] > 600 ||
        this.pos[1] < 0) {
          this.relocate();
      }
      switch (direction){
        case 'right':
          if (direction === 'right' && this.isValidMove(this.pos) !== true) {
            console.log("OFFTRACK RIGHT");
            if (this.findNextMove(this.pos) === 'up') {
              console.log("ontrack up");
              this.vel[0] = 0;
              this.vel[1] = -2;
              break;
            } else if (this.findNextMove(this.pos) === 'down') {
              console.log("ontrack right");
              this.vel[0] = 0;
              this.vel[1] = 2;
              break;
            }
          } break;
        case 'up':
          if (direction === 'up' && this.isValidMove(this.pos) !== true) {
          console.log("OFFTRACK UP");
            if (this.findNextMove(this.pos) === 'left') {
              console.log("ontrack left");
              this.vel[0] = -2;
              this.vel[1] = 0;
              break;
            } else if (this.findNextMove(this.pos) === 'right') {
              console.log("ontrack right");
              this.vel[0] = 2;
              this.vel[1] = 0;
              break;
            }
        } break;
        case 'down':
          if (direction === 'down' && this.isValidMove(this.pos) !== true) {
            console.log("OFFTRACK DOWN", this.pos);
            if (this.findNextMove(this.pos) === 'right') {
              console.log("ontrack right");
              this.vel[0] = 2;
              this.vel[1] = 0;
              break;
            } else {
              console.log("ontrack left");
              this.vel[0] = -2;
              this.vel[1] = 0;
              break;
            }
          } break;
        case 'left':
          if (direction === 'left' && this.isValidMove(this.pos) !== true) {
            console.log("IMPORTANT",this.findNextMove(this.pos));
            if (this.findNextMove(this.pos) === 'down') {
              this.vel[0] = 0;
              this.vel[1] = -2;
              console.log("ontrack down");
              break;
            } else if (this.findNextMove(this.pos) === 'up') {
              this.vel[0] = 0;
              this.vel[1] = 2;
              console.log("ontrack up");
              break;
            }
          } break;
        }
    }
  }

  isValidMove(pos) {
    return this.game.allowedTrack[pos];
  }

  findNextMove(pos, dir) {
  console.log("Next Moves", this.nextPossibleMoves(pos));
  this.nextPossibleMoves(pos).forEach(move => {
    if (this.game.allowedTrack[move["down"]] === true) {
      return "down";
    } else if (this.game.allowedTrack[move["left"]] === true) {
      return "left";
    } else if (this.game.allowedTrack[move["up"]] === true) {
      return "up";
    } else if (this.game.allowedTrack[move["right"]] === true) {
      return "right";
    }
  });
  }

  remove() {
    this.game.remove(this);
  }

  removeAll() {
    this.game.removeAll(this);
  }

  nextPossibleMoves(pos) {
    // Maybe try rounding numbers to nearest possible five
    return [
      {
        "right" : [pos[0] + 1, pos[1]]
      },
      {
        "left" : [pos[0] - 1, pos[1]]
      },
      {
        "up" : [pos[0], pos[1] - 1]
      },
      {
        "down" : [pos[0], pos[1] + 1]
      }
    ];
  }
}



const NORMAL_FRAME_TIME_DELTA = 1000/50;

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
			this.startDir = options.startDir;
			this.endDir = options.endDir;
			this.stacked = options.stacked;
			this.allPoints = options.allPoints;
			this.gRadius = this.radius + 20;
			this.startPos = options.startPos;
			this.endPos = options.endPos;
			this.vel = [0, 0];
			this.pos = [0, 0];
    }

    collideWith(otherObject) {
			if (otherObject instanceof Ufo) {
				[otherObject.vel[0], otherObject.vel[1]] = [-otherObject.vel[0], -otherObject.vel[1]];
				let impactSound = document.getElementsByClassName("impact-sound")[0];
				impactSound.play();
			}
    }

		getQuadrantCoords(pos) {
			switch (this.game.determineQuadrant(pos)) {
				case 1:
					return [0, 0];
				case 2:
				  return [1000, 0];
				case 3:
					return [1000, 600];
				case 4:
					return [0, 600];
			}
		}

		isCollidedWith(otherObject) {
			for (var i = 0; i < this.allPoints.length; i++) {
				const centerDist = Util.dist(this.allPoints[i], otherObject.pos);
				if (centerDist < (this.radius + otherObject.radius)) return true;
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
			return (this.opposite(this.startDir, this.endDir)) ? true : false;
		}

		oneLiner() {
			if (this.startDir === this.endDir) {
				return true;
			}
		}

		diagCapture() {
			((this.game.determineQuadrant(this.startPos) == 1)
			&& this.game.determineQuadrant(this.endPos) == 3)
			|| ((this.game.determineQuadrant(this.endPos) == 3)
			&& this.game.determineQuadrant(this.startPos) == 1)
			|| ((this.game.determineQuadrant(this.endPos) == 2)
			&& this.game.determineQuadrant(this.startPos) == 4)
			|| ((this.game.determineQuadrant(this.endPos) == 4)
			&& this.game.determineQuadrant(this.startPos) == 2) ?
			true
			: false;
		}

		draw(ctx) {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			// ctx.strokeStyle = this.color;
			ctx.lineWidth = 15;
			if (this.determineStacked()) {
				ctx.moveTo(this.startPos[0], this.startPos[1]);
			} else {
				ctx.moveTo(...this.getQuadrantCoords(this.startPos));
			}

			this.vertices.forEach((pos, idx) => {
				if (idx === this.vertices.length - 1) {
					if (this.determineStacked()) {
						if (this.diagCapture() === true) {
							// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
							// ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
							// ctx.stroke()
							// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
							// // ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
							// // ctx.stroke()
							// ctx.lineTo(this.startPos[0], this.startPos[1]);
							// ctx.moveTo(this.startPos[0], this.startPos[1]);
							// // ctx.stroke()
							// ctx.closePath()
							// ctx.fill()
							// console.log(true);
						} else if (this.oneLiner()) {
							if (this.startDir === 'up' || this.startDir === 'down') {
								// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0] + 50, this.endPos[1] + 50);
								// // ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
								// ctx.stroke()
								// ctx.lineTo(this.getQuadrantCoords(this.startPos)[0] + 50, this.startPos[1] + 50);
								// // ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
								// // ctx.stroke()
								// ctx.lineTo(this.startPos[0] + 50, this.startPos[1] + 50);
								// // ctx.moveTo(this.startPos[0] + 50, this.startPos[1] + 50);
								// ctx.stroke()
								// ctx.closePath()
								// ctx.fill()
								ctx.lineTo(this.endPos[0], this.startPos[1]);
								ctx.moveTo(this.endPos[0], this.startPos[1]);
								// ctx.moveTo(pos[0], pos[1]);
								ctx.stroke();
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke();
								ctx.closePath();
								ctx.fill();
							} else {
								// ctx.lineTo( this.endPos[0], this.getQuadrantCoords(this.startPos)[1]);
								// ctx.moveTo( this.endPos[0], this.getQuadrantCoords(this.startPos)[1]);
								// ctx.stroke()
								// ctx.lineTo(this.startPos[0], this.getQuadrantCoords(this.startPos)[1]);
								// // ctx.moveTo(this.startPos[0], this.getQuadrantCoords(this.startPos)[1]);
								// // ctx.stroke()
								// ctx.lineTo(this.startPos[0], this.startPos[1]);
								// // ctx.moveTo(this.startPos[0], this.startPos[1]);
								// ctx.stroke()
								// ctx.closePath()
								// ctx.fill()
								ctx.lineTo(this.startPos[0], this.endPos[1]);
								ctx.moveTo(this.startPos[0], this.endPos[1]);
								// ctx.moveTo(pos[0], pos[1]);
								ctx.stroke();
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke();
								ctx.closePath();
								ctx.fill();
							}

						} else {
							if (this.startDir === 'up' || this.startDir === 'down') {
								ctx.lineTo(this.endPos[0], this.startPos[1]);
								ctx.moveTo(this.endPos[0], this.startPos[1]);
								// ctx.moveTo(pos[0], pos[1]);
								ctx.stroke();
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke();
								ctx.closePath();
								ctx.fill();
							} else {
								ctx.lineTo(this.startPos[0], this.endPos[1]);
								ctx.moveTo(this.startPos[0], this.endPos[1]);
								// ctx.moveTo(pos[0], pos[1]);
								ctx.stroke();
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke();
								ctx.closePath();
								ctx.fill();
							}
						}
					} else {
							ctx.lineTo(...this.getQuadrantCoords(this.endPos));
							// ctx.stroke()
							ctx.closePath();
							ctx.fill();
						}
				} else {
						ctx.lineTo(pos[0], pos[1]);
						ctx.stroke();
				}
			});
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
    this.pos = options.pos;
    this.game = options.game;
    this.type = 'mobile';
    this.vel = [0, 0];
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
const GameView = __webpack_require__(8);

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  let modal = document.getElementById('aboutModal');
  let openBtn = document.getElementsByClassName("openBtn")[0];
  let closeBtn = document.getElementsByClassName("closeBtn")[0];
  let prevBtn = document.getElementsByClassName("prev")[0];
  let nextBtn = document.getElementsByClassName("next")[0];
  let startBtn = document.getElementsByClassName("start-button")[0];
  let muteBtn = document.getElementsByClassName("mute")[0];

  openBtn.onclick = () => {
      modal.style.display = "block";
  };

  closeBtn.onclick = () => {
      modal.style.display = "none";
  };

  window.onclick = (event) => {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  };

  const showSlides = (n) => {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1};
    if (n < 1) {slideIndex = slides.length};
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
  };

  let slideIndex = 1;
  showSlides(slideIndex);

  const plusSlides = (n) => {
    showSlides(slideIndex += n);
  };

  const currentSlide = (n) => {
    showSlides(slideIndex = n);
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
  let theme = document.getElementsByClassName("theme")[0];
  let captureSound = document.getElementsByClassName("capture-sound")[0];
  let impactSound = document.getElementsByClassName("impact-sound")[0];
  let deathSound = document.getElementsByClassName("death-sound")[0];

  deathSound.muted = deathSound.muted ? false : true;
  impactSound.muted = impactSound.muted ? false : true;
  theme.muted = theme.muted ? false : true;
  captureSound.muted = captureSound.muted ? false : true;
  muteBtn.className = muteBtn.className === "mute true" ?
    "mute"
    : "mute true";
};

startBtn.onclick = () => {
  startBtn.className += " hidden";
  let theme = document.getElementsByClassName("theme")[0];
  // theme.play()
  const ctx = canvasEl.getContext("2d");
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
const Util = __webpack_require__(0);
const Capture = __webpack_require__(3);

function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

class Game {
  constructor() {
    this.ufos = [];
    this.shipLines = [];
    this.ships = [];
    this.captures = [];
    this.allowedTrack = {};
    this.addUfos();
    this.addAllowedTrack();
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
    } else if (object instanceof Array) {
      this.allowedTrack[object] = true;
    } else {
      throw "wtf?";
    }
  }

  addUfos() {
    for (let i = 0; i < Game.NUM_UFOS; i++) {
      this.add(new Ufo({ game: this }));
    }
  }

  addAllowedTrack() {
    for (let i = 54; i < 1000; i++) {
      this.add([i, 54]);
      this.add([i, 53]);
      this.add([i, 55]);
      this.add([i, 549]);
      this.add([i, 548]);
      this.add([i, 550]);
      if (i < 550) {
        this.add([54, i]);
        this.add([53, i]);
        this.add([52, i]);
        this.add([51, i]);
        this.add([50, i]);
        this.add([49, i]);
        this.add([55, i]);
        this.add([999, i]);
        this.add([1001, i]);
        this.add([1002, i]);
        this.add([998, i]);
        this.add([1003, i]);
      }
    }
  }

  deleteOutDatedTrack(startPos, endPos) {
    if (startPos[0] === endPos[0] || startPos[1] === endPos[1]) {
      Object.keys(this.allowedTrack).forEach(allowedPos => {
        if (allowedPos[1] >= startPos[1] - 3 && allowedPos[1] <= startPos[1] + 3) {
          if (allowedPos[0] > startPos[0] && allowedPos[0] < endPos[0]) {
            delete this.allowedTrack[allowedPos];
            console.log("TRUE");
          }
        }
      });
    }
  }

  addShip() {
    const ship = new Ship({
      pos: this.shipRandomPos(),
      game: this,
      color: '#f71b3c'
    });

    this.add(ship);

    return ship;
  }

  addCapture(startPos, endPos, stacked, startDir, endDir, vertices) {
    const capture = new Capture({
      startPos: startPos,
      endPos: endPos,
      stacked: stacked,
      startDir: startDir,
      endDir: endDir,
      vertices: vertices,
      color: '#00f6fd',
      game: this,
      allPoints: this.getAllPoints(),
    });
    this.add(capture);
    let captureSound = document.getElementsByClassName("capture-sound")[0];
    this.deleteOutDatedTrack(startPos, endPos);
    captureSound.play();
  }

  getAllPoints() {
    let result = [];
    this.shipLines.map(shipLine => {
      result.push([Math.round(shipLine.pos[0]), Math.round(shipLine.pos[1])]);
    });
    return result;
  }

  includesPos(array, pos) {
    return array.some(el => el[0] === pos[0] && el[1] === pos[1]);
  }

  allObjects() {
    return [].concat(this.ships, this.ufos, this.shipLines, this.captures);
  }

  checkCollisions() {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision) {
             let deathSound = document.getElementsByClassName("death-sound")[0];
             deathSound.play();
             return;
          }
        } else if (obj1 instanceof ShipLine && obj1.isInCapture(obj2)) {
            if (this.ships[0].isDrawing && this.shipLines.length > 5) {
              let stacked = true;
              let vertices = this.getVertices();
              this.addCapture(this.shipLines[0].pos, this.shipLines.slice(-1)[0].pos, stacked, this.shipLines[0].shipDir, this.shipLines.slice(-1)[0].shipDir, vertices);
              this.completeLine(obj1.shipDir);
              console.log(obj1.shipDir);
            } else {
            // obj1.canDraw = true;
          }
        }
      }
    }
  }

  checkLineComplete() {
    if (this.ships[0].isDrawing &&
      this.shipLines.length > 5 &&
      this.isOutOfBounds(this.shipLines.slice(-1)[0].pos)) {
        let vertices = this.getVertices();
        this.addCapture(this.shipLines[0].pos, this.shipLines.slice(-1)[0].pos, false, this.shipLines[0].shipDir, this.shipLines.slice(-1)[0].shipDir, vertices);
        this.completeLine(this.shipLines.slice(-1)[0].shipDir);
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
    return (pos[0] < 55) || (pos[1] < 55) ||
      (pos[0] > Game.DIM_X - 55) || (pos[1] > Game.DIM_Y - 55);
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  randomPosition() {
    return [
      (Math.random() * 800 - 200) + 200,
      (Math.random() * 300 - 200) + 200
    ];
  }

  shipRandomPos() {
    return [
      Math.floor((Math.random() * 900 - 200) + 200),
      54
    ];
  }

  remove(object) {
    if (object instanceof ShipLine) {
      this.shipLines.splice(this.shipLines.indexOf(object), 1);
    } else if (object instanceof Ufo) {
      this.ufos.splice(this.ufos.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "wtf?";
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
    let vertices = [this.shipLines[0].pos];
    this.shipLines.forEach(point => {
      if (point.shipDir != initialDir) {
        vertices.push(point.pos);
        initialDir = point.shipDir;
      }
    });
    vertices.push(this.shipLines.slice(-1)[0].pos);
    return vertices;
  }

  completeLine(shipDir) {
    console.log(shipDir);
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
    } else if (pos[0] > 500 && pos[1] > 300) {
      return 3;
    } else {
      return 4;
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
    this.checkLineComplete();
  }
}

Game.BG_COLOR = "rgba(226, 226, 232, 0.8)";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
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
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [2, 0];
    options.color = options.color || randomColor();
    super(options);
    this.isDrawing = false;
    this.canDraw = false;
    this.game = options.game;
    this.isHiding = true;
    this.gRadius = 11;
    this.prevPos = [null, null];
  }

  drawLine() {
    let delta = new Date().getTime() - this.lastCall;
    if (this.canDraw === true && this.isDrawing === true &&
      (this.pos[0] !== this.prevPos[0] ||
      this.pos[1] !== this.prevPos[1])) {
      const shipLine = new ShipLine({
        pos: this.pos,
        vel: [0,0],
        color: this.color,
        game: this.game,
        shipDir: Util.direction(this.vel)
      });
      this.lastCall = new Date().getTime();
      this.game.add(shipLine);
      this.prevPos = this.pos;
    }

  }

  power(impulse, k) {
    if (this.canDraw === false) {
      // console.log(this.game.allowedTrack[this.pos]);
      // console.log(this.game.allowedTrack[[this.pos[0] - 1, this.pos[1]]]);
      if (Util.direction(this.vel) === 'up' && k === 's' &&
        this.isValidMove([this.pos[0], this.pos[1] - 1])) {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
      } else if (Util.direction(this.vel) === 'down' && k === 'w' &&
        this.isValidMove([this.pos[0], this.pos[1] + 1])) {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
      } else if (Util.direction(this.vel) === 'left' && k === 'd' &&
        this.isValidMove([this.pos[0] + 1, this.pos[1]])) {
        this.vel[0] = impulse[0];
        this.vel[1] = impulse[1];
        // this.pos[0] += 1
      } else if (Util.direction(this.vel) === 'right' && k === 'a' &&
        this.isValidMove([this.pos[0] - 1, this.pos[1]])) {
        this.vel[0] = impulse[0];
        this.vel[1] = impulse[1];
        // this.pos[0] -= 1;
        // console.log("Kkkkasdlfkj")
      }

    } else {
      if (this.canDraw === true) {
        this.isDrawing = true;
        if (Util.direction(this.vel) === 'up' && k != 's') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        } else if (Util.direction(this.vel) === 'down' && k != 'w') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        } else if (Util.direction(this.vel) === 'left' && k != 'd') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        } else if (Util.direction(this.vel) === 'right' && k != 'a') {
          this.vel[0] = impulse[0];
          this.vel[1] = impulse[1];
        }
      }
    }
  }

  relocate() {
    this.pos = this.game.shipRandomPos();
    this.vel = [2, 0];
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
          this.vel = [0, 2];
          break;
        case 'down':
          this.vel = [0, 2];
          break;
        case 'left':
          this.vel = [-2, 0];
          break;
        default:
          this.vel = [-2, 0];
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
      key(k, () => { ship.power(move, k); });
    });

    key("space", () => {
      if (ship.isDrawing) {
        null ;
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
  asyncLoop(o){
    var loop = function(){
      o.functionToLoop(loop);
    };
    loop();//init
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    const that = this;
    this.asyncLoop({
    length : 1000,
    functionToLoop : function(loop, i){
        setTimeout(function(){
            that.ship.drawLine();
            loop();
        },1);
    },
    callback : function(){

    }
});


    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "w": [ 0, -2],
  "a": [-2,  0],
  "s": [ 0,  2],
  "d": [ 2,  0],
};

module.exports = GameView;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map