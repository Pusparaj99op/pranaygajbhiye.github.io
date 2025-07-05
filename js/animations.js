/*
  Advanced Animations for Pranay Gajbhiye Portfolio
  Purpose: Complex animations, scroll-triggered effects, 3D transformations
  Features: GSAP-like animations, intersection observers, performance optimized
  Version: 1.0
  Project: Personal Portfolio
  Last Modified: July 5, 2025
  Usage: Advanced animation library for portfolio effects
*/

class AdvancedAnimations {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animations = new Map();
    this.observers = new Map();
    this.init();
  }

  init() {
    if (this.isReducedMotion) {
      return; // Skip animations if user prefers reduced motion
    }

    this.setupScrollTriggers();
    this.initHeroAnimations();
    this.initMorphingShapes();
    this.initTextAnimations();
    this.initCursorEffects();
    this.initParallaxElements();
  }

  // Hero Section Animations
  initHeroAnimations() {
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroText) {
      this.animateHeroText();
    }

    if (heroVisual) {
      this.animateFloatingCards();
    }
  }

  animateHeroText() {
    const greeting = document.querySelector('.greeting');
    const name = document.querySelector('.name');
    const subtitle = document.querySelector('.subtitle');
    const description = document.querySelector('.hero-description');
    const buttons = document.querySelector('.hero-buttons');
    const socialLinks = document.querySelector('.social-links');

    const timeline = [
      { element: greeting, delay: 0.2, animation: 'fadeInUp' },
      { element: name, delay: 0.4, animation: 'fadeInUp' },
      { element: subtitle, delay: 0.6, animation: 'fadeInUp' },
      { element: description, delay: 0.8, animation: 'fadeInUp' },
      { element: buttons, delay: 1.0, animation: 'fadeInUp' },
      { element: socialLinks, delay: 1.2, animation: 'fadeInUp' }
    ];

    timeline.forEach(({ element, delay, animation }) => {
      if (element) {
        setTimeout(() => {
          element.classList.add(animation);
        }, delay * 1000);
      }
    });
  }

  animateFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');

    cards.forEach((card, index) => {
      // Initial position animation
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, (index + 1) * 300);

      // Continuous floating animation
      this.createFloatingAnimation(card, index);
    });
  }

  createFloatingAnimation(element, index) {
    const amplitude = 20 + (index * 5);
    const period = 3000 + (index * 500);
    let startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = (elapsed % period) / period;
      const yOffset = Math.sin(progress * Math.PI * 2) * amplitude;

      element.style.transform = `translateY(${yOffset}px)`;

      if (this.animations.has(`floating-${index}`)) {
        requestAnimationFrame(animate);
      }
    };

    this.animations.set(`floating-${index}`, true);
    requestAnimationFrame(animate);
  }

  // Morphing Shapes Animation
  initMorphingShapes() {
    const shapes = document.querySelectorAll('.morphing-shape');

    shapes.forEach(shape => {
      this.createMorphingAnimation(shape);
    });
  }

  createMorphingAnimation(shape) {
    const paths = [
      'M50,50 Q70,20 90,50 Q70,80 50,50 Q30,80 10,50 Q30,20 50,50',
      'M50,50 Q80,30 90,50 Q80,70 50,50 Q20,70 10,50 Q20,30 50,50',
      'M50,50 Q75,25 90,50 Q75,75 50,50 Q25,75 10,50 Q25,25 50,50'
    ];

    let currentPath = 0;
    const svgPath = shape.querySelector('path');

    if (svgPath) {
      setInterval(() => {
        currentPath = (currentPath + 1) % paths.length;
        this.morphPath(svgPath, paths[currentPath]);
      }, 2000);
    }
  }

  morphPath(pathElement, targetPath) {
    const duration = 1000;
    const startTime = performance.now();
    const startPath = pathElement.getAttribute('d');

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = this.easeInOutCubic(progress);

      // Simple path interpolation (for production, use a proper SVG morphing library)
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        pathElement.setAttribute('d', targetPath);
      }
    };

    requestAnimationFrame(animate);
  }

  // Text Animations
  initTextAnimations() {
    this.setupTypingAnimation();
    this.setupTextRevealAnimation();
    this.setupGlitchEffect();
  }

  setupTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-effect');

    typingElements.forEach(element => {
      const text = element.textContent;
      element.textContent = '';
      element.style.borderRight = '2px solid var(--accent-primary)';

      this.typeText(element, text, 100);
    });
  }

  typeText(element, text, speed) {
    let index = 0;

    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        // Blinking cursor effect
        setInterval(() => {
          element.style.borderRightColor =
            element.style.borderRightColor === 'transparent'
              ? 'var(--accent-primary)'
              : 'transparent';
        }, 500);
      }
    };

    type();
  }

  setupTextRevealAnimation() {
    const revealElements = document.querySelectorAll('.text-reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.revealText(entry.target);
        }
      });
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  revealText(element) {
    const text = element.textContent;
    const words = text.split(' ');

    element.innerHTML = words.map(word =>
      `<span class="word-reveal">${word}</span>`
    ).join(' ');

    const wordSpans = element.querySelectorAll('.word-reveal');

    wordSpans.forEach((span, index) => {
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  setupGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');

    glitchElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.startGlitchEffect(element);
      });
    });
  }

  startGlitchEffect(element) {
    const originalText = element.textContent;
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let iteration = 0;

    const glitchInterval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(glitchInterval);
        element.textContent = originalText;
      }

      iteration += 1 / 3;
    }, 30);
  }

  // Cursor Effects
  initCursorEffects() {
    if (window.innerWidth > 768) { // Only on desktop
      this.createCustomCursor();
    }
  }

  createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth cursor following
    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .interactive');

    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      });

      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      });
    });
  }

  // Parallax Effects
  initParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parallax-element');

    if (parallaxElements.length === 0) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;

      parallaxElements.forEach(element => {
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const speed = element.dataset.speed || 0.5;

        // Check if element is in viewport
        if (elementTop < scrolled + windowHeight && elementTop + elementHeight > scrolled) {
          const yPos = -(scrolled - elementTop) * speed;
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 10));
  }

  // Scroll Trigger Setup
  setupScrollTriggers() {
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animationType = entry.target.dataset.animation || 'fadeInUp';
          const delay = entry.target.dataset.delay || 0;

          setTimeout(() => {
            entry.target.classList.add(animationType);
          }, delay);

          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(element => {
      scrollObserver.observe(element);
    });
  }

  // Utility Functions
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Cleanup method
  destroy() {
    this.animations.clear();
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    // Remove custom cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursor) cursor.remove();
    if (cursorDot) cursorDot.remove();
  }
}

// Magnetic Elements Effect
class MagneticElements {
  constructor() {
    this.magneticElements = document.querySelectorAll('.magnetic');
    this.init();
  }

  init() {
    this.magneticElements.forEach(element => {
      this.addMagneticEffect(element);
    });
  }

  addMagneticEffect(element) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const maxDistance = 100;
      const strength = 0.3;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < maxDistance) {
        const factor = (maxDistance - distance) / maxDistance;
        const moveX = deltaX * strength * factor;
        const moveY = deltaY * strength * factor;

        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      }
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  }
}

// Initialize advanced animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const advancedAnimations = new AdvancedAnimations();
  const magneticElements = new MagneticElements();

  // Store references for potential cleanup
  window.portfolioAnimations = {
    advanced: advancedAnimations,
    magnetic: magneticElements
  };
});
