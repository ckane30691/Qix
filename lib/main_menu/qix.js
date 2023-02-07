const { setUpSlideShow } = require("./slide_show");
const { attachEventListeners } = require("./attach_event_listeners");

document.addEventListener("DOMContentLoaded", () => {
  attachEventListeners();
  setUpSlideShow();
});
