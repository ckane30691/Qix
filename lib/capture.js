const Util = require("./util");
const MovingObject = require("./moving_object");
const Ufo = require('./enemy')

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
			this.pivots = options.pivots
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
				console.log(this.stacked);
    }

    collideWith(otherObject) {
			if (otherObject instanceof Ufo) {
				[otherObject.vel[0], otherObject.vel[1]] = [-otherObject.vel[0], -otherObject.vel[1]]
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

		draw(ctx) {
			ctx.beginPath()
			ctx.fillStyle = this.color;
			// console.log(this.determineStacked());
			if (this.determineStacked()) {
				ctx.moveTo(this.startPos[0], this.startPos[1])
			} else {
				ctx.moveTo(...this.getQuadrantCoords(this.endPos));
			}
			let used = []
			this.allPoints.forEach((pos, idx) => {
				if (idx === this.allPoints.length - 1) {
					if (this.determineStacked()) {
						// console.log(this.startPos[1]);
						ctx.lineTo(pos[0], this.startPos[1]);
						ctx.moveTo(pos[0], this.startPos[1]);
						// ctx.moveTo(pos[0], pos[1]);
						ctx.stroke()
						ctx.closePath()
						ctx.fill()
					} else {
						ctx.lineTo(...this.getQuadrantCoords(this.startPos))
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
