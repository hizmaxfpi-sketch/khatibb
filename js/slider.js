/**
 * Hero Slider functionality for Al-Khatib Logistics
 * Automatic carousel with manual controls
 */

class HeroSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.dots = document.querySelectorAll('.slider-dot');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }

    init() {
        // Set initial state
        this.showSlide(0);
        
        // Start autoplay
        this.startAutoPlay();
        
        // Event listeners
        this.setupEventListeners();
        
        // Pause autoplay on hover
        this.setupHoverPause();
    }

    setupEventListeners() {
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });

        // Arrow navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.prevSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowLeft') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });

        // Touch/swipe support for mobile
        this.setupTouchSupport();
    }

    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const sliderContainer = document.querySelector('.hero-slider');
        
        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                this.nextSlide();
            } else {
                // Swipe right - previous slide
                this.prevSlide();
            }
            this.resetAutoPlay();
        }
    }

    setupHoverPause() {
        const sliderContainer = document.querySelector('.hero-slider');
        
        sliderContainer.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        sliderContainer.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach((slide, i) => {
            slide.style.opacity = '0';
            slide.style.pointerEvents = 'none';
        });

        // Update dots
        this.dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.remove('bg-white/30');
                dot.classList.add('bg-white/50');
            } else {
                dot.classList.remove('bg-white/50');
                dot.classList.add('bg-white/30');
            }
        });

        // Show current slide with fade effect
        setTimeout(() => {
            this.slides[index].style.opacity = '1';
            this.slides[index].style.pointerEvents = 'auto';
        }, 50);

        this.currentSlide = index;
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    // Public method to destroy slider (if needed)
    destroy() {
        this.stopAutoPlay();
        // Remove event listeners if needed
    }
}

// Initialize slider when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if slider elements exist
    if (document.querySelector('.hero-slide')) {
        window.heroSlider = new HeroSlider();
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (window.heroSlider) {
        if (document.hidden) {
            window.heroSlider.stopAutoPlay();
        } else {
            window.heroSlider.startAutoPlay();
        }
    }
});
