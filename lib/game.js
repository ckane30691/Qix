const Ufo = require("./enemy");
const ShipLine = require("./ship_line");
const Ship = require("./ship");
const Util = require("./util");
const Capture = require("./capture")

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
      pos: this.randomPosition(),
      game: this
    });

    this.add(ship);

    return ship;
  }

  addCapture(startPos, endPos) {
    const capture = new Capture({
      startPos: startPos,
      endPos: endPos,
      color: randomColor(),
      game: this,
      allPoints: this.getAllPoints(),
      pivots: this.calculateLinePivots()
    })
    this.add(capture)
    console.log(capture);
  }

  getAllPoints() {
    return this.shipLines.map(el => el.pos)
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
          if (collision) return;
        } else if (obj1 instanceof Ship && obj1.isInCapture(obj2)) {
            if (obj1.isDrawing && this.shipLines.length > 50) {
              this.addCapture(this.shipLines.slice(-1)[0].pos, this.shipLines[0].pos)
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
        // this.removeAll(this.ships[0])
    } else if (this.ships[0].isDrawing &&
        this.shipLines.length > 50 &&
        this.isOutOfBounds(this.shipLines.slice(-1)[0].pos)) {
          this.addCapture(this.shipLines.slice(-1)[0].pos, this.shipLines[0].pos)
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
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
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
      this.ships[0].relocate();
    }
  }

  // hideShip() {
  //   if this.ships[0].isHiding {
  //     captures.forEach((el) => el.transparent = true)
  //   }
  // }

  calculateSlope(x1, y1, x2, y2) {
        // rise over run
    var s = (y1 - y2) / (x1 - x2);
    /*if (x1==x2) {
        // slope is Infinity or -Infinity
    }*/
    return s;
  }

  calculateLinePivots() {
    let pivot_points = []
    this.shipLines.forEach(el1 => {
      let currentSlope;
      let el1XPos = Math.floor(el1.pos[0])
      let el1YPos = Math.floor(el1.pos[1])
      this.shipLines.forEach(el2 => {
        let el2XPos = Math.floor(el2.pos[0])
        let el2YPos = Math.floor(el2.pos[1])
        let newSlope = this.calculateSlope(el1XPos, el1YPos, el2XPos, el2YPos);
        if (this.shipLines.indexOf(el1) % 500 === 0 && el1 !== el2 && Math.abs(Math.floor(newSlope)) != currentSlope) {
          currentSlope = Math.abs(Math.floor(newSlope));
          if (pivot_points.length < 1) {
            pivot_points.push([el2XPos, el2YPos])
          } else {
            pivot_points.slice(0).forEach(el => {
              if (!el.includes(el2XPos) && !el.includes(el2YPos)) {
                pivot_points.push([el2XPos, el2YPos])
                // console.log(true);
              }
            })
          }

        }
      })
    })
    console.log(pivot_points);
    return pivot_points;
  }

  completeLine() {
    this.shipLines = [];
    this.ships[0].isDrawing = false;
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
    this.checkLineComplete();
    // this.hideShip();
  }
}

Game.BG_COLOR = "rgba(226, 226, 232, 0.8)";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_UFOS = 3;

module.exports = Game;
