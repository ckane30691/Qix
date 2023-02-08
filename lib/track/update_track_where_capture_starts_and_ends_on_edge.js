const { deleteOldTrack } = require("./delete_points_from_old_track");
const Util = require("../util");

const updateTrackWhereCaptureIsOnIntersectingEdges = (
  track,
  startPoint,
  endPoint
) => {
  let corner = track.determineCorner(startPoint, endPoint);
  deleteOldTrack(startPoint, corner, track);
  deleteOldTrack(endPoint, corner, track);
};

const deleteSmallerHalfFromTrack = (
  track,
  shapeOneArea,
  shapeTwoArea,
  startPoint,
  endPoint,
  cornerPairOne,
  cornerPairTwo
) => {
  if (Math.abs(shapeOneArea) <= Math.abs(shapeTwoArea)) {
    deleteOldTrack(startPoint, cornerPairOne[0], track);
    deleteOldTrack(endPoint, cornerPairOne[1], track);
  } else {
    deleteOldTrack(startPoint, cornerPairTwo[0], track);
    deleteOldTrack(endPoint, cornerPairTwo[1], track);
  }
};

const updateTrackWhereCaptureIsOnOppositeEdges = (
  track,
  startPoint,
  endPoint,
  newPoints
) => {
  let cornerPairs = track.buildCornerPairs(startPoint, endPoint);
  let cornerPairOne = cornerPairs[0];
  let cornerPairTwo = cornerPairs[1];

  let shapeOne = track.formatShape(newPoints, cornerPairOne);
  let shapeTwo = track.formatShape(newPoints, cornerPairTwo);

  let shapeOneArea = Util.getArea(...shapeOne);
  let shapeTwoArea = Util.getArea(...shapeTwo);
  deleteSmallerHalfFromTrack(
    track,
    shapeOneArea,
    shapeTwoArea,
    startPoint,
    endPoint,
    cornerPairOne,
    cornerPairTwo
  );
};

module.exports = {
  updateTrackWhereNewCaptureStartsAndEndsOnEdge: (
    track,
    startPoint,
    endPoint,
    newPoints
  ) => {
    if (track.areOnSameEdge(startPoint, endPoint)) {
      deleteOldTrack(startPoint, endPoint, track);
    } else if (!track.oppositeEdges(startPoint, endPoint)) {
      updateTrackWhereCaptureIsOnIntersectingEdges(track, startPoint, endPoint);
    } else {
      updateTrackWhereCaptureIsOnOppositeEdges(
        track,
        startPoint,
        endPoint,
        newPoints
      );
    }
  },
};
