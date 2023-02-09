const {
  addStartingCapturePositionsToCurrentCapture,
} = require("./add_starting_capture_points_to_existing_capture");

module.exports = {
  addCaptureEndingOnCapture: (
    startsOnCapture,
    capture,
    game,
    startOfDrawnLinePos,
    endOfDrawnLinePos,
    allDrawnPoints
  ) => {
    let vertices = game.getVertices();
    let capturePoints = capture.allDrawnPoints;
    console.log("Capture Points", capturePoints);
    console.log("All Drawn Points", allDrawnPoints);
    const captureStartPoints = addStartingCapturePositionsToCurrentCapture(
      startsOnCapture,
      game,
      startOfDrawnLinePos
    );

    const CAPTURE_OPTIONS = {
      game,
      startPos: startOfDrawnLinePos,
      endPos: endOfDrawnLinePos,
      stacked: true,
      vertices,
      capturePoints,
      captureStartPoints,
    };
    game.addCapture(CAPTURE_OPTIONS);
    game.completeLine();
    game.allowedTrack.updateTrack(allDrawnPoints, capturePoints);
  },
};
