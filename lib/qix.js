const Game = require("./game");
const GameView = require("./game_view");

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  let modal = document.getElementById('aboutModal');
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

  const showSlides = (n) => {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1};
    if (n < 1) {slideIndex = slides.length};
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
  };

  let slideIndex = 1;
  showSlides(slideIndex);

  const plusSlides = (n) => {
    showSlides(slideIndex += n);
  };

  const currentSlide = (n) => {
    showSlides(slideIndex = n);
  };


  prevBtn.onclick = () => plusSlides(-1);
  nextBtn.onclick = () => plusSlides(1);

  //disable space-bar scrolling
  window.onkeydown = (e) => {
  if (e.keyCode === 32 && e.target === document.body) {
    e.preventDefault();
  }
};

muteBtn.onclick = () => {
  let theme = document.getElementsByClassName("theme")[0];
  let captureSound = document.getElementsByClassName("capture-sound")[0];
  let impactSound = document.getElementsByClassName("impact-sound")[0];
  let deathSound = document.getElementsByClassName("death-sound")[0];

  deathSound.muted = deathSound.muted ? false : true;
  impactSound.muted = impactSound.muted ? false : true;
  theme.muted = theme.muted ? false : true;
  captureSound.muted = captureSound.muted ? false : true;
  muteBtn.className = muteBtn.className === "mute true" ? "mute" : "mute true";
};

startBtn.onclick = () => {
  startBtn.className += " hidden";
  let theme = document.getElementsByClassName("theme")[0];
  // theme.play()
  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  new GameView(game, ctx).start();
};
});
