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

// Main Application
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeApp());
    } else {
      this.initializeApp();
    }
  }

  initializeApp() {
    try {
      // Initialize all managers
      this.themeManager = new ThemeManager();
      this.navigationManager = new NavigationManager();
      this.animationManager = new AnimationManager();
      this.formHandler = new FormHandler();
      this.performanceMonitor = new PerformanceMonitor();
      this.errorHandler = new ErrorHandler();

      // Initialize additional features
      this.initializeTooltips();
      this.initializeAccessibility();

      console.log('Portfolio app initialized successfully');

    } catch (error) {
      console.error('Failed to initialize portfolio app:', error);
    }
  }

  initializeTooltips() {
    // Add tooltips to social links and other interactive elements
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
      });

      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';

    setTimeout(() => tooltip.classList.add('show'), 10);
  }

  hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
      tooltip.classList.remove('show');
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 200);
    }
  }

  initializeAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }
  }
}

// Initialize the application
const app = new PortfolioApp();
