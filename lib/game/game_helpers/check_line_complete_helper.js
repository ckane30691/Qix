module.exports = {
  checkLineCompleteHelper: (game) => {
    if (game.shipLines.length < 1) return;
    // debugger;
    let startsOnCapture;
    let startOfDrawnLinePos = game.shipLines[0].startPos;
    if (!game.allowedTrack.isOnEdge(startOfDrawnLinePos)) {
      startsOnCapture = true;
    }
    let allPoints = game.getAllPoints();
    let endOfDrawnLinePos = game.shipLines.slice(-1)[0].endPos;
    // console.log(endOfDrawnLinePos);
    let length = game.captures.length;
    for (let i = 0; i < length; i++) {
      let capture = game.captures[i];
      if (capture.intersects(endOfDrawnLinePos)) {
        let vertices = game.getVertices();
        let capturePoints = capture.allPoints;
        let captureStartPoints = null;
        if (startsOnCapture) {
          for (let j = 0; j < game.captures.length; j++) {
            let capture = game.captures[j];
            if (capture.intersects(startOfDrawnLinePos)) {
              captureStartPoints = capture.allPoints;
            }
          }
        }
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
        game.allowedTrack.updateTrack(allPoints);
        return;
      }
    }
    if (
      game.ships[0].canDraw &&
      game.shipLines.length > 5 &&
      game.allowedTrack.isOnEdge(endOfDrawnLinePos)
    ) {
      let captureStartPoints = null;
      if (startsOnCapture) {
        for (let i = 0; i < game.captures.length; i++) {
          let capture = game.captures[i];
          if (capture.intersects(startOfDrawnLinePos)) {
            captureStartPoints = capture.allPoints;
          }
        }
      }
      let vertices = game.getVertices();
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
      game.allowedTrack.updateTrack(allPoints);
    }
  },
};
