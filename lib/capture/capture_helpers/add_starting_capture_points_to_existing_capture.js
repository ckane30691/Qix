module.exports = {
  addStartingCapturePositionsToCurrentCapture: (
    startsOnCapture,
    game,
    startOfDrawnLinePos
  ) => {
    let captureStartPoints = null;
    if (!startsOnCapture) return captureStartPoints;
    for (let i = 0; i < game.captures.length; i++) {
      let capture = game.captures[i];
      if (capture.intersects(startOfDrawnLinePos)) {
        captureStartPoints = capture.allDrawnPoints;
      }
    }
    console.log(captureStartPoints);
    return captureStartPoints;
  },
};
