// determineCorner(startPos, endPos) {
//     let startPointX = startPos[0];
//     let startPointY = startPos[1];
//     let endPointX = endPos[0];
//     let endPointY = endPos[1];
//     let corners = [75, 525, 925];
//     let finalPointOne = corners.includes(startPointY)
//       ? startPointY
//       : startPointX;
//     let finalPointTwo = corners.includes(endPointX) ? endPointX : endPointY;
//     if (finalPointOne === startPointY) {
//       return [finalPointTwo, finalPointOne];
//     } else {
//       return [finalPointOne, finalPointTwo];
//     }
//   }

module.exports = {
  determineCornerPointFromAdditionalCapturePoints: (point, capturePoints) => {
    // Need to get start and end points for deleting of the outer edge
    // Need to get points from additional capture that make the rest of the new capture
    // Delete all those points off the track
    // ===========================================================
    // Edge case for connecting a capture from the opposite edge
    // Get both corners
    // Need to get points from additional capture that make the rest of the new capture
    // Delete all those points off the track
    // ===========================================================
    // Edge case for connecting a capture from a different edge but not the opposite edge
    // Need to get points from additional capture that make the rest of the new capture
    // Need to get the appropriate corner and delete the points from start point to the corner to the end or start point of the additional capture
    // Delete all those points off the track
  },
};
