module.exports = {
  checkLineStartsOnCapture: (game, startOfDrawnLinePos) => {
    let startsOnCapture = false;
    if (!game.allowedTrack.isOnEdge(startOfDrawnLinePos)) {
      startsOnCapture = true;
    }
    return startsOnCapture;
  },
};
