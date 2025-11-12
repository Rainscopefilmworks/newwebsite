// Posters Carousel for Our Work Page
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('postersCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('posterIndicators');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    // Cache DOM elements
    const carouselWrapper = carousel.parentElement;
    let slides = Array.from(carousel.querySelectorAll('.poster-slide'));
    const realSlidesCount = slides.length;
    let currentIndex = 1; // Start at first real slide (index 0 is clone of last)
    let isTransitioning = false;
    let allowTransition = true;
    
    // Cache style calculations
    let cachedPaddingLeft = 0;
    let cachedGap = 0;
    let updatePending = false;
    let rafId = null;
    
    // Clone slides for infinite loop
    if (slides.length > 0) {
        // Clone last slide and prepend
        const lastSlide = slides[slides.length - 1];
        const lastClone = lastSlide.cloneNode(true);
        lastClone.classList.remove('active');
        // Clone nodes preserve img src, just ensure loading is eager
        const lastCloneImages = lastClone.querySelectorAll('img');
        lastCloneImages.forEach(img => {
            img.loading = 'eager';
            img.setAttribute('loading', 'eager');
        });
        carousel.insertBefore(lastClone, slides[0]);
        
        // Clone first slide and append
        const firstSlide = slides[0];
        const firstClone = firstSlide.cloneNode(true);
        firstClone.classList.remove('active');
        const firstCloneImages = firstClone.querySelectorAll('img');
        firstCloneImages.forEach(img => {
            img.loading = 'eager';
            img.setAttribute('loading', 'eager');
        });
        carousel.appendChild(firstClone);
        
        // Update slides array
        slides = Array.from(carousel.querySelectorAll('.poster-slide'));
    }
    
    // Cache computed styles once
    function cacheStyles() {
        const carouselStyles = getComputedStyle(carousel);
        cachedPaddingLeft = parseFloat(carouselStyles.paddingLeft) || 0;
        const gapStr = carouselStyles.gap || carouselStyles.columnGap || '0px';
        cachedGap = parseFloat(gapStr) || 0;
    }
    
    // Initial style cache
    cacheStyles();
    
    // Prevent scrolling (optimized - only prevent wheel, scroll is handled by CSS overflow)
    carousel.addEventListener('wheel', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    // Lock scroll position once
    carousel.scrollLeft = 0;
    carousel.scrollTop = 0;
    
    // Create indicators (only for real slides)
    for (let i = 0; i < realSlidesCount; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'poster-indicator';
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToRealSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
    
    const indicators = indicatorsContainer.querySelectorAll('.poster-indicator');
    
    // Debounced update function
    function scheduleUpdate(skipTransition = false) {
        if (updatePending) return;
        updatePending = true;
        
        if (rafId) cancelAnimationFrame(rafId);
        
        rafId = requestAnimationFrame(() => {
            updateActiveSlide(skipTransition);
            updatePending = false;
            rafId = null;
        });
    }
    
    // Initial update - wait for images to load
    setTimeout(() => {
        scheduleUpdate();
    }, 100);
    
    function updateActiveSlide(skipTransition = false) {
        // Ensure slides array is current
        slides = Array.from(carousel.querySelectorAll('.poster-slide'));
        
        // Validate current index
        if (currentIndex < 0 || currentIndex >= slides.length) {
            currentIndex = Math.max(0, Math.min(currentIndex, slides.length - 1));
        }
        
        const activeSlide = slides[currentIndex];
        if (!activeSlide) return;
        
        // Batch DOM updates
        const realIndex = getRealSlideIndex(currentIndex);
        
        // Update active classes in one pass
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.classList.toggle('active', isActive);
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === realIndex);
        });
        
        // Calculate position - ensure all images are measured
        if (!carouselWrapper) return;
        
        // Temporarily disable transition for instant jump
        if (skipTransition) {
            carousel.style.transition = 'none';
        } else {
            carousel.style.transition = '';
        }
        
        // Force layout recalculation for all slides to ensure they're measured
        slides.forEach(slide => {
            void slide.offsetWidth;
            const img = slide.querySelector('img');
            if (img) {
                void img.offsetWidth;
            }
        });
        
        const wrapperWidth = carouselWrapper.offsetWidth;
        const wrapperCenter = wrapperWidth / 2;
        
        // Calculate position using cached styles
        let totalOffset = cachedPaddingLeft;
        
        // Sum up widths of slides before active one
        for (let i = 0; i < currentIndex; i++) {
            const slide = slides[i];
            if (slide) {
                let slideWidth = slide.offsetWidth;
                
                // If width is invalid, calculate from image
                if (!slideWidth || slideWidth < 50) {
                    const img = slide.querySelector('img');
                    if (img && (img.naturalWidth > 0 || img.offsetWidth > 0)) {
                        const imgWidth = img.naturalWidth || img.offsetWidth;
                        const slideStyle = getComputedStyle(slide);
                        const paddingLeft = parseFloat(slideStyle.paddingLeft) || 0;
                        const paddingRight = parseFloat(slideStyle.paddingRight) || 0;
                        slideWidth = imgWidth + paddingLeft + paddingRight;
                    }
                }
                
                // Use fallback if still invalid
                if (!slideWidth || slideWidth < 50) {
                    slideWidth = Math.min(400, window.innerWidth * 0.75);
                }
                
                totalOffset += slideWidth + cachedGap;
            }
        }
        
        // Get active slide width
        let activeSlideWidth = activeSlide.offsetWidth;
        
        // If width is invalid, calculate from image
        if (!activeSlideWidth || activeSlideWidth < 50) {
            const img = activeSlide.querySelector('img');
            if (img && (img.naturalWidth > 0 || img.offsetWidth > 0)) {
                const imgWidth = img.naturalWidth || img.offsetWidth;
                const slideStyle = getComputedStyle(activeSlide);
                const paddingLeft = parseFloat(slideStyle.paddingLeft) || 0;
                const paddingRight = parseFloat(slideStyle.paddingRight) || 0;
                activeSlideWidth = imgWidth + paddingLeft + paddingRight;
            }
        }
        
        // Fallback width
        if (!activeSlideWidth || activeSlideWidth < 50) {
            activeSlideWidth = Math.min(400, window.innerWidth * 0.75);
        }
        
        const activeSlideCenter = totalOffset + activeSlideWidth / 2;
        const offset = wrapperCenter - activeSlideCenter;
        
        // Use translate3d for GPU acceleration
        carousel.style.transform = `translate3d(${offset}px, 0, 0)`;
        
        // Re-enable transition after skip
        if (skipTransition) {
            setTimeout(() => {
                carousel.style.transition = '';
                isTransitioning = false;
                allowTransition = true;
            }, 50);
        }
    }
    
    function getRealSlideIndex(index) {
        // Convert carousel index to real slide index
        if (index === 0) return realSlidesCount - 1; // Last clone -> last real
        if (index === slides.length - 1) return 0; // First clone -> first real
        return index - 1; // Real slides are offset by 1
    }
    
    const TRANSITION_DURATION = 500;
    
    function goToRealSlide(realIndex) {
        if (isTransitioning) return;
        currentIndex = realIndex + 1;
        isTransitioning = true;
        scheduleUpdate();
        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DURATION);
    }
    
    function nextSlide() {
        if (!allowTransition || isTransitioning) return;
        
        currentIndex++;
        isTransitioning = true;
        allowTransition = false;
        scheduleUpdate();
        
        // Handle loop
        if (currentIndex === slides.length - 1) {
            setTimeout(() => {
                currentIndex = 1;
                scheduleUpdate(true);
            }, TRANSITION_DURATION);
        } else {
            setTimeout(() => {
                isTransitioning = false;
                allowTransition = true;
            }, TRANSITION_DURATION);
        }
    }
    
    function prevSlide() {
        if (!allowTransition || isTransitioning) return;
        
        currentIndex--;
        isTransitioning = true;
        allowTransition = false;
        scheduleUpdate();
        
        // Handle loop
        if (currentIndex === 0) {
            setTimeout(() => {
                currentIndex = realSlidesCount;
                scheduleUpdate(true);
            }, TRANSITION_DURATION);
        } else {
            setTimeout(() => {
                isTransitioning = false;
                allowTransition = true;
            }, TRANSITION_DURATION);
        }
    }
    
    // Button event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Optimized keyboard navigation
    const isOurWorkPage = document.querySelector('.our-work-page');
    if (isOurWorkPage) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }, { passive: true });
    }
    
    // Touch/swipe support (prevent default scrolling, allow swipe gestures)
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    
    // Optimized touch handling
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(Date.now() - touchStartTime);
    }, { passive: true });
    
    function handleSwipe(duration = 0) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        const minSwipeSpeed = 300; // ms - ignore slow drags
        
        // Only trigger swipe if movement is significant and fast enough
        if (Math.abs(diff) > swipeThreshold && duration < minSwipeSpeed) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Debounced resize handler
    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        cacheStyles(); // Re-cache styles on resize
        resizeTimeout = setTimeout(() => {
            scheduleUpdate();
        }, 150);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Optimized resize observer - only observe wrapper
    const resizeObserver = new ResizeObserver((entries) => {
        // Only update if wrapper size changed significantly
        for (const entry of entries) {
            if (entry.target === carouselWrapper) {
                cacheStyles();
                scheduleUpdate();
                break;
            }
        }
    });
    
    resizeObserver.observe(carouselWrapper);
    
    // Ensure all images load and are visible
    function ensureAllImagesVisible() {
        const allImages = carousel.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = allImages.length;
        
        if (totalImages === 0) return;
        
        allImages.forEach((img) => {
            // Force eager loading
            img.loading = 'eager';
            img.setAttribute('loading', 'eager');
            
            // Ensure visibility
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '';
            
            // Ensure src is correct
            const srcAttr = img.getAttribute('src');
            if (srcAttr && (!img.src || img.src !== srcAttr)) {
                img.src = srcAttr;
            }
            
            // Track loaded images
            if (img.complete && img.naturalWidth > 0) {
                loadedCount++;
            } else {
                // Wait for image to load
                const onLoad = () => {
                    loadedCount++;
                    // Update carousel when all images are loaded
                    if (loadedCount === totalImages) {
                        scheduleUpdate();
                    }
                };
                img.addEventListener('load', onLoad, { once: true });
                img.addEventListener('error', () => {
                    console.warn('Image failed to load:', img.src);
                    onLoad(); // Count as loaded to continue
                }, { once: true });
            }
        });
        
        // If all images are already loaded
        if (loadedCount === totalImages) {
            scheduleUpdate();
        }
    }
    
    // Initialize image loading
    ensureAllImagesVisible();
    
    // Also update after images have time to load
    setTimeout(() => {
        ensureAllImagesVisible();
        scheduleUpdate();
    }, 500);
    
    // Auto-scroll functionality
    let autoScrollInterval;
    const autoScrollDelay = 4000; // 4 seconds
    
    function startAutoScroll() {
        stopAutoScroll(); // Clear any existing interval
        autoScrollInterval = setInterval(() => {
            nextSlide();
        }, autoScrollDelay);
    }
    
    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
    }
    
    // Start auto-scroll
    startAutoScroll();
    
    // Pause auto-scroll on hover/interaction
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    
    // Pause auto-scroll on touch
    carousel.addEventListener('touchstart', stopAutoScroll, { passive: true });
    
    let autoScrollRestartTimeout;
    carousel.addEventListener('touchend', () => {
        clearTimeout(autoScrollRestartTimeout);
        autoScrollRestartTimeout = setTimeout(startAutoScroll, 1000);
    }, { passive: true });
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
    });
});

