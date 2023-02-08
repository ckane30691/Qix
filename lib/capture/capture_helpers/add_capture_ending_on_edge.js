const {
  addStartingCapturePositionsToCurrentCapture,
} = require("./add_starting_capture_points_to_existing_capture");

module.exports = {
  addCaptureEndingOnEdge: (
    startsOnCapture,
    game,
    startOfDrawnLinePos,
    endOfDrawnLinePos,
    allDrawnPoints
  ) => {
    let vertices = game.getVertices();
    const captureStartPoints = addStartingCapturePositionsToCurrentCapture(
      startsOnCapture,
      game,
      startOfDrawnLinePos
    );

    const CAPTURE_OPTIONS = {
      game,
      startPos: startOfDrawnLinePos,
      endPos: endOfDrawnLinePos,
      stacked: false,
      vertices,
      capturePoints: null,
      captureStartPoints,
    };

    game.addCapture(CAPTURE_OPTIONS);
    game.completeLine();
    game.allowedTrack.updateTrack(allDrawnPoints);
  },
};
