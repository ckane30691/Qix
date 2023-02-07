module.exports = {
  checkLineEndsOnCapture: (capture, endOfDrawnLinePos) => {
    return capture.intersects(endOfDrawnLinePos);
  },

  checkLineEndsOnEdge: (game, endOfDrawnLinePos) => {
    let endsOnEdge = false;
    if (
      game.ships[0].canDraw &&
      game.shipLines.length > 5 &&
      game.allowedTrack.isOnEdge(endOfDrawnLinePos)
    ) {
      endsOnEdge = true;
    }
    return endsOnEdge;
  },
};
