class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.addShip();
  }

  bindKeyHandlers() {
    const ship = this.ship;

    Object.keys(GameView.MOVES).forEach((k) => {
      let move = GameView.MOVES[k];
      key(k, () => { ship.power(move, k); });
    });

    key("space", () => { 
      if (ship.isDrawing) {
        null 
      } else {
        if (ship.canDraw === true) {
          ship.canDraw = false          
          ship.color = '#f71b3c'
        } else {
          ship.canDraw = true;
          ship.color = '#00f6fd'
        }

      }
    });
  }

  // https://stackoverflow.com/questions/4288759/asynchronous-for-cycle-in-javascript
  asyncLoop(o){
    var loop = function(){
      o.functionToLoop(loop);
    }
    loop();//init
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    const that = this;
    this.asyncLoop({
    length : 1000,
    functionToLoop : function(loop, i){
        setTimeout(function(){
            that.ship.drawLine();
            loop();
        },1);
    },
    callback : function(){

    }
});


    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;

    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  }
}

GameView.MOVES = {
  "w": [ 0, -2],
  "a": [-2,  0],
  "s": [ 0,  2],
  "d": [ 2,  0],
};

module.exports = GameView;
