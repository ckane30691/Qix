module.exports = {
  handleMute: (e) => {
    let theme = document.getElementsByClassName("theme")[0];
    let captureSound = document.getElementsByClassName("capture-sound")[0];
    let impactSound = document.getElementsByClassName("impact-sound")[0];
    let deathSound = document.getElementsByClassName("death-sound")[0];

    deathSound.muted = deathSound.muted ? false : true;
    impactSound.muted = impactSound.muted ? false : true;
    theme.muted = theme.muted ? false : true;
    captureSound.muted = captureSound.muted ? false : true;
    e.target.className =
      e.target.className === "mute true" ? "mute" : "mute true";
  },
};
