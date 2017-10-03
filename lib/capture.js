const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");
const ShipLine = require("./ship_line");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 100,
	SPEED: 3
};

class Capture extends MovingObject {
    constructor(options = {}) {
			options.radius = Util.dist(options.startPos, options.endPos) / 2.5;
			options.game = options.game;
			super(options);
			this.stacked = options.stacked;
			this.allPoints = options.allPoints;
			this.pivots = options.pivots
			this.gRadius = this.radius + 20;
      this.startPos = options.startPos;
			this.endPos = options.endPos;
			this.transparent = false;
			// this.sprite = "images/qix_enemy.png"
			this.type = 'static'
			this.pos = Math.abs(this.startPos[0] - this.endPos[0]) > Math.abs(this.startPos[1] - this.endPos[1]) ?
				[(this.startPos[0] + this.endPos[0]) / 2, (this.startPos[1] + this.endPos[1]) / 2]
				: [(this.startPos[0] + this.endPos[0]) / 2, (this.startPos[1] + this.endPos[1]) / 2]
    }

    collideWith(otherObject) {

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
		draw(ctx) {
			ctx.beginPath()
			// ctx.fillStyle = this.color;
			if (this.stacked) {
				ctx.moveTo(this.startPos[0], this.startPos[1])
			} else {
				ctx.moveTo(...this.getQuadrantCoords(this.startPos));
			}
			let used = []
			this.allPoints.forEach((pos, idx) => {
				if (idx === this.allPoints.length - 1) {
					if (this.stacked) {
						ctx.lineTo(pos[0], pos[1]);
						ctx.moveTo(pos[0], pos[1]);
						ctx.stroke()
					} else {
						ctx.lineTo(...this.getQuadrantCoords(this.endPos))
					}
				} else {
						ctx.lineTo(pos[0], pos[1]);
						ctx.stroke()
				}
				// 	used.slice(0).forEach(usedPos => {
				// 		if (pos[0] === usedPos[0] && pos[1] === usedPos[1]) {
				// 			flag = false;
				// 		} else {
				// 			// used.push(pos)
				// 		}
				// 	})

			})
		}
}

module.exports = Capture;

// ctx.fillStyle = this.color;
// ctx.moveTo(this.startPos[0], this.startPos[1]);
// this.allPoints.forEach((el, idx) => {
// 	ctx.lineTo(el[0], el[1]);
// 	ctx.moveTo(el[0], el[1]);
// 	ctx.stroke()
// 	if (idx === this.allPoints.length - 1) {
// 		// ctx.lineTo(this.endPos[0], this.endPos[1])
// 		// ctx.stroke()
// 		return;
// 	}
// })
// ctx.fill();
// }
// }
