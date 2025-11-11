// Posters Carousel for Our Work Page
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('postersCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('posterIndicators');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const slides = carousel.querySelectorAll('.poster-slide');
    let currentIndex = 0;
    
    // Create indicators
    slides.forEach((slide, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'poster-indicator';
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = indicatorsContainer.querySelectorAll('.poster-indicator');
    
    // Set first slide as active
    updateActiveSlide();
    
    function updateActiveSlide() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Scroll to active slide
        const slideWidth = slides[currentIndex].offsetWidth;
        const gap = parseFloat(getComputedStyle(carousel).gap) || 0;
        const scrollPosition = currentIndex * (slideWidth + gap);
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateActiveSlide();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateActiveSlide();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateActiveSlide();
    }
    
    // Button event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.our-work-page')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Auto-scroll on window resize to maintain position
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateActiveSlide();
        }, 250);
    });
});

