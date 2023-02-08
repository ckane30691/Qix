module.exports = {
  addCapturePointsToTrack: (newPoints, track) => {
    newPoints.forEach((point) => {
      track.track[point] = true;
    });
  },
};
