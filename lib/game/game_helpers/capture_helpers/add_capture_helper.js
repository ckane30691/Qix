const Capture = require("../../../capture");
module.exports = {
  addCaptureHelper: ({
    game,
    startPos,
    endPos,
    stacked,
    vertices,
    capturePoints,
    captureStartPoints,
  }) => {
    let allPoints = game.getAllPoints();
    const capture = new Capture({
      startPos: startPos,
      endPos: endPos,
      stacked: stacked,
      vertices: vertices,
      color: "#00f6fd",
      game: game,
      allPoints: allPoints,
      capturePoints: capturePoints,
      captureStartPoints: captureStartPoints,
      track: game.allowedTrack,
    });
    game.add(capture);
    let captureSound = document.getElementsByClassName("capture-sound")[0];
    // game.deleteOutDatedTrack(startPos, endPos);
    // game.allowedTrack.updateTrack(allPoints);
    captureSound.play();
  },
};
