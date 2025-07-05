/*
  Optimized Particle System for Pranay Gajbhiye Portfolio
  Purpose: Performance-optimized 3D particle effects with device detection
  Features: Adaptive quality, throttled animations, WebGL fallbacks
  Version: 3.0
  Project: Personal Portfolio
  Last Modified: July 5, 2025
  Usage: Auto-adjusts quality based on device performance
*/

class AdvancedParticleSystem {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = [];
    this.neuralNetwork = null;
    this.quantumField = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.theme = 'dark';
    this.performance = this.detectPerformance();
    this.frameCount = 0;
    this.lastTime = 0;
    this.init();
  }

  detectPerformance() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const hasWebGL = !!window.WebGLRenderingContext;

    if (isMobile || isLowEnd || !hasWebGL) {
      return 'low';
    } else if (navigator.hardwareConcurrency >= 8) {
      return 'high';
    }
    return 'medium';
  }

  init() {
    this.setupThreeJS();
    this.createParticles();
    if (this.performance !== 'low') {
      this.createNeuralNetwork();
      this.createQuantumField();
    }
    this.bindEvents();
    this.animate();
  }

  setupThreeJS() {
    // Scene setup
    this.scene = new THREE.Scene();
    if (this.performance === 'high') {
      this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
    }

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 500;

    // Renderer setup with performance optimization
    const rendererOptions = {
      alpha: true,
      antialias: this.performance === 'high',
      powerPreference: this.performance === 'low' ? 'low-power' : 'high-performance'
    };

    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.performance === 'low' ? 1 : Math.min(window.devicePixelRatio, 2));

    const container = document.getElementById('particles-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }
  }

  createParticles() {
    // Adaptive particle count based on performance
    const particleCounts = {
      low: 200,
      medium: 500,
      high: 800
    };
    const particleCount = particleCounts[this.performance];

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Define neon colors
    const neonColors = [
      new THREE.Color(0x00ffff), // cyan
      new THREE.Color(0xff0080), // pink
      new THREE.Color(0x39ff14), // green
      new THREE.Color(0xbf00ff), // purple
      new THREE.Color(0xff6600), // orange
      new THREE.Color(0xffff00)  // yellow
    ];

    for (let i = 0; i < particleCount; i++) {
      // Position - reduced range for better performance
      positions[i * 3] = (Math.random() - 0.5) * 1500;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;

      // Color
      const color = neonColors[Math.floor(Math.random() * neonColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Size - reduced for better performance
      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;

        void main() {
          vColor = color;

          vec3 pos = position;
          pos.x += sin(time * 0.001 + position.y * 0.01) * 10.0;
          pos.y += cos(time * 0.001 + position.x * 0.01) * 10.0;
          pos.z += sin(time * 0.001 + position.x * 0.005) * 5.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);

          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createNeuralNetwork() {
    // Adaptive node count based on performance
    const nodeCounts = {
      low: 15,
      medium: 30,
      high: 50
    };
    const nodeCount = nodeCounts[this.performance];
    const nodes = [];
    const connections = [];

    // Create nodes with performance-based geometry
    const nodeGeometry = this.performance === 'low'
      ? new THREE.SphereGeometry(2, 6, 6)
      : new THREE.SphereGeometry(2, 8, 8);

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(
        nodeGeometry,
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
          transparent: true,
          opacity: 0.7
        })
      );

      node.position.set(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 400
      );

      nodes.push(node);
      this.scene.add(node);
    }

    // Create connections with reduced complexity
    const connectionProbability = this.performance === 'low' ? 0.05 : 0.1;
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < connectionProbability) {
          const geometry = new THREE.BufferGeometry();
          const positions = new Float32Array(6);

          positions[0] = nodes[i].position.x;
          positions[1] = nodes[i].position.y;
          positions[2] = nodes[i].position.z;
          positions[3] = nodes[j].position.x;
          positions[4] = nodes[j].position.y;
          positions[5] = nodes[j].position.z;

          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

          const material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.2
          });

          const line = new THREE.Line(geometry, material);
          connections.push(line);
          this.scene.add(line);
        }
      }
    }

    this.neuralNetwork = { nodes, connections };
  }

  createQuantumField() {
    // Simplified quantum field based on performance
    const fieldSizes = {
      low: { width: 1000, height: 1000, segments: 20 },
      medium: { width: 1500, height: 1500, segments: 50 },
      high: { width: 2000, height: 2000, segments: 100 }
    };

    const fieldSize = fieldSizes[this.performance];
    const fieldGeometry = new THREE.PlaneGeometry(
      fieldSize.width,
      fieldSize.height,
      fieldSize.segments,
      fieldSize.segments
    );

    if (this.performance === 'low') {
      // Simple material for low-end devices
      const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.05,
        wireframe: true
      });

      this.quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    } else {
      // Shader material for medium/high performance
      const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            vUv = uv;

            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time * 0.001) *
                             cos(pos.y * 0.01 + time * 0.001) * 15.0;
            pos.z += elevation;
            vElevation = elevation;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float strength = vElevation * 0.08;
            vec3 color = mix(
              vec3(0.0, 1.0, 1.0),
              vec3(1.0, 0.0, 0.5),
              strength
            );

            gl_FragColor = vec4(color, 0.08);
          }
        `,
        transparent: true,
        wireframe: true
      });

      this.quantumField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    }

    this.quantumField.rotation.x = -Math.PI / 2;
    this.quantumField.position.y = -200;
    this.scene.add(this.quantumField);
  }

  bindEvents() {
    // Throttled mouse movement for better performance
    let mouseThrottleTimer = null;
    window.addEventListener('mousemove', (event) => {
      if (mouseThrottleTimer) return;

      mouseThrottleTimer = setTimeout(() => {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        mouseThrottleTimer = null;
      }, this.performance === 'low' ? 50 : 16); // Throttle based on performance
    });

    // Debounced resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    });

    // Mouse interaction with particles (only for medium/high performance)
    if (this.performance !== 'low') {
      window.addEventListener('click', (event) => {
        this.createExplosion(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );
      });
    }
  }

  createExplosion(x, y) {
    const explosionCount = 20;
    for (let i = 0; i < explosionCount; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(1, 4, 4),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 1, 0.7),
          transparent: true,
          opacity: 1
        })
      );

      particle.position.set(
        x * 500,
        y * 300,
        0
      );

      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );

      this.scene.add(particle);

      // Animate explosion particles
      const animateExplosion = () => {
        particle.position.add(particle.velocity);
        particle.velocity.multiplyScalar(0.98);
        particle.material.opacity -= 0.02;

        if (particle.material.opacity <= 0) {
          this.scene.remove(particle);
        } else {
          requestAnimationFrame(animateExplosion);
        }
      };
      animateExplosion();
    }
  }

  updateTheme(theme) {
    this.theme = theme;

    if (theme === 'light') {
      this.scene.fog = new THREE.Fog(0xffffff, 1, 1000);
      this.particles.material.uniforms.opacity = { value: 0.3 };
    } else {
      this.scene.fog = new THREE.Fog(0x000000, 1, 1000);
      this.particles.material.uniforms.opacity = { value: 0.8 };
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Frame skipping for low-end devices
    this.frameCount++;
    const currentTime = performance.now();

    if (this.performance === 'low' && this.frameCount % 2 !== 0) {
      return; // Skip every other frame for low-end devices
    }

    // Throttle expensive operations
    const shouldUpdateComplex = this.frameCount % 3 === 0;
    const time = currentTime * 0.001; // Use performance.now for better precision

    // Update particle system
    if (this.particles && this.particles.material.uniforms) {
      this.particles.material.uniforms.time.value = time;
    }

    // Update quantum field (only for medium/high performance)
    if (this.quantumField && this.quantumField.material.uniforms && this.performance !== 'low') {
      this.quantumField.material.uniforms.time.value = time;
    }

    // Smooth particle rotation with reduced intensity
    if (this.particles) {
      const rotationSpeed = this.performance === 'low' ? 0.02 : 0.05;
      this.particles.rotation.x += (this.mouseY * 0.005 - this.particles.rotation.x) * rotationSpeed;
      this.particles.rotation.y += (this.mouseX * 0.005 - this.particles.rotation.y) * rotationSpeed;
    }

    // Animate neural network (throttled for performance)
    if (this.neuralNetwork && shouldUpdateComplex && this.performance !== 'low') {
      this.neuralNetwork.nodes.forEach((node, index) => {
        node.position.y += Math.sin(time + index) * 0.3;
        if (this.performance === 'high') {
          node.material.color.setHSL((time * 0.1 + index * 0.1) % 1, 1, 0.5);
        }
      });

      this.neuralNetwork.connections.forEach((connection, index) => {
        connection.material.opacity = 0.1 + Math.sin(time * 2 + index) * 0.15;
      });
    }

    // Smooth camera movement with performance-based intensity
    const cameraSpeed = this.performance === 'low' ? 0.02 : 0.05;
    const cameraRange = this.performance === 'low' ? 25 : 50;
    this.camera.position.x += (this.mouseX * cameraRange - this.camera.position.x) * cameraSpeed;
    this.camera.position.y += (-this.mouseY * cameraRange - this.camera.position.y) * cameraSpeed;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
    this.lastTime = currentTime;
  }

  destroy() {
    if (this.renderer) {
      this.renderer.dispose();
      const container = document.getElementById('particles-container');
      if (container && this.renderer.domElement) {
        container.removeChild(this.renderer.domElement);
      }
    }
  }
}

// Fallback 2D Particle System for devices without WebGL support
class FallbackParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
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
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    const container = document.getElementById('particles-container');
    if (container) {
      container.appendChild(this.canvas);
    }
  }

  createParticles() {
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  bindEvents() {
    window.addEventListener('mousemove', (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
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

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      // Mouse attraction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary checking
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Draw particle
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  updateTheme(theme) {
    // Update particle colors based on theme
    this.particles.forEach(particle => {
      if (theme === 'light') {
        particle.opacity = 0.3;
      } else {
        particle.opacity = 0.8;
      }
    });
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Main Particle System Class
class ParticleSystem {
  constructor() {
    this.system = null;
    this.init();
  }

  init() {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (gl && typeof THREE !== 'undefined') {
      this.system = new AdvancedParticleSystem();
    } else {
      this.system = new FallbackParticleSystem();
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

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
} else {
  window.ParticleSystem = ParticleSystem;
}
