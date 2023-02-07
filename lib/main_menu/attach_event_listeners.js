const { moveSlides } = require("./slide_show");
const { handleMute } = require("./handle_mute");
const { createGame } = require("./create_game");
const { disableSpaceBarScroll } = require("./disable_spacebar_scroll");
module.exports = {
  attachEventListeners: () => {
    let modal = document.getElementById("aboutModal");
    let openBtn = document.getElementsByClassName("openBtn")[0];
    let closeBtn = document.getElementsByClassName("closeBtn")[0];
    let prevBtn = document.getElementsByClassName("prev")[0];
    let nextBtn = document.getElementsByClassName("next")[0];
    let startBtn = document.getElementsByClassName("start-button")[0];
    let muteBtn = document.getElementsByClassName("mute")[0];

    openBtn.onclick = () => {
      modal.style.display = "block";
    };

    closeBtn.onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };

    prevBtn.onclick = () => moveSlides(-1);
    nextBtn.onclick = () => moveSlides(1);

    muteBtn.onclick = (e) => {
      handleMute(e);
    };

    startBtn.onclick = (e) => {
      createGame(e);
    };

    window.onkeydown = (e) => {
      disableSpaceBarScroll(e);
    };
  },
};
