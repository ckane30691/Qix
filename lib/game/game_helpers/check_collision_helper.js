const Track = require("../../track");

module.exports = {
  checkCollisionHelper: (game) => {
    const allObjects = game.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      if (allObjects[i] instanceof Track) continue;
      for (let j = 0; j < allObjects.length; j++) {
        if (allObjects[j] instanceof Track) continue;
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision) {
            let deathSound = document.getElementsByClassName("death-sound")[0];
            deathSound.play();
            return;
          }
        }
      }
    }
  },
};
