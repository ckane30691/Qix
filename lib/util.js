const Util = {
  // Normalize the length of the vector to 1, maintaining direction.
  dir(vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },

  direction(vel) {
    if (vel[0] > 0 && vel[1] === 0) {
      return "right";
    } else if (vel[0] === 0 && vel[1] < 0) {
      return "up";
    } else if (vel[0] < 0 && vel[1] === 0) {
      return "left";
    } else {
      return "down";
    }
  },
  // Find distance between two points.
  dist(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },
  // https://www.mathopenref.com/coordpolygonarea2.html
  getArea(X, Y, numPoints) {
    let area = 0; // Accumulates area in the loop
    let j = numPoints - 1; // The last vertex is the 'previous' one to the first
    for (let i = 0; i < numPoints; i++) {
      area = area + (X[j] + X[i]) * (Y[j] - Y[i]);
      j = i; //j is previous vertex to i
      debugger;
    }
    debugger;
    return area / 2;
  },

  areSamePos(pos1, pos2) {
    if (pos1[0] === pos2[0] && pos1[1] === pos2[1]) return true;
    return false;
  },
  formatPoint(strPoint) {
    if (typeof strPoint !== "string") throw `you done goofed ${strPoint}`;
    strPoint = strPoint.split(",");
    return [Number(strPoint[0]), Number(strPoint[1])];
  },
  isPointOnLine(startOfline, endOfLine, pointToCheck) {
    if (
      Util.dist(startOfline, pointToCheck) +
        Util.dist(endOfLine, pointToCheck) ==
      Util.dist(startOfline, endOfLine)
    )
      return true; // pointToCheck is on the line.
    // debugger;
    return false;
  },
  intersects(startPoint, endPoint, pointToCheck) {},
  // Find the length of the vector.
  norm(vec) {
    return Util.dist([0, 0], vec);
  },
  // Return a randomly oriented vector with the given length.
  randomVec(length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
  randomColor() {
    const hexDigits = "0123456789ABCDEF";

    let color = "#";
    for (let i = 0; i < 3; i++) {
      color += hexDigits[Math.floor(Math.random() * 16)];
    }

    return color;
  },
};

module.exports = Util;
