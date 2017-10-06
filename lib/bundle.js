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
      return 'left'
    } else {
      return 'down'
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
    if (this.sprite) {
      let img = new Image();
      img.src = this.sprite
      ctx.drawImage(img, this.pos[0], this.pos[1], 100, 100);
    } else if (this.transparent) {
        ctx.fillStyle = this.color;
        // ctx.globalAlpha = 0.5;
        ctx.beginPath();
        let radius = this.gRadius || this.radius
        ctx.arc(
          this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true
      );
      ctx.fill();
      // ctx.globalAlpha = 1.0;
    } else {
      ctx.fillStyle = this.color;
      // ctx.globalAlpha = 0.5;
      ctx.beginPath();
      let radius = this.gRadius || this.radius
      ctx.arc(
        this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
    }
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
        // impactSound.play()
        }
  		if (this.pos[0] + offsetX > 935) {
  			this.vel[0] = -this.vel[0];
        // impactSound.play()
  		}
      if (this.pos[1] + offsetY < 70) {
        this.vel[1] = -this.vel[1];
        // impactSound.play()
        }
  		if (this.pos[1] + offsetY > 535) {
  			this.vel[1] = -this.vel[1];
        // impactSound.play()
  		}
    } else {
      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];

      if (this.pos[0] + offsetX < 70) {
        this.vel[0] = 0;
        }
  		if (this.pos[0] + offsetX > 935) {
  			this.vel[0] = 0;
  		}
      if (this.pos[1] + offsetY < 70) {
        this.vel[1] = 0;
        }
  		if (this.pos[1] + offsetY > 535) {
  			this.vel[1] = 0;
      }
    }
  }

  remove() {
    this.game.remove(this);
  }

  removeAll() {
    this.game.removeAll(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const Capture = __webpack_require__(4)
const Ufo = __webpack_require__(7)

class ShipLine extends MovingObject {
  constructor(options) {
    options.radius = ShipLine.RADIUS;
    super(options);
    this.shipDir = options.shipDir;
    this.pos = options.pos
    this.game = options.game;
    this.type = 'mobile'
    this.vel = [0, 0]
    // console.log(this.shipDir);
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

ShipLine.RADIUS = 5;

module.exports = ShipLine;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const MovingObject = __webpack_require__(1);
const ShipLine = __webpack_require__(2);
const Util = __webpack_require__(0);
const Capture = __webpack_require__(4)
const Ufo = __webpack_require__(7)

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
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    super(options);
    // this.sprite = 'images/qix_ship.png'
    this.isDrawing = false;
    this.canDraw = true;
    this.isHiding = true;
    this.type = 'none'
  }

  drawLine() {
    if (this.isDrawing === true) {
      const shipLine = new ShipLine({
        pos: this.pos,
        vel: [0,0],
        color: this.color,
        game: this.game,
        shipDir: Util.direction(this.vel)
      });

      this.game.add(shipLine);
    }

  }

  power(impulse) {
    if (impulse[0] != -this.vel[0]) {
      this.vel[0] = impulse[0];
    }
    if (impulse[1] != -this.vel[1]) {
      this.vel[1] = impulse[1];
    }
  }

  // hide() {
  //   this.isHiding ? this.isHiding = false : this.isHiding = true
  // }

  relocate() {
    this.pos = this.game.shipRandomPos();
    this.vel = [0, 0];
  }

  collideWith(otherObject) {
    if (otherObject instanceof Capture && !this.isHiding) {
      [this.vel[0], this.vel[1]] = [-this.vel[0], -this.vel[1]]
    } else if (otherObject instanceof Ufo) {
      this.removeAll();
      return true;
    }
  }

  isInCapture(otherObject) {
    if (otherObject instanceof Capture) {
      if (otherObject.isCollidedWith(this)) {
        return true;
      }
    }
  }
}

Ship.RADIUS = 15;
module.exports = Ship;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);
const Ufo = __webpack_require__(7)

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 100,
	SPEED: 3
};

class Capture extends MovingObject {
    constructor(options = {}) {
			// options.radius = Util.dist(options.startPos, options.endPos) / 2.5;
			options.radius = 1;
			options.game = options.game;
			super(options);
			this.startDir = options.startDir;
			this.endDir = options.endDir;
			this.stacked = options.stacked
			this.allPoints = options.allPoints;
			this.gRadius = this.radius + 20;
      this.startPos = options.startPos;
			this.endPos = options.endPos;
			this.transparent = false;
			// this.sprite = "images/qix_enemy.png"
			this.type = 'static'
			this.vel = [0, 0]
			this.pos = Math.abs(this.startPos[0] - this.endPos[0]) > Math.abs(this.startPos[1] - this.endPos[1]) ?
				[(this.startPos[0] + this.endPos[0]) / 2, (this.startPos[1] + this.endPos[1]) / 2]
				: [(this.startPos[0] + this.endPos[0]) / 2, (this.startPos[1] + this.endPos[1]) / 2]
				// console.log(this.startDir);
				// console.log(this.endDir);
				// console.log(this.stacked);
    }

