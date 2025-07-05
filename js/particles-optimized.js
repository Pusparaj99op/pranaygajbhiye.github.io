/*
  Performance Optimized Particle System
  Purpose: Lightweight 3D effects with smooth performance
  Features: Reduced particle count, optimized rendering, smooth animations
  Version: 3.0 - Performance Edition
  Project: Personal Portfolio
  Last Modified: July 5, 2025
  Usage: Optimized for smooth performance across all devices
*/

class OptimizedParticleSystem {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.mouse = { x: 0, y: 0 };
    this.frameCount = 0;
    this.isLowPerformance = this.detectLowPerformance();
    this.particleCount = this.getOptimalParticleCount();
    this.init();
  }

  detectLowPerformance() {
    // Simple performance detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return true;

    const renderer = gl.getParameter(gl.RENDERER) || '';
    const vendor = gl.getParameter(gl.VENDOR) || '';

    // Check for mobile/low-end devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = renderer.includes('Mali') || renderer.includes('Adreno') ||
                     renderer.includes('PowerVR') || vendor.includes('Qualcomm');

    return isMobile || isLowEnd || window.innerWidth < 1024;
  }

  getOptimalParticleCount() {
    if (this.isLowPerformance) return 50;
    if (window.innerWidth < 1200) return 100;
    return 200; // Reduced from 1000 for better performance
  }

  init() {
    this.setupScene();
    this.createOptimizedParticles();
    this.bindEvents();
    this.animate();
  }

  setupScene() {
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.z = 100;

    // Optimized renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !this.isLowPerformance, // Disable antialiasing on low-end devices
      powerPreference: 'high-performance',
      stencil: false,
      depth: false
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio

    const container = document.getElementById('particles-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  createOptimizedParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount * 3);

    // Optimized color palette
    const colors_palette = [
      { r: 0, g: 1, b: 1 },     // cyan
      { r: 1, g: 0, b: 0.5 },   // pink
      { r: 0.5, g: 1, b: 0 },   // green
      { r: 0.7, g: 0, b: 1 }    // purple
    ];

    for (let i = 0; i < this.particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

      // Velocity
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      // Color
      const color = colors_palette[Math.floor(Math.random() * colors_palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Optimized material
    const material = new THREE.PointsMaterial({
      size: this.isLowPerformance ? 1 : 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    // Throttled mouse movement
    let mouseTimeout;
    window.addEventListener('mousemove', (event) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }, 16); // 60fps throttle
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.frameCount++;

    // Skip frames on low-performance devices
    if (this.isLowPerformance && this.frameCount % 2 !== 0) {
      return;
    }

    // Smooth particle movement
    const positions = this.particles.geometry.attributes.position.array;
    const velocities = this.particles.geometry.attributes.velocity.array;

    for (let i = 0; i < this.particleCount; i++) {
      // Update positions with velocity
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Boundary wrapping
      if (Math.abs(positions[i * 3]) > 100) velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 100) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 100) velocities[i * 3 + 2] *= -1;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    // Smooth rotation
    this.particles.rotation.x += (this.mouse.y * 0.01 - this.particles.rotation.x) * 0.02;
    this.particles.rotation.y += (this.mouse.x * 0.01 - this.particles.rotation.y) * 0.02;

    this.renderer.render(this.scene, this.camera);
  }

  updateTheme(theme) {
    const colors = this.particles.geometry.attributes.color.array;
    const factor = theme === 'light' ? 0.3 : 1.0;

    for (let i = 0; i < colors.length; i++) {
      colors[i] = Math.min(colors[i] * factor, 1.0);
    }

    this.particles.geometry.attributes.color.needsUpdate = true;
    this.particles.material.opacity = theme === 'light' ? 0.4 : 0.8;
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      this.particles.geometry.dispose();
      this.particles.material.dispose();

      const container = document.getElementById('particles-container');
      if (container && this.renderer.domElement) {
        container.removeChild(this.renderer.domElement);
      }
    }
  }
}

// Lightweight 2D Fallback
class LightweightParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.frameCount = 0;
    this.particleCount = 30; // Very light
    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.resize();

    const container = document.getElementById('particles-container');
    if (container) {
      container.appendChild(this.canvas);
    }
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1,
        hue: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.frameCount++;

    // 30fps for smooth performance
    if (this.frameCount % 2 !== 0) return;

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary wrapping
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = `hsl(${particle.hue}, 100%, 50%)`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  updateTheme(theme) {
    this.particles.forEach(particle => {
      particle.opacity = theme === 'light' ? 0.2 : 0.6;
    });
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Main Performance-Optimized Particle System
class ParticleSystem {
  constructor() {
    this.system = null;
    this.init();
  }

  init() {
    // More aggressive performance detection
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = window.innerWidth < 1024 || window.navigator.hardwareConcurrency < 4;
    const hasWebGL = this.hasWebGLSupport();

    if (hasWebGL && !isMobile && !isLowEnd && typeof THREE !== 'undefined') {
      this.system = new OptimizedParticleSystem();
    } else {
      this.system = new LightweightParticleSystem();
    }
  }

  hasWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  updateTheme(theme) {
    if (this.system && this.system.updateTheme) {
      this.system.updateTheme(theme);
    }
  }

  destroy() {
    if (this.system && this.system.destroy) {
      this.system.destroy();
    }
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
} else {
  window.ParticleSystem = ParticleSystem;
}
