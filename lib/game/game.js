const Ufo = require("../enemy");
const ShipLine = require("../ship_line");
const Ship = require("../ship");
const Capture = require("../capture");
const Track = require("../track");
const {
  checkLineCompleteHelper,
} = require("./game_helpers/check_line_complete_helper");
const { addCaptureHelper } = require("./game_helpers/add_capture_helper");
const {
  checkCollisionHelper,
} = require("./game_helpers/check_collision_helper");

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
      color: "#f71b3c",
      track: this.allowedTrack,
    });

    this.add(ship);
    return ship;
  }

  addCapture(options) {
    addCaptureHelper(options);
  }

  getAllPoints() {
    return [this.shipLines[0].startPos].concat(
      this.shipLines.map((shipLine) => {
        return [Math.round(shipLine.endPos[0]), Math.round(shipLine.endPos[1])];
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
    checkCollisionHelper(this);
  }

  checkLineComplete() {
    checkLineCompleteHelper(this);
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
    return [Math.random() * 800 - 200 + 200, Math.random() * 300 - 200 + 200];
  }

  shipRandomPos() {
    return [525, 75];
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
      this.ships[0].color = "#f71b3c";
      this.ships[0].relocate();
    }
  }

  getVertices() {
    let initialDir = this.shipLines[0].shipDir;
    let vertices = [this.shipLines[0].pos];
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
    this.ships[0].color = "#f71b3c";
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

Game.BG_COLOR = "rgba(226, 226, 232, 0.8)";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 60;
Game.NUM_UFOS = 3;

module.exports = Game;
