const Ufo = require("./enemy");
const ShipLine = require("./ship_line");
const Ship = require("./ship");
const Util = require("./util");
const Capture = require("./capture");

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
    for (let i = 50; i < 958; i++) {
      this.add([i, 54]);
      this.add([i, 549]);
      if (i < 550 && i > 53) {
        this.add([54, i]);
        this.add([958, i]);
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