    collideWith(otherObject) {
			if (otherObject instanceof Ufo) {
				[otherObject.vel[0], otherObject.vel[1]] = [-otherObject.vel[0], -otherObject.vel[1]]
				let impactSound = document.getElementsByClassName("impact-sound")[0];
				impactSound.play()
			}
    }

		getQuadrantCoords(pos) {
			// console.log(pos);
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
			return false
	  }

		opposite(dir1, dir2) {
			if (dir1 === 'right' && dir2 === 'left') {
				return true
			} else if (dir1 === 'left' && dir2 === 'right') {
				return true
			} else if (dir1 === 'up' && dir2 === 'down') {
				return true
			} else if (dir1 === 'down' && dir2 === 'up') {
				return true
			} else {
				return false
			}
		}


		determineStacked() {
			if (this.stacked === true) return true;
			return (this.opposite(this.startDir, this.endDir)) ? true : false
		}

		oneLiner() {
			if (this.startDir === this.endDir) {
				return true
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
			ctx.beginPath()
			ctx.fillStyle = this.color;
			ctx.strokeStyle = this.color;
			ctx.lineWidth = 15;
			// console.log(this.determineStacked());
			if (this.determineStacked()) {
				ctx.moveTo(this.startPos[0], this.startPos[1])
			} else {
				ctx.moveTo(...this.getQuadrantCoords(this.startPos));
			}

			this.allPoints.forEach((pos, idx) => {
				if (idx === this.allPoints.length - 1) {
					if (this.determineStacked()) {
						if (this.diagCapture()) {
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
							console.log(true);
						} else if (this.oneLiner()) {
							if (this.startDir === 'up' || this.startDir === 'down') {
								ctx.lineTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
								ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.endPos[1]);
								ctx.stroke()
								ctx.lineTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
								// ctx.moveTo(this.getQuadrantCoords(this.startPos)[0], this.startPos[1]);
								// ctx.stroke()
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								// ctx.stroke()
								ctx.closePath()
								ctx.fill()
							} else {
								ctx.lineTo( this.endPos[0], this.getQuadrantCoords(this.startPos)[1]);
								ctx.moveTo( this.endPos[0], this.getQuadrantCoords(this.startPos)[1]);
								ctx.stroke()
								ctx.lineTo(this.startPos[0], this.getQuadrantCoords(this.startPos)[1]);
								// ctx.moveTo(this.startPos[0], this.getQuadrantCoords(this.startPos)[1]);
								// ctx.stroke()
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke()
								ctx.closePath()
								ctx.fill()
							}

						} else {
							// console.log(this.startPos[1]);
							if (this.startDir === 'up' || this.startDir === 'down') {
								ctx.lineTo(this.endPos[0], this.startPos[1]);
								ctx.moveTo(this.endPos[0], this.startPos[1]);
								// ctx.moveTo(pos[0], pos[1]);
								ctx.stroke()
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke()
								ctx.closePath()
								ctx.fill()
							} else {
								ctx.lineTo(this.startPos[0], this.endPos[1]);
								ctx.moveTo(this.startPos[0], this.endPos[1]);
								// ctx.moveTo(pos[0], pos[1]);
								ctx.stroke()
								ctx.lineTo(this.startPos[0], this.startPos[1]);
								ctx.moveTo(this.startPos[0], this.startPos[1]);
								ctx.stroke()
								ctx.closePath()
								ctx.fill()
							}
						}
					} else {
							ctx.lineTo(...this.getQuadrantCoords(this.endPos))
							// ctx.stroke()
							ctx.closePath()
							ctx.fill()
						}
				} else {
						ctx.lineTo(pos[0], pos[1]);
						ctx.stroke()
				}
			})
		}
}

