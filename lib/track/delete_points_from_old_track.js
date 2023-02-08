const Util = require("../util");
module.exports = {
  deleteOldTrack: (startPoint, endPoint, track) => {
    let currentTrack = Object.keys(track.track);
    for (let i = 0; i < currentTrack.length; i++) {
      let currPoint = Util.formatPoint(currentTrack[i]);
      if (
        Util.isPointOnLine(startPoint, endPoint, currPoint) === true &&
        !Util.areSamePos(startPoint, currPoint) &&
        !Util.areSamePos(endPoint, currPoint)
      ) {
        track.track[currPoint] = false;
      }
    }
  },
};
