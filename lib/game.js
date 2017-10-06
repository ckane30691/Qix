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
