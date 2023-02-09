const Util = require("../util");

const findTargetInFirstColumnOfMatrix = (matrix, target) => {
  let result = [];
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][0] === target) {
      result.push(matrix[i]);
    }
  }
  return result;
};

const findTargetInSecondColumnOfMatrix = (matrix, target) => {
  let result = [];
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][1] === target) {
      result.push(matrix[i]);
    }
  }
  return result;
};

module.exports = {
  determineCornerHelper: (startPos, endPos) => {
    let startPointX = startPos[0];
    let startPointY = startPos[1];
    let endPointX = endPos[0];
    let endPointY = endPos[1];
    const corners = [
      [75, 75], // Top Left
      [75, 525], // Bottom Left
      [925, 75], // Top Right
      [925, 525], // Bottom Right
    ];
    let cornerCandidates = findTargetInFirstColumnOfMatrix(
      corners,
      startPointX
    );
    // Handle Y Oriented Shapes
    if (cornerCandidates.length) {
      let cornerCandidateY1 = cornerCandidates[0][1];
      let cornerCandidateY2 = cornerCandidates[1][1];
      let finalCandiate = Util.findClosestNumber(
        cornerCandidateY1,
        cornerCandidateY2,
        endPointY
      );
      return findTargetInSecondColumnOfMatrix(
        cornerCandidates,
        finalCandiate
      )[0];
    }
    // Handle X Oriented Shapes
    if (!cornerCandidates.length)
      cornerCandidates = findTargetInSecondColumnOfMatrix(corners, startPointY);
    let cornerCandidateX1 = cornerCandidates[0][0];
    let cornerCandidateX2 = cornerCandidates[1][0];
    let finalCandiate = Util.findClosestNumber(
      cornerCandidateX1,
      cornerCandidateX2,
      endPointX
    );
    return findTargetInFirstColumnOfMatrix(cornerCandidates, finalCandiate)[0];
  },
};
