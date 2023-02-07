const { moveSlides } = require("./slide_show");
const { handleMute } = require("./handle_mute");
const { createGame } = require("./create_game");
const { disableSpaceBarScroll } = require("./disable_spacebar_scroll");
module.exports = {
  attachEventListeners: () => {
    const modal = document.getElementById("aboutModal");
    const openBtn = document.getElementsByClassName("openBtn")[0];
    const closeBtn = document.getElementsByClassName("closeBtn")[0];
    const prevBtn = document.getElementsByClassName("prev")[0];
    const nextBtn = document.getElementsByClassName("next")[0];
    const startBtn = document.getElementsByClassName("start-button")[0];
    const muteBtn = document.getElementsByClassName("mute")[0];

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
