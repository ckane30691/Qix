const MovingObject = require("./moving_object");
const ShipLine = require("./ship_line");
const Util = require("./util");
const Capture = require("./capture");
const Ufo = require("./enemy");

function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += hexDigits[Math.floor(Math.random() * 16)];
  }

  return color;
}

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = options.color || randomColor();
    super(options);
    this.isDrawing = false;
    this.canDraw = false;
    this.game = options.game;
    this.isHiding = true;
    this.gRadius = 11;
    this.endPos = null;
    this.moveStartTime = null;
    this.moveEndTime = null;
    this.startPos = null;
  }

  drawLine() {
    let delta = new Date().getTime() - this.lastCall;
    if (
      this.canDraw === true &&
      this.isDrawing === true &&
      (this.pos[0] !== this.prevPos[0] || this.pos[1] !== this.prevPos[1])
    ) {
      const shipLine = new ShipLine({
        pos: this.pos,
        vel: [0, 0],
        color: this.color,
        game: this.game,
        shipDir: Util.direction(this.vel)
      });
      this.lastCall = new Date().getTime();
      this.game.add(shipLine);
      this.prevPos = this.pos;
    }
  }

  //   draw(ctx, isBetween) {
  //     // console.log(isBetween);
  //     if (!isBetween) {
  //       ctx.fillStyle = this.color;
  //       ctx.beginPath();
  //       let radius = this.gRadius || this.radius;
  //       ctx.arc(this.pos[0], this.pos[1], radius, 0, 2 * Math.PI, true);
  //       ctx.fill();
  //     } else {
  //       ctx.fillStyle = this.color;
  //       ctx.beginPath();
  //       let radius = this.gRadius || this.radius;
  //       ctx.arc(
  //         this.betweenPos[0],
  //         this.betweenPos[1],
  //         radius,
  //         0,
  //         2 * Math.PI,
  //         true
  //       );
  //       ctx.fill();
  //     }
  //   }

  move(timeDelta) {
    if (!this.moveStartTime) {
      return;
    }
    let percentDone = (performance.now() - this.moveStartTime) / 1000;
    console.log(this.moveStartTime);
    let differenceX = this.endPos[0] - this.startPos[0];
    let differenceY = this.endPos[1] - this.startPos[1];
    this.pos[0] = this.startPos[0] + differenceX * percentDone;
    this.pos[1] = this.startPos[1] + differenceY * percentDone;
    console.log(percentDone >= 1);
    if (percentDone >= 1) {
      console.log(percentDone);
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
    this.moveEndTime = this.moveStartTime + 1000;
    this.startPos = this.pos.slice();
    if (!this.endPos) {
      this.endPos = [
        this.startPos[0] + impulse[0],
        this.startPos[1] + impulse[1]
      ];
    } else {
      return;
    }

    // should assign a next Pos variable
    // moveStartTime and moveEndTime
    // Normalize the difference between movestart and movend
    // let deltaTime = window.timeDelta / (1000 / 60);
  }

  relocate() {
    this.pos = this.game.shipRandomPos();
    this.vel = [0, 0];
  }

  collideWith(otherObject) {
    if (otherObject instanceof ShipLine) {
      // console.log(this.game.shipLines.indexOf(otherObject))
      // console.log(this.game.shipLines.length)
      if (
        this.game.shipLines.indexOf(otherObject) - this.game.shipLines.length <
        -5
      ) {
        this.removeAll();
        this.canDraw = false;
        this.color = "#f71b3c";
      }
    } else if (otherObject instanceof Ufo) {
      this.removeAll();
      this.canDraw = false;
      this.color = "#f71b3c";
      return true;
    } else if (otherObject instanceof Capture) {
      let dir = Util.direction(this.vel);
      switch (dir) {
        case "up":
          this.vel = [0, 2];
          break;
        case "down":
          this.vel = [0, 2];
          break;
        case "left":
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