module.exports = Capture;


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

  openBtn.onclick = function() {
      modal.style.display = "block";
  }

  closeBtn.onclick = function() {
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  let slideIndex = 1;
  showSlides(slideIndex);

  function plusSlides(n) {
    showSlides(slideIndex += n);
  }

  function currentSlide(n) {
    showSlides(slideIndex = n);
  }

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    // let dots = document.getElementsByClassName("demo");
    let captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
  }

  prevBtn.onclick = () => plusSlides(-1);
  nextBtn.onclick = () => plusSlides(1);

  //disable space-bar scrolling
  window.onkeydown = function(e) {
  if (e.keyCode == 32 && e.target == document.body) {
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
  muteBtn.className = muteBtn.className === "mute true" ? "mute" : "mute true"
}

startBtn.onclick = () => {
  startBtn.className += " hidden"
  let theme = document.getElementsByClassName("theme")[0];
  theme.play()
  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
}
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Ufo = __webpack_require__(7);
const ShipLine = __webpack_require__(2);
const Ship = __webpack_require__(3);
const Util = __webpack_require__(0);
const Capture = __webpack_require__(4)

function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

// NOTE Add isInCapture function for shipLines.slice(-1)[0] to determine lineComplete

class Game {
  constructor() {
    this.ufos = [];
    this.shipLines = [];
    this.ships = [];
    this.captures = [];
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
    } else {
      throw "wtf?";
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
      color: '#f71b3c'
    });

    this.add(ship);

    return ship;
  }

  addCapture(startPos, endPos, stacked, startDir, endDir) {
    const capture = new Capture({
      startPos: startPos,
      endPos: endPos,
      stacked: stacked,
      startDir: startDir,
      endDir: endDir,
      color: '#00f6fd',
      game: this,
      allPoints: this.getAllUniquePoints(),
    })
    this.add(capture)
    let captureSound = document.getElementsByClassName("capture-sound")[0];
    captureSound.play()
  }

  getAllPoints() {
    let result = []
    this.shipLines.map(shipLine => {
      result.push([Math.round(shipLine.pos[0]), Math.round(shipLine.pos[1])])
    })
    return result
  }

  includesPos(array, pos) {
    return array.some(el => el[0] === pos[0] && el[1] === pos[1])
  }

  getAllUniquePoints() {
    let result = []
    this.getAllPoints().forEach(pos => {
      if (result.length < 1) result.push(pos);
      this.includesPos(result, pos) ? null : result.push(pos)
    })
    return result;
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
             deathSound.play()
             return;
          }
        } else if (obj1 instanceof ShipLine && obj1.isInCapture(obj2)) {
            if (this.ships[0].isDrawing && this.shipLines.length > 50) {
              let stacked = true;
              this.addCapture(this.shipLines[0].pos, this.shipLines.slice(-1)[0].pos, stacked, this.shipLines[0].shipDir, this.shipLines.slice(-1)[0].shipDir)
              this.completeLine()
            } else {
            obj1.canDraw = true;
          }
        }
      }
    }
  }

  checkLineComplete() {
    if (this.ships[0].isDrawing &&
      this.shipLines.length > 50 &&
      this.shipLines[0].isCollidedWith(this.shipLines.slice(-1)[0])) {
        this.addCapture(this.shipLines[0].pos, this.shipLines.slice(-1)[0].pos, true, this.shipLines[0].shipDir, this.shipLines.slice(-1)[0].shipDir)
        this.completeLine()
    } else if (this.ships[0].isDrawing &&
        this.shipLines.length > 50 &&
        this.isOutOfBounds(this.shipLines.slice(-1)[0].pos) &&
        this.isOutOfBounds(this.shipLines[0].pos)) {
          this.addCapture(this.shipLines[0].pos, this.shipLines.slice(-1)[0].pos, false, this.shipLines[0].shipDir, this.shipLines.slice(-1)[0].shipDir)
          this.completeLine()

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
    return (pos[0] < 20) || (pos[1] < 20) ||
      (pos[0] > Game.DIM_X - 20) || (pos[1] > Game.DIM_Y - 20);
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  randomPosition() {
    return [
      Math.random() * (900 - 100) + 100,
      Math.random() * (500 - 100) + 100
    ];
  }

  shipRandomPos() {
    return [
      950 * Math.random(),
      55
    ]
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
      this.ships[0].relocate();
    }
  }

  // hideShip() {
  //   if this.ships[0].isHiding {
  //     captures.forEach((el) => el.transparent = true)
  //   }
  // }

  completeLine() {
    this.shipLines = [];
    this.ships[0].isDrawing = false;
  }

  determineQuadrant(pos) {
    if (pos[0] < 500 && pos[1] < 300) {
      return 1;
    } else if (pos[0] > 500 && pos[1] < 300) {
      return 2;
    } else if (pos[0] > 500 && pos[1] > 300) {
      return 3;
    } else {
      return 4
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
    this.checkLineComplete();
    // console.log(this.ships[0].pos)
    // this.hideShip();
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

const Util = __webpack_require__(0);
const MovingObject = __webpack_require__(1);

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
			this.type = 'mobile'
			// this.sprite = "images/qix_enemy.png"
    }

    collideWith(otherObject) {
    }
}

module.exports = Ufo;


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
      key(k, () => { ship.power(move); });
    });

    key("space", () => { this.game.isOutOfBounds(ship.pos) || ship.canDraw ?
      ship.isDrawing = true
      : null });

    // key("shift", () => { this.ship.hide() });
    // this.ship.isHiding = false;

  }

  // https://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
  asyncLoop(o){
    var loop = function(){
      o.functionToLoop(loop);
    }
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