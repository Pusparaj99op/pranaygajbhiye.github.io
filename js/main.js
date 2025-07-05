/*
  Main JavaScript for Pranay Gajbhiye Portfolio
  Purpose: Core functionality, theme toggle, smooth scrolling, animations
  Features: Theme management, scroll effects, mobile navigation, form handling
  Version: 1.0
  Project: Personal Portfolio
  Last Modified: July 5, 2025
  Usage: Main script file, handles all interactive elements
*/

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
  }

  setTheme(theme) {
    document.body.className = `${theme}-theme`;
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.updateThemeIcon();
  }

  updateThemeIcon() {
    const icon = this.themeToggle.querySelector('i');
    if (this.currentTheme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  bindEvents() {
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section');
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Smooth scrolling for navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });

    // Mobile menu toggle
    this.mobileMenu.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Scroll event for navbar styling and active link highlighting
    window.addEventListener('scroll', () => {
      this.handleScroll();
      this.highlightActiveSection();
    });
  }

  toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
    this.mobileMenu.classList.toggle('active');
  }

  handleScroll() {
    const scrolled = window.pageYOffset;

    // Add scrolled class to navbar
    if (scrolled > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  highlightActiveSection() {
    const scrollPos = window.pageYOffset + 150;

    this.sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all nav links
        this.navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to current section's nav link
        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.animateSkillBars();
    this.initCounterAnimations();
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');

          // Trigger skill bar animations when skills section is visible
          if (entry.target.id === 'skills') {
            this.animateSkillBars();
          }

          // Trigger counter animations when about section is visible
          if (entry.target.id === 'about') {
            this.animateCounters();
          }
        }
      });
    }, this.observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(
      'section, .about-card, .skill-category, .project-card, .contact-card'
    );

    elementsToAnimate.forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, 500);
    });
  }

  initCounterAnimations() {
    this.counters = document.querySelectorAll('.stat-number');
  }

  animateCounters() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const increment = target / 50;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        const suffix = counter.textContent.replace(/\d/g, '');
        counter.textContent = Math.floor(current) + suffix;
      }, 50);
    });
  }
}

// Form Handler
class FormHandler {
  constructor() {
    this.contactForm = document.querySelector('.contact-form');
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Add floating label effect
    const formInputs = this.contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('focused');
        }
      });
    });
  }

  async handleSubmit() {
    const formData = new FormData(this.contactForm);
    const button = this.contactForm.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;

    // Show loading state
    button.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;

    try {
      // Simulate form submission (replace with actual endpoint)
      await this.simulateSubmission();

      // Show success message
      this.showMessage('Message sent successfully!', 'success');
      this.contactForm.reset();

    } catch (error) {
      this.showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      // Reset button
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  simulateSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  showMessage(message, type) {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Utility Functions
class Utils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
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

  static lerp(start, end, factor) {
    return start + (end - start) * factor;
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    // Preload critical resources
    this.preloadImages();

    // Optimize scroll performance
    this.optimizeScroll();

    // Monitor performance
    this.monitorPerformance();
  }

  preloadImages() {
    const imageUrls = [
      // Add any critical images that need preloading
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  optimizeScroll() {
    // Use passive listeners for better scroll performance
    window.addEventListener('scroll',
      Utils.throttle(() => {
        // Scroll-based animations and effects
        this.handleScrollEffects();
      }, 16),
      { passive: true }
    );
  }

  handleScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-bg');
    if (heroBackground) {
      heroBackground.style.transform = `translateY(${rate}px)`;
    }

    // Update floating elements position
    const floatingElements = document.querySelectorAll('.floating-card');
    floatingElements.forEach((element, index) => {
      const speed = 0.1 + (index * 0.05);
      const yPos = scrolled * speed;
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  monitorPerformance() {
    // Monitor frame rate
    let lastTime = performance.now();
    let frameCount = 0;

    const checkPerformance = (currentTime) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Reduce animations if performance is poor
        if (fps < 30) {
          document.body.classList.add('reduce-animations');
        } else {
          document.body.classList.remove('reduce-animations');
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(checkPerformance);
    };

    requestAnimationFrame(checkPerformance);
  }
}

// Error Handler
class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript error:', e.error);
      this.handleError(e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.handleError(e.reason);
    });
  }

  handleError(error) {
    // Log error for debugging
    console.error('Error caught:', error);

    // Optionally send error to monitoring service
    // this.sendErrorToService(error);
  }

  sendErrorToService(error) {
    // Implementation for error reporting service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     message: error.message,
    //     stack: error.stack,
    //     timestamp: new Date().toISOString()
    //   })
    // });
  }
}

// Enhanced Loading Screen
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.progressBar = document.querySelector('.progress-bar');
    this.loadingText = document.querySelector('.loading-text');
    this.init();
  }

  init() {
    this.createLoadingSequence();
  }

  createLoadingSequence() {
    const texts = [
      'INITIALIZING...',
      'LOADING MATRIX...',
      'ESTABLISHING CONNECTION...',
      'PRANAY GAJBHIYE',
      'READY TO LAUNCH'
    ];

    let currentIndex = 0;
    const textInterval = setInterval(() => {
      this.loadingText.textContent = texts[currentIndex];
      this.loadingText.setAttribute('data-text', texts[currentIndex]);
      currentIndex++;

      if (currentIndex >= texts.length) {
        clearInterval(textInterval);
        setTimeout(() => this.hideLoading(), 500);
      }
    }, 600);
  }

  hideLoading() {
    this.loadingScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';

    setTimeout(() => {
      this.loadingScreen.style.display = 'none';
    }, 500);
  }
}

// Enhanced Loading Screen Manager
class LoadingScreenManager {
  constructor() {
    this.loadingScreen = document.getElementById('loading-screen');
    this.progressBar = document.querySelector('.progress-bar');
    this.loadingText = document.querySelector('.loading-text');
    this.matrixRain = document.querySelector('.matrix-rain-effect');
    this.loadingDots = document.querySelectorAll('.loading-dots span');
    this.init();
  }

  init() {
    this.createMatrixRain();
    this.animateLoadingDots();
    this.simulateLoading();
  }

  createMatrixRain() {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

    for (let i = 0; i < 50; i++) {
      const drop = document.createElement('div');
      drop.className = 'matrix-drop';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animationDelay = Math.random() * 2 + 's';
      drop.style.animationDuration = (Math.random() * 3 + 2) + 's';

      let text = '';
      for (let j = 0; j < 10; j++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      drop.textContent = text;

      this.matrixRain.appendChild(drop);
    }
  }

  animateLoadingDots() {
    this.loadingDots.forEach((dot, index) => {
      dot.style.animationDelay = index * 0.3 + 's';
    });
  }

  simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => this.hideLoadingScreen(), 500);
      }
      this.progressBar.style.width = progress + '%';
    }, 200);
  }

  hideLoadingScreen() {
    this.loadingScreen.style.opacity = '0';
    setTimeout(() => {
      this.loadingScreen.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 500);
  }
}

