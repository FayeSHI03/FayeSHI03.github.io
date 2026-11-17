document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const previousButton = carousel.querySelector('.carousel-prev');
  const nextButton = carousel.querySelector('.carousel-next');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const autoplayDelay = Number.parseInt(carousel.dataset.autoplay, 10);
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let pointerStartX = null;
  let autoplayTimer = null;

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
    dot.addEventListener('click', () => {
      showSlide(index);
      restartAutoplay();
    });
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

  function stopAutoplay() {
    if (autoplayTimer === null) return;
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (!Number.isFinite(autoplayDelay) || autoplayDelay < 1000) return;
    if (document.hidden || reducedMotionQuery.matches) return;
    autoplayTimer = window.setInterval(showNext, autoplayDelay);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  previousButton.addEventListener('click', () => {
    showPrevious();
    restartAutoplay();
  });
  nextButton.addEventListener('click', () => {
    showNext();
    restartAutoplay();
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
      restartAutoplay();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
      restartAutoplay();
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
    restartAutoplay();
  });

  carousel.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  carousel.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showNext();
    restartAutoplay();
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      if (!carousel.contains(document.activeElement)) startAutoplay();
    });
  });

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAutoplay() : startAutoplay();
  });

  reducedMotionQuery.addEventListener('change', () => {
    reducedMotionQuery.matches ? stopAutoplay() : startAutoplay();
  });

  showSlide(0);
  startAutoplay();
});
