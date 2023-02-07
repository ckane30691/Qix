const Game = require("../game/game");
const GameView = require("../game/game_view");
const canvasEl = document.getElementsByTagName("canvas")[0];
canvasEl.width = Game.DIM_X;
canvasEl.height = Game.DIM_Y;

module.exports = {
  createGame: (e) => {
    e.target.className += " hidden";
    //   let theme = document.getElementsByClassName("theme")[0];
    // theme.play()
    const ctx = canvasEl.getContext("2d");
    window.ctx = ctx;
    const game = new Game();
    new GameView(game, ctx).start();
  },
};