// Enhanced Theme Manager with Particle Integration
class EnhancedThemeManager extends ThemeManager {
  constructor() {
    super();
    this.particleSystem = null;
  }

  setTheme(theme) {
    super.setTheme(theme);
    this.animateThemeTransition();
    this.updateParticles();
  }

  animateThemeTransition() {
    document.body.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: ${this.currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
      z-index: 9999;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition: all 0.5s ease-out;
    `;

    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.style.width = '200vmax';
      ripple.style.height = '200vmax';
    }, 10);

    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 500);
  }

  updateParticles() {
    if (this.particleSystem && this.particleSystem.updateTheme) {
      this.particleSystem.updateTheme(this.currentTheme);
    }
  }

  setParticleSystem(system) {
    this.particleSystem = system;
  }
}

// Advanced 3D Text Effects Manager
class Text3DManager {
  constructor() {
    this.init();
  }

  init() {
    this.enhance3DTexts();
    this.createHologramTexts();
    this.addTextInteractivity();
  }

  enhance3DTexts() {
    const text3DElements = document.querySelectorAll('.text-3d, .text-3d-neon, .text-3d-cyber, .text-3d-holographic');

    text3DElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'perspective(1000px) rotateX(15deg) rotateY(15deg) translateZ(30px)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * 20;
        const rotateY = (x - centerX) / centerX * 20;

        element.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });
    });
  }

  createHologramTexts() {
    const hologramTexts = document.querySelectorAll('.hologram-text');

    hologramTexts.forEach(element => {
      const text = element.getAttribute('data-text') || element.textContent;
      element.setAttribute('data-text', text);

      // Create glitch layers
      for (let i = 0; i < 3; i++) {
        const layer = document.createElement('span');
        layer.textContent = text;
        layer.className = `hologram-layer layer-${i}`;
        layer.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: ${['#ff0080', '#00ffff', '#ffff00'][i]};
          animation: hologram-glitch-${i} 2s infinite;
          opacity: 0.7;
        `;
        element.appendChild(layer);
      }
    });
  }

  addTextInteractivity() {
    const interactiveTexts = document.querySelectorAll('.gradient-holographic, .gradient-cyber, .gradient-neon');

    interactiveTexts.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.animationDuration = '0.5s';
        element.style.filter = 'brightness(1.5) saturate(1.5)';
      });

      element.addEventListener('mouseleave', () => {
        element.style.animationDuration = '';
        element.style.filter = '';
      });
    });
  }
}

