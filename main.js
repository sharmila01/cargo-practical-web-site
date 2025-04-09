document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initializeStatsCounter();
  initializeTestimonialSlider();
  initializeServicesSection();
  initializeMobileNavigation();
  initializeAnimations();
});

/**
 * Stats Counter Section
 * Animates the counting of stats when they come into view
 */
function initializeStatsCounter() {
  const counterElements = document.querySelectorAll(".stats-item__number");

  if (!counterElements.length) return;

  // Function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to animate counting
  function animateCounters() {
    counterElements.forEach((counter) => {
      const statsItem = counter.closest(".stats-item");

      if (
        isElementInViewport(counter) &&
        !statsItem.classList.contains("animate")
      ) {
        statsItem.classList.add("animate");

        const target = parseInt(counter.getAttribute("data-count"));
        const duration = 2000; // 2 seconds
        const stepTime = 50; // Update every 50ms
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          counter.innerText = Math.floor(current);

          if (current >= target) {
            counter.innerText = target;
            clearInterval(timer);
          }
        }, stepTime);
      }
    });
  }

  // Initial check
  animateCounters();

  // Check on scroll
  window.addEventListener("scroll", animateCounters);
}

/**
 * Testimonial Slider
 * Handles navigation, auto-rotation, and touch events for testimonials
 */
function initializeTestimonialSlider() {
  const testimonialSlider = document.querySelector(".testimonial-section");
  if (!testimonialSlider) return;

  const testimonials = document.querySelectorAll(".testimonial-card");
  const paginationDots = document.querySelectorAll(".testimonial-nav__dot");
  const prevButton = document.querySelector(".testimonial-nav__button--prev");
  const nextButton = document.querySelector(".testimonial-nav__button--next");

  let currentSlide = 0;
  let rotationInterval;
  const totalSlides = testimonials.length;

  // Function to show specific slide
  function showSlide(index) {
    // Hide all testimonials
    testimonials.forEach((testimonial) => {
      testimonial.style.display = "none";
    });

    // Update pagination dots
    if (paginationDots.length) {
      paginationDots.forEach((dot) =>
        dot.classList.remove("testimonial-nav__dot--active")
      );
      if (paginationDots[index]) {
        paginationDots[index].classList.add("testimonial-nav__dot--active");
      }
    }

    // Show the current testimonial
    if (testimonials[index]) {
      testimonials[index].style.display = "block";
      // Optional: Add fade-in animation
      testimonials[index].classList.add("testimonial-card--active");
    }

    currentSlide = index;
  }

  // Function to go to next slide
  function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= totalSlides) {
      nextIndex = 0;
    }
    showSlide(nextIndex);
  }

  // Function to go to previous slide
  function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) {
      prevIndex = totalSlides - 1;
    }
    showSlide(prevIndex);
  }

  // Set up auto-rotation
  function startAutoRotation() {
    rotationInterval = setInterval(nextSlide, 5000);
  }

  // Add click event to pagination dots
  if (paginationDots.length) {
    paginationDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        clearInterval(rotationInterval);
        showSlide(index);
        startAutoRotation();
      });
    });
  }

  // Add click events to prev/next buttons
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      clearInterval(rotationInterval);
      prevSlide();
      startAutoRotation();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      clearInterval(rotationInterval);
      nextSlide();
      startAutoRotation();
    });
  }

  // Set up touch events for mobile swiping
  let touchStartX = 0;
  let touchEndX = 0;

  testimonialSlider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  testimonialSlider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - show next slide
      clearInterval(rotationInterval);
      nextSlide();
      startAutoRotation();
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - show previous slide
      clearInterval(rotationInterval);
      prevSlide();
      startAutoRotation();
    }
  }

  // Initialize the first slide and start rotation
  showSlide(0);
  startAutoRotation();

  // Pause rotation on hover
  testimonialSlider.addEventListener("mouseenter", () =>
    clearInterval(rotationInterval)
  );
  testimonialSlider.addEventListener("mouseleave", startAutoRotation);
}
