const Util = require("./util");
const MovingObject = require("./moving_object");
const Ufo = require("./enemy");

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
    this.capturePoints = options.capturePoints;
  }

  collideWith(otherObject) {
    if (otherObject instanceof Ufo) {
      [otherObject.vel[0], otherObject.vel[1]] = [
        -otherObject.vel[0],
        -otherObject.vel[1]
      ];
      let impactSound = document.getElementsByClassName("impact-sound")[0];
      impactSound.play();
    }
  }

  intersects(point) {
    // https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
    // console.log('vertices', this.vertices);
    // console.log('allPoints', this.allPoints);

    // return false;
    let startPoint,
      endPoint,
      pointToCheck = point,
      length = this.allPoints.length;
    // console.log(this.allPoints);
    for (let i = 0; i < length - 1; i++) {
      startPoint = this.allPoints[i];
      endPoint = this.allPoints[i + 1];
      // console.log(startPoint, endPoint, pointToCheck);
      if (
        pointToCheck[0] <= Math.max(startPoint[0], endPoint[0]) &&
        pointToCheck[0] >= Math.min(startPoint[0], endPoint[0]) &&
        pointToCheck[1] <= Math.max(startPoint[1], endPoint[1]) &&
        pointToCheck[1] >= Math.min(startPoint[1], endPoint[1])
      ) {
        return true;
      }
    }
    return false;
  }

  getCornerCoords(pos) {
    switch (this.game.determineQuadrant(pos)) {
      case 1:
        return [75, 75];
      case 2:
        return [925, 75];
      case 3:
        return [75, 525];
      case 4:
        return [925, 525];
    }
  }

  // TODO: Pass method in from game and track
  getEdge(pos) {
    return [75, 525, 925].filter(edge => {
      if (pos[0] !== 525 && (edge === pos[0] || edge === pos[1])) {
        return true;
      } else if ((pos[0] === 525 && pos[1] === 75) || pos[1] === 525) {
        return true;
      }
    })[0];
  }

  getLeftCornerCoordX(pos) {
    if (pos[1] === 75) {
      return [75, 75];
    } else {
      return [75, 525];
    }
  }

  getRightCornerCoordX(pos) {
    if (pos[1] === 75) {
      return [925, 75];
    } else {
      return [925, 525];
    }
  }

  getTopCornerCoordY(pos) {
    if (pos[0] === 75) {
      return [75, 75];
    } else {
      return [925, 75];
    }
  }
  getBottomCornerCoordY(pos) {
    if (pos[0] === 75) {
      return [75, 525];
    } else {
      return [925, 525];
    }
  }

  isCollidedWith(otherObject) {
    for (var i = 0; i < this.allPoints.length; i++) {
      const centerDist = Util.dist(this.allPoints[i], otherObject.pos);
      if (centerDist < this.radius + otherObject.radius) return true;
    }
    return false;
  }

  // TODO: Pass in from game and track
  oppositeEdges(startPos, endPos) {
    let startY = startPos[1],
      startX = startPos[0],
      endY = endPos[1],
      endX = endPos[0];
    if (
      (startY === 75 && endY === 525) ||
      (startY === 525 && endY === 75) ||
      (startX === 75 && endX === 925) ||
      (startX === 925 && endX === 75)
    ) {
      return true;
    }
    return false;
  }

  diagCapture() {
    // move startingQuadrant & endingQuadrant to constructor
    let startingQuad = this.game.determineQuadrant(this.startPos);
    let endingQuad = this.game.determineQuadrant(this.endPos);
    return (startingQuad == 1 && endingQuad == 3) ||
      (endingQuad == 3 && startingQuad == 1) ||
      (endingQuad == 2 && startingQuad == 4) ||
      (endingQuad == 4 && startingQuad == 2)
      ? true
      : false;
  }

  getRemainingPoints() {
    // if (this.diagCapture()) return;
    let startPointX = this.startPos[0];
    let startPointY = this.startPos[1];
    let endPointX = this.endPos[0];
    let endPointY = this.endPos[1];
    let corners = [75, 525, 925];
    let finalPointOne = corners.includes(startPointY)
      ? startPointY
      : startPointX;
    let finalPointTwo = corners.includes(endPointX) ? endPointX : endPointY;
    // console.log(this.oppositeEdges(this.startPos, this.endPos));
    if (!this.oppositeEdges(this.startPos, this.endPos)) {
      if (finalPointOne === startPointY) {
        return [[finalPointTwo, finalPointOne]];
      } else {
        return [[finalPointOne, finalPointTwo]];
      }
    } else {
      let shapeOne;
      let shapeTwo;
      if (this.startPos[1] === 75 || this.startPos[1] === 525) {
        shapeOne = [
          this.getLeftCornerCoordX(this.startPos),
          this.getLeftCornerCoordX(this.endPos)
        ];
        shapeTwo = [
          this.getRightCornerCoordX(this.startPos),
          this.getRightCornerCoordX(this.endPos)
        ];
      } else {
        shapeOne = [
          this.getTopCornerCoordY(this.startPos),
          this.getTopCornerCoordY(this.endPos)
        ];
        shapeTwo = [
          this.getBottomCornerCoordY(this.startPos),
          this.getBottomCornerCoordY(this.endPos)
        ];
      }
      //   debugger;
      let shapeOneArea = this.getArea(shapeOne);
      let shapeTwoArea = this.getArea(shapeTwo);
      //   debugger;
      if (shapeOneArea <= shapeTwoArea) {
        return shapeOne;
      } else {
        return shapeTwo;
      }
    }
  }
  getArea(shape) {
    // possible move to constructor
    let allPointsX = [];
    let allPointsY = [];
    this.allPoints.forEach(point => {
      allPointsX.push(point[0]);
      allPointsY.push(point[1]);
    });
    let xPointArray = [
      allPointsX,
      shape[0][0],
      shape[1][0]
      // this.endPos[0]
    ];
    // console.log(xPointArray);
    let yPointArray = [
      allPointsY,
      shape[0][1],
      shape[1][1]
      // this.endPos[1]
    ];
    // https://www.mathopenref.com/coordpolygonarea2.html
    function polygonArea(X, Y, numPoints) {
      let area = 0; // Accumulates area in the loop
      let j = numPoints - 1; // The last vertex is the 'previous' one to the first

      for (let i = 0; i < numPoints; i++) {
        area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
        j = i; //j is previous vertex to i
        // debugger;
      }
      return area / 2;
    }
    // debugger;
    // console.log(polygonArea(xPointArray, yPointArray, xPointArray.length));
    return polygonArea(xPointArray, yPointArray, xPointArray.length);
  }

  drawRegularCapture(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.moveTo(this.startPos[0], this.startPos[1]);
    for (let i = 1; i < this.allPoints.length; i++) {
      let point = this.allPoints[i];
      ctx.lineTo(point[0], point[1]);
      ctx.stroke();
    }
    ctx.moveTo(this.startPos[0], this.startPos[1]);
    let remainingPoints = this.getRemainingPoints() || [];
    for (let i = 0; i < remainingPoints.length; i++) {
      let point = remainingPoints[i];
      ctx.lineTo(point[0], point[1]);
      ctx.stroke();
    }
    ctx.lineTo(this.endPos[0], this.endPos[1]);
    ctx.fill("evenodd");
  }

  // TODO: Pass in from game and track
  isOnEdge(pos) {
    return Boolean(this.getEdge(pos));
  }

  _getClosestEndPointFromCapturePoints() {
    // console.log(this.startPos, this.endPos, this.allPoints);
    let startPointOfConnectedCapture = this.capturePoints[0];
    let endPointOfConnectedCapture = this.capturePoints.slice(-1)[0];
    let distanceToStartPos = Util.dist(
      this.startPos,
      startPointOfConnectedCapture
    );
    let distanceToEndPos = Util.dist(this.startPos, endPointOfConnectedCapture);
    // console.log(distanceToStartPos, this.capturePoints.slice(-1)[0]);
    return distanceToStartPos <= distanceToEndPos
      ? startPointOfConnectedCapture
      : endPointOfConnectedCapture;
  }

  _getAllVerticiesToClosestEndpoint(endPointOfCapture) {
    let points = this.capturePoints;
    let index;
    for (let i = 0; i < points.length; i++) {
      if (this.endPos[0] === points[i][0] && this.endPos[1] === points[i][1]) {
        index = i;
      }
    }
    console.log(endPointOfCapture, points[0]);
    if (
      endPointOfCapture[0] === points[0][0] &&
      endPointOfCapture[1] === points[0][1]
    ) {
      return this.capturePoints.slice(0, index);
    } else {
      console.log("elsed");
      return this.capturePoints.slice(index);
    }

    // bool PointInPolygon(Point point, Polygon polygon) {
    //   vector < Point > points = polygon.getPoints();
    //   int i, j, nvert = points.size();
    //   bool c = false;

    //   for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    //     if (((points[i].y >= point.y) != (points[j].y >= point.y)) &&
    //       (point.x <= (points[j].x - points[i].x) * (point.y - points[i].y) / (points[j].y - points[i].y) + points[i].x)
    //     )
    //       c = !c;
    //   }

    //   return c;
    // }
  }

  drawStackedCapture(ctx) {
    // console.log(this.isOnEdge());
    if (this.isOnEdge(this.startPos)) {
      let closestEndpoint = this._getClosestEndPointFromCapturePoints();
      // console.log(closestEndpoint);
      let extraVerticies = this._getAllVerticiesToClosestEndpoint(
        closestEndpoint
      );
      // console.log('extravertices begore reverse', extraVerticies);
      if (this.isOnEdge(extraVerticies[0])) {
        extraVerticies = extraVerticies.reverse();
        // console.log('reversed', extraVerticies);
      }
      // console.log(this.allPoints);
      // console.log(this.capturePoints);
      this.allPoints = this.allPoints.concat(extraVerticies);
      this.endPos = closestEndpoint;
      // console.log(extraVerticies);
      this.stacked = false;
      return;
    }
  }

  draw(ctx) {
    if (this.stacked) {
      this.drawStackedCapture(ctx);
    } else {
      this.drawRegularCapture(ctx);
    }
  }
}

module.exports = Capture;