// Magnetic Hover Effects Manager
class MagneticHoverManager {
  constructor() {
    this.init();
  }

  init() {
    const magneticElements = document.querySelectorAll('.magnetic-hover');

    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const strength = 0.3;
        const moveX = x * strength;
        const moveY = y * strength;

        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }
}

// Quantum Dots Animation Manager
class QuantumDotsManager {
  constructor() {
    this.dots = document.querySelectorAll('.quantum-dot');
    this.init();
  }

  init() {
    this.dots.forEach((dot, index) => {
      // Random flicker intensity
      dot.style.setProperty('--flicker-intensity', Math.random() * 0.5 + 0.5);

      // Random position changes
      setInterval(() => {
        const newTop = Math.random() * 80 + 10;
        const newLeft = Math.random() * 80 + 10;

        dot.style.transition = 'all 3s ease-in-out';
        dot.style.top = newTop + '%';
        dot.style.left = newLeft + '%';
      }, 5000 + index * 1000);
    });
  }
}

// Data Visualization Manager
class DataVisualizationManager {
  constructor() {
    this.init();
  }

  init() {
    this.animateStatNumbers();
    this.createDataStreams();
  }

  animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const finalValue = parseInt(element.textContent);
          let currentValue = 0;
          const increment = finalValue / 50;
          const duration = 2000;
          const stepTime = duration / 50;

          const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
              currentValue = finalValue;
              clearInterval(counter);
            }
            element.textContent = Math.floor(currentValue) + '+';
          }, stepTime);

          observer.unobserve(element);
        }
      });
    });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  createDataStreams() {
    const dataElements = document.querySelectorAll('.data-visualization');

    dataElements.forEach(element => {
      const stream = document.createElement('div');
      stream.className = 'data-stream';
      stream.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
        animation: data-stream 3s infinite;
      `;
      element.style.position = 'relative';
      element.appendChild(stream);
    });
  }
}

// Custom Animated Cursor Manager
class CustomCursorManager {
  constructor() {
    this.cursor = null;
    this.cursorTrail = [];
    this.init();
  }

  init() {
    this.createCursor();
    this.bindEvents();
  }

  createCursor() {
    // Main cursor
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, var(--neon-cyan), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
    `;
    document.body.appendChild(this.cursor);

    // Cursor trail
    for (let i = 0; i < 10; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.cssText = `
        position: fixed;
        width: ${15 - i}px;
        height: ${15 - i}px;
        background: radial-gradient(circle, var(--neon-purple), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        opacity: ${(10 - i) / 20};
        transition: all 0.1s ease;
      `;
      document.body.appendChild(trail);
      this.cursorTrail.push(trail);
    }
  }

  bindEvents() {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      this.cursor.style.left = mouseX - 10 + 'px';
      this.cursor.style.top = mouseY - 10 + 'px';
    });

    // Animate trail
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.1;
      trailY += (mouseY - trailY) * 0.1;

      this.cursorTrail.forEach((trail, index) => {
        const delay = index * 0.02;
        trail.style.left = trailX - (7.5 - index * 0.5) + 'px';
        trail.style.top = trailY - (7.5 - index * 0.5) + 'px';
      });

      requestAnimationFrame(animateTrail);
    };
    animateTrail();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .interactive-3d, .magnetic-hover');
    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.cursor.style.transform = 'scale(2)';
        this.cursor.style.background = 'radial-gradient(circle, var(--neon-pink), transparent)';
      });

      element.addEventListener('mouseleave', () => {
        this.cursor.style.transform = 'scale(1)';
        this.cursor.style.background = 'radial-gradient(circle, var(--neon-cyan), transparent)';
      });
    });
  }
}

// Main Application
class PortfolioApp {
  constructor() {
    this.themeManager = new EnhancedThemeManager();
    this.navigationManager = new NavigationManager();
    this.loadingManager = new LoadingScreenManager();
    this.text3DManager = new Text3DManager();
    this.magneticHoverManager = new MagneticHoverManager();
    this.quantumDotsManager = new QuantumDotsManager();
    this.dataVisualizationManager = new DataVisualizationManager();
    this.customCursorManager = new CustomCursorManager();
    this.init();
  }

  init() {
    this.initializeParticles();
    this.initializeScrollEffects();
    this.initializeSkillBars();
    this.initializeProjectCards();
    this.initializeContactForm();
    this.addAdvancedInteractions();
  }

  initializeParticles() {
    if (typeof ParticleSystem !== 'undefined') {
      const particleSystem = new ParticleSystem();
      this.themeManager.setParticleSystem(particleSystem);
    }
  }

