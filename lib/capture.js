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

		draw(ctx) {
			ctx.fillStyle = this.color;
			ctx.beginPath()
			let used = []
			this.allPoints.forEach((el, idx) => {
				if (!used.includes(el)) {
					used.push(el)
					ctx.moveTo(el[0], el[1]);
					ctx.lineTo(el[0], el[1]);
				}
			})
			ctx.fill();
		}
}

module.exports = Capture;
