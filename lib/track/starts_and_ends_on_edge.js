module.exports = {
  startsAndEndsOnEdge: (track, startPoint, endPoint) => {
    return track.isOnEdge(startPoint) && track.isOnEdge(endPoint);
  },
};
