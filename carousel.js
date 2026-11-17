document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const previousButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  let activeIndex = 0;
  let pointerStartX = null;

  if (slides.length < 2) {
    carousel.classList.add('is-single');
    slides[0]?.setAttribute('aria-hidden', 'false');
    return;
  }

  carousel.classList.add('has-multiple');

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Show image ${index + 1} of ${slides.length}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
    return dot;
  });

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  const showPrevious = () => showSlide(activeIndex - 1);
  const showNext = () => showSlide(activeIndex + 1);

  previousButton.addEventListener('click', showPrevious);
  nextButton.addEventListener('click', showNext);

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  });

  carousel.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });

  carousel.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const movement = event.clientX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(movement) < 30) return;
    movement < 0 ? showNext() : showPrevious();
  });

  carousel.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  carousel.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showNext();
  });

  showSlide(0);
});
