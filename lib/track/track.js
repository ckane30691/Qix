const { addCapturePointsToTrack } = require("./add_capture_points_to_track");
const { startsAndEndsOnEdge } = require("./starts_and_ends_on_edge");
const {
  updateTrackWhereNewCaptureStartsAndEndsOnEdge,
} = require("./update_track_where_capture_starts_and_ends_on_edge");
const {
  startsOnEdgeAndEndsOnCapture,
} = require("./starts_on_edge_and_ends_on_capture");
const {
  startsOnCaptureAndEndsOnEdge,
} = require("./starts_on_capture_ends_on_edge");
const {
  startsOnCaptureAndEndsOnCapture,
} = require("./starts_on_capture_ends_on_capture");
const {
  updateTrackWhereNewCaptureStartsOnEdgeAndEndsOnCapture,
} = require("./update_track_where_new_capture_starts_on_edge_ends_on_capture");
const { findOverlappingEdge } = require("./find_overlapping_edge");
const { determineCornerHelper } = require("./determine_corner_helper");

class Track {
  constructor() {
    this.color = "#04F2D4";
    this.track = this.initTrack();
    // TODO: Get rid of hardcoded values
  }

  initTrack() {
    let track = {};
    for (let i = 75; i < 925; i++) {
      track[[i, 75]] = true;
      track[[i, 525]] = true;
      if (i < 550) {
        track[[75, i]] = true;
        track[[925, i]] = true;
      }
    }
    return track;
  }

  move(timeDelta) {}

  getEdge(pos) {
    if (pos[0] === 75) return 75;
    if (pos[0] === 925) return 925;
    if (pos[1] === 525) return 525;
    if (pos[1] === 75) return 75;
  }

  areOnSameEdge(pos1, pos2) {
    return (
      this.isOnEdge(pos1) &&
      this.isOnEdge(pos2) &&
      this.getEdge(pos1) === this.getEdge(pos2) &&
      (pos1[0] === pos2[0] || pos1[1] === pos2[1])
    );
  }

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

  isOnEdge(pos) {
    return Boolean(this.getEdge(pos));
  }

  determineCorner(startPos, endPos) {
    return determineCornerHelper(startPos, endPos);
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

  formatShape(pointsArr, cornerPair) {
    let allPointsX = [];
    let allPointsY = [];
    pointsArr.forEach((point) => {
      allPointsX.push(point[0]);
      allPointsY.push(point[1]);
    });
    let xPointArray = [].concat(cornerPair[0][0], allPointsX, cornerPair[1][0]);
    // console.log(xPointArray);
    let yPointArray = [].concat(cornerPair[0][1], allPointsY, cornerPair[1][1]);
    return [xPointArray, yPointArray, xPointArray.length];
  }

  buildCornerPairs(startPoint, endPoint) {
    if (startPoint[1] === 75 || startPoint[1] === 525) {
      return [
        [
          this.getLeftCornerCoordX(startPoint),
          this.getLeftCornerCoordX(endPoint),
        ],
        [
          this.getRightCornerCoordX(startPoint),
          this.getRightCornerCoordX(endPoint),
        ],
      ];
    } else {
      return [
        [
          this.getTopCornerCoordY(startPoint),
          this.getTopCornerCoordY(endPoint),
        ],
        [
          this.getBottomCornerCoordY(startPoint),
          this.getBottomCornerCoordY(endPoint),
        ],
      ];
    }
  }

  updateTrack(newPoints, additionalIntersectingCapturePoints) {
    // https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line
    let startPoint = newPoints[0];
    let endPoint = newPoints.slice(-1)[0];

    addCapturePointsToTrack(newPoints, this);

    // First need to check if the capture starts and ends on an edge if so execute the below logic,
    // otherwise we need separate logic for if it starts on a capture and ends on an edge
    // logic for if it starts on an edge and ends on a capture
    // logic for if it starts on a capture and ends on a capture
    if (startsAndEndsOnEdge(this, startPoint, endPoint)) {
      updateTrackWhereNewCaptureStartsAndEndsOnEdge(
        this,
        startPoint,
        endPoint,
        newPoints
      );
    } else if (startsOnEdgeAndEndsOnCapture(this, startPoint, endPoint)) {
      console.log(
        findOverlappingEdge(newPoints, additionalIntersectingCapturePoints)
      );
      // determineCornerPointFromAdditionalCapturePoints(
      //   startPoint,
      //   additionalIntersectingCapturePoints
      // );
      // updateTrackWhereNewCaptureStartsOnEdgeAndEndsOnCapture();
    } else if (startsOnCaptureAndEndsOnEdge(this, startPoint, endPoint)) {
      console.log("Starts on capture, ends on edge");
      //   updateTrackWhereNewCaptureStartsOnCaptureAndEndsOnEdge();
    } else if (startsOnCaptureAndEndsOnCapture(this, startPoint, endPoint)) {
      console.log("starts on capture, ends on capture");
      //   updateTrackWhereNewCaptureStartsOnCaptureAndEndsOnCapture();
    }

    // New Capture Starts and Ends on the Same Edge

    // TODO: Handle case where you can move along edges of connected shapes
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.moveTo(75, 75);
    ctx.lineTo(925, 75);
    ctx.stroke();
    ctx.lineTo(925, 525);
    ctx.stroke();
    ctx.lineTo(75, 525);
    ctx.stroke();
    ctx.lineTo(75, 75);
    ctx.stroke();
    ctx.closePath();
  }
}

module.exports = Track;
