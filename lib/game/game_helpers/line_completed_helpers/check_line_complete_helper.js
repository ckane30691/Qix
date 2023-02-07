const { checkLineStartsOnCapture } = require("./check_line_starts_on_capture");
const {
  checkLineEndsOnCapture,
  checkLineEndsOnEdge,
} = require("./check_where_line_ends");
const {
  addCaptureEndingOnEdge,
} = require("../capture_helpers/add_capture_ending_on_edge");
const {
  addCaptureEndingOnCapture,
} = require("../capture_helpers/add_capture_ending_on_capture");

module.exports = {
  checkLineCompleteHelper: (game) => {
    if (game.shipLines.length < 1) return;
    let startOfDrawnLinePos = game.shipLines[0].startPos;
    let startsOnCapture = checkLineStartsOnCapture(game, startOfDrawnLinePos);
    let allPoints = game.getAllPoints();
    let endOfDrawnLinePos = game.shipLines.slice(-1)[0].endPos;

    let length = game.captures.length;
    for (let i = 0; i < length; i++) {
      let capture = game.captures[i];
      if (checkLineEndsOnCapture(capture, endOfDrawnLinePos)) {
        addCaptureEndingOnCapture(
          startsOnCapture,
          capture,
          game,
          startOfDrawnLinePos,
          endOfDrawnLinePos,
          allPoints
        );
        return;
      }
    }
    if (checkLineEndsOnEdge(game, endOfDrawnLinePos)) {
      addCaptureEndingOnEdge(
        startsOnCapture,
        game,
        startOfDrawnLinePos,
        endOfDrawnLinePos,
        allPoints
      );
    }
  },
};
