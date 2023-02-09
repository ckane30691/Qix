module.exports = {
  startsOnEdgeAndEndsOnCapture: (track, startPoint, endPoint) => {
    return track.isOnEdge(startPoint) && !track.isOnEdge(endPoint);
  },
};
