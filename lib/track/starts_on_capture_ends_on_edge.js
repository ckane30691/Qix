module.exports = {
  startsOnCaptureAndEndsOnEdge: (track, startPoint, endPoint) => {
    return !track.isOnEdge(startPoint) && track.isOnEdge(endPoint);
  },
};
