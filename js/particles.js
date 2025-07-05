/*
  Particle System for Pranay Gajbhiye Portfolio
  Purpose: Interactive particle background with 3D effects and performance optimization
  Features: WebGL particles, mouse interaction, responsive design, theme integration
  Version: 1.0
  Project: Personal Portfolio
  Last Modified: July 5, 2025
  Usage: Creates animated particle background with Three.js
*/

class ParticleSystem {
  constructor() {
    this.container = document.getElementById('particles-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.mouse = { x: 0, y: 0 };
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.particleCount = this.getParticleCount();
    this.connectionDistance = 150;
    this.isPlaying = true;

    this.init();
  }

  getParticleCount() {
    // Adjust particle count based on device performance
    const width = window.innerWidth;
    if (width < 768) return 50;
    if (width < 1200) return 100;
    return 150;
  }

  init() {
    if (!this.container || !window.THREE) {
      console.warn('Three.js not loaded or container not found');
      return;
    }

    this.setupScene();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  setupScene() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    this.camera.position.z = 1000;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Enable shadows for more realistic effects
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  createParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount * 3);

    // Create particle positions, colors, and velocities
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Positions
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i3 + 2] = (Math.random() - 0.5) * 1000;

      // Colors (theme-aware)
      const color = this.getParticleColor();
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Velocities
      velocities[i3] = (Math.random() - 0.5) * 2;
      velocities[i3 + 1] = (Math.random() - 0.5) * 2;
      velocities[i3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    // Particle material
    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    // Create particle system
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    // Create connections between particles
    this.createConnections();
  }

  getParticleColor() {
    const theme = document.body.className.includes('light-theme') ? 'light' : 'dark';

    if (theme === 'dark') {
      // Cyan-ish colors for dark theme
      return {
        r: 0.4 + Math.random() * 0.6,
        g: 0.8 + Math.random() * 0.2,
        b: 0.9 + Math.random() * 0.1
      };
    } else {
      // Purple-ish colors for light theme
      return {
        r: 0.4 + Math.random() * 0.4,
        g: 0.2 + Math.random() * 0.3,
        b: 0.8 + Math.random() * 0.2
      };
    }
  }

  createConnections() {
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });

    this.connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    this.scene.add(this.connections);
  }

  updateConnections() {
    const positions = this.particles.geometry.attributes.position.array;
    const connectionPositions = [];

    // Check distances between particles and create connections
    for (let i = 0; i < this.particleCount; i++) {
      for (let j = i + 1; j < this.particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < this.connectionDistance) {
          connectionPositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }

    this.connections.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(connectionPositions, 3)
    );
  }

  setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX - this.windowHalfX) * 2;
      this.mouse.y = (event.clientY - this.windowHalfY) * 2;
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });

    // Visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
      this.isPlaying = !document.hidden;
    });

    // Theme change
    const observer = new MutationObserver(() => {
      this.updateThemeColors();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  updateThemeColors() {
    if (!this.particles) return;

    const colors = this.particles.geometry.attributes.color.array;

    for (let i = 0; i < this.particleCount; i++) {
      const color = this.getParticleColor();
      const i3 = i * 3;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    this.particles.geometry.attributes.color.needsUpdate = true;

    // Update connection color
    const theme = document.body.className.includes('light-theme') ? 'light' : 'dark';
    this.connections.material.color.setHex(theme === 'dark' ? 0x64ffda : 0x6366f1);
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    if (!this.isPlaying) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    this.updateParticles();
    this.updateConnections();
    this.render();

    requestAnimationFrame(() => this.animate());
  }

  updateParticles() {
    if (!this.particles) return;

    const positions = this.particles.geometry.attributes.position.array;
    const velocities = this.particles.geometry.attributes.velocity.array;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Apply velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Mouse interaction
      const dx = this.mouse.x - positions[i3];
      const dy = this.mouse.y - positions[i3 + 1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        const force = (200 - distance) / 200;
        velocities[i3] += dx * force * 0.001;
        velocities[i3 + 1] += dy * force * 0.001;
      }

      // Apply damping
      velocities[i3] *= 0.99;
      velocities[i3 + 1] *= 0.99;
      velocities[i3 + 2] *= 0.99;

      // Boundary conditions
      if (positions[i3] < -1000 || positions[i3] > 1000) {
        velocities[i3] *= -0.5;
      }
      if (positions[i3 + 1] < -1000 || positions[i3 + 1] > 1000) {
        velocities[i3 + 1] *= -0.5;
      }
      if (positions[i3 + 2] < -500 || positions[i3 + 2] > 500) {
        velocities[i3 + 2] *= -0.5;
      }

      // Wrap around
      if (positions[i3] > 1000) positions[i3] = -1000;
      if (positions[i3] < -1000) positions[i3] = 1000;
      if (positions[i3 + 1] > 1000) positions[i3 + 1] = -1000;
      if (positions[i3 + 1] < -1000) positions[i3 + 1] = 1000;
    }

    this.particles.geometry.attributes.position.needsUpdate = true;

    // Rotate particle system slightly
    this.particles.rotation.y += 0.001;
  }

  render() {
    // Camera movement based on mouse
    this.camera.position.x += (this.mouse.x * 0.0005 - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouse.y * 0.0005 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  // Performance optimization
  setQuality(quality) {
    switch (quality) {
      case 'low':
        this.particleCount = 30;
        this.connectionDistance = 100;
        this.renderer.setPixelRatio(1);
        break;
      case 'medium':
        this.particleCount = 75;
        this.connectionDistance = 125;
        this.renderer.setPixelRatio(1.5);
        break;
      case 'high':
        this.particleCount = 150;
        this.connectionDistance = 150;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        break;
    }

    // Recreate particles with new count
    this.scene.remove(this.particles);
    this.scene.remove(this.connections);
    this.createParticles();
  }

  // Cleanup method
  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      this.container.removeChild(this.renderer.domElement);
    }

    if (this.particles) {
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }

    if (this.connections) {
      this.connections.geometry.dispose();
      this.connections.material.dispose();
    }
  }
}

// Performance monitor for particle system
class ParticlePerformanceMonitor {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.currentFPS = 60;
    this.init();
  }

  init() {
    this.monitorPerformance();
  }

  monitorPerformance() {
    const monitor = () => {
      this.frameCount++;
      const currentTime = performance.now();

      if (currentTime - this.lastTime >= 1000) {
        this.currentFPS = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));

        // Adjust quality based on FPS
        if (this.currentFPS < 30) {
          this.particleSystem.setQuality('low');
        } else if (this.currentFPS < 45) {
          this.particleSystem.setQuality('medium');
        } else {
          this.particleSystem.setQuality('high');
        }

        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && window.THREE) {
    const particleSystem = new ParticleSystem();
    const performanceMonitor = new ParticlePerformanceMonitor(particleSystem);

    // Store reference for cleanup
    window.portfolioParticles = {
      system: particleSystem,
      monitor: performanceMonitor
    };
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.portfolioParticles) {
    window.portfolioParticles.system.destroy();
  }
});
