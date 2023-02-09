module.exports = {
  startsOnCaptureAndEndsOnCapture: (track, startPoint, endPoint) => {
    return !track.isOnEdge(startPoint) && !track.isOnEdge(endPoint);
  },
};
