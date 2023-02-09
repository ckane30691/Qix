const Util = require("../util");

const findIntersectingIndex = (arrayOfPoints, point) => {
  for (let i = 0; i < arrayOfPoints.length; i++) {
    if (arrayOfPoints[i][0] === point[0] && arrayOfPoints[i][1] === point[1]) {
      return i;
    }
  }
  return null;
};

const shouldHeadTowardStart = (captureStartX, captureEndX, target) => {
  return (
    captureStartX === Util.findClosestNumber(captureStartX, captureEndX, target)
  );
};

module.exports = {
  findOverlappingEdge: (drawnPoints, additionalIntersectingCapturePoints) => {
    const captureStart = additionalIntersectingCapturePoints[0];
    const captureEnd = additionalIntersectingCapturePoints.slice(-1)[0];
    const drawnPointStart = drawnPoints[0];
    const drawnPointEnd = drawnPoints.slice(-1)[0];
    let result = [];
    // Handle X Oriented Shapes on edge
    let intersectingIndex = findIntersectingIndex(
      additionalIntersectingCapturePoints,
      drawnPointEnd
    );
    if (
      captureStart[1] === captureEnd[1] &&
      captureStart[1] === drawnPointStart[1] &&
      captureEnd[1] === drawnPointStart[1]
    ) {
      // if (!intersectingIndex)
      //   intersectingIndex = findIntersectingIndex(
      //     additionalIntersectingCapturePoints,
      //     drawnPointStart
      //   );
      // console.log("capture start x", captureStart[0]);
      // console.log("capture end x", captureEnd[0]);
      // console.log("Drawn point Start");
      if (
        shouldHeadTowardStart(
          captureStart[0],
          captureEnd[0],
          drawnPointStart[0]
        )
      ) {
        for (let i = intersectingIndex; i >= 0; i--) {
          result.push(additionalIntersectingCapturePoints[i]);
        }
      } else {
        for (
          let i = intersectingIndex;
          i < additionalIntersectingCapturePoints.length;
          i++
        ) {
          result.push(additionalIntersectingCapturePoints[i]);
        }
      }
      return result;
      // Handle Y oriented shapes
    } else if (
      captureStart[0] === captureEnd[0] &&
      captureStart[0] === drawnPointStart[0] &&
      captureEnd[0] === drawnPointStart[0]
    ) {
      if (
        shouldHeadTowardStart(
          captureStart[1],
          captureEnd[1],
          drawnPointStart[1]
        )
      ) {
        for (let i = intersectingIndex; i >= 0; i--) {
          result.push(additionalIntersectingCapturePoints[i]);
        }
      } else {
        for (
          let i = intersectingIndex;
          i < additionalIntersectingCapturePoints.length;
          i++
        ) {
          result.push(additionalIntersectingCapturePoints[i]);
        }
      }
      return result;
    }
  },
};