  initializeScrollEffects() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.holographic-card, .floating-card, .social-link');
    animateElements.forEach(el => observer.observe(el));
  }

  initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector('.skill-fill');
          const percentage = progressBar.getAttribute('data-percentage');

          setTimeout(() => {
            progressBar.style.width = percentage + '%';
          }, 500);

          skillObserver.unobserve(entry.target);
        }
      });
    });

    skillBars.forEach(skill => skillObserver.observe(skill));
  }

  initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-20px) rotateX(10deg) rotateY(5deg) scale(1.05)';
        card.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 50px var(--neon-cyan)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = '';
      });

      // Add click ripple effect
      card.addEventListener('click', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--neon-cyan), transparent);
          transform: translate(-50%, -50%);
          animation: ripple-effect 0.6s ease-out;
          pointer-events: none;
        `;

        card.style.position = 'relative';
        card.appendChild(ripple);

        setTimeout(() => {
          if (card.contains(ripple)) {
            card.removeChild(ripple);
          }
        }, 600);
      });
    });
  }

  initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      const inputs = contactForm.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        // Add focus effects
        input.addEventListener('focus', () => {
          input.style.boxShadow = '0 0 20px var(--neon-cyan)';
          input.style.borderColor = 'var(--neon-cyan)';
        });

        input.addEventListener('blur', () => {
          input.style.boxShadow = '';
          input.style.borderColor = '';
        });

        // Add typing effects
        input.addEventListener('input', () => {
          if (input.value) {
            input.style.color = 'var(--neon-cyan)';
          } else {
            input.style.color = '';
          }
        });
      });

      // Add form submission effects
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.style.background = 'var(--gradient-cyber)';
        submitBtn.disabled = true;

        // Simulate sending
        setTimeout(() => {
          submitBtn.textContent = 'Message Sent!';
          submitBtn.style.background = 'var(--gradient-holographic)';

          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            contactForm.reset();
          }, 2000);
        }, 2000);
      });
    }
  }

  addAdvancedInteractions() {
    // Add parallax effect to background elements
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.cosmic-background');

      parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });

    // Add hover sound effects (visual feedback)
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .social-link');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        // Create visual pulse effect
        const pulse = document.createElement('div');
        pulse.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--neon-cyan), transparent);
          transform: translate(-50%, -50%);
          animation: pulse-effect 0.6s ease-out;
          pointer-events: none;
          z-index: -1;
        `;

        element.style.position = 'relative';
        element.appendChild(pulse);

        setTimeout(() => {
          if (element.contains(pulse)) {
            element.removeChild(pulse);
          }
        }, 600);
      });
    });

    // Add keyboard navigation enhancements
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new PortfolioApp();

  // Add some CSS animations dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-effect {
      0% {
        width: 0;
        height: 0;
        opacity: 1;
      }
      100% {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }

    @keyframes pulse-effect {
      0% {
        width: 0;
        height: 0;
        opacity: 0.8;
      }
      100% {
        width: 100px;
        height: 100px;
        opacity: 0;
      }
    }

    @keyframes hologram-glitch-0 {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-2px); }
      40% { transform: translateX(2px); }
      60% { transform: translateX(-1px); }
      80% { transform: translateX(1px); }
    }

    @keyframes hologram-glitch-1 {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(1px); }
      50% { transform: translateX(-1px); }
      75% { transform: translateX(2px); }
    }

    @keyframes hologram-glitch-2 {
      0%, 100% { transform: translateX(0); }
      30% { transform: translateX(-1px); }
      60% { transform: translateX(1px); }
      90% { transform: translateX(-2px); }
    }

    .matrix-drop {
      position: absolute;
      color: var(--neon-green);
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 14px;
      animation: matrix-rain linear infinite;
      opacity: 0.8;
      text-shadow: 0 0 5px var(--neon-green);
    }

    .animate-in {
      animation: fadeInUp 0.8s ease-out forwards;
    }

    .keyboard-navigation *:focus {
      outline: 2px solid var(--neon-cyan) !important;
      outline-offset: 2px;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg-primary);
    }

    ::-webkit-scrollbar-thumb {
      background: linear-gradient(var(--neon-cyan), var(--neon-purple));
      border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(var(--neon-purple), var(--neon-pink));
    }
  `;
  document.head.appendChild(style);
});

// Global utility functions
window.PortfolioUtils = {
  // Create glitch effect for any element
  createGlitchEffect(element) {
    element.style.position = 'relative';
    element.style.overflow = 'hidden';

    const glitch = document.createElement('div');
    glitch.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent);
      animation: glitch-sweep 2s infinite;
      pointer-events: none;
    `;

    element.appendChild(glitch);
  },

  // Create neon border effect
  createNeonBorder(element, color = 'var(--neon-cyan)') {
    element.style.border = `2px solid ${color}`;
    element.style.boxShadow = `0 0 20px ${color}`;
    element.style.borderRadius = '10px';
  },

  // Generate random cyber text
  generateCyberText(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};
