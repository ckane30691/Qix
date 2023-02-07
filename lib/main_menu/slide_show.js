const slideIndex = 1;

const showSlides = (n) => {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
};

module.exports = {
  setUpSlideShow: () => {
    showSlides(slideIndex);
  },
  moveSlides: (n) => {
    module.exports.showSlides((slideIndex += n));
  },
};
