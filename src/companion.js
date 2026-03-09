class WebCompanion {
  static totalCompanions = 0;
  static companions = [];
  static MAX_COMPANIONS = 10;
  static PERFORMANCE_METRICS = {
    frameTimes: [],
    lastMetricTime: 0,
    currentFPS: 60
  };

  constructor(options = {}) {
    if (WebCompanion.totalCompanions >= WebCompanion.MAX_COMPANIONS) {
      throw new Error('Maximum number of companions (10) reached');
    }

    this.options = {
      style: 'cat',
      speed: 1,
      size: 80,
      eyeSensitivity: 0.5,
      roamArea: 'viewport',
      moveDuration: 3000,
      pauseDuration: 2000,
      respawnTime: 10000,
      soundEnabled: true,
      ...options
    };

    this.id = Math.random().toString(36).substr(2, 9);
    this.position = { x: 100, y: 100 };
    this.displayPosition = { x: 100, y: 100 };
    this.startPosition = { x: 100, y: 100 };
    this.target = { x: 100, y: 100 };
    this.mousePosition = { x: 0, y: 0 };
    this.targetMousePosition = { x: 0, y: 0 };
    this.isWandering = true;

    this.isMoving = true;
    this.moveStartTime = 0;
    this.pauseStartTime = 0;
    this.progress = 0;

    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.smoothDeltaTime = 16.67;

    this.isAlive = true;
    this.respawnStartTime = 0;

    this.movementMode = 'linear';
    this.controlPoint = { x: 0, y: 0 };

    this.scale = 1;
    this.targetScale = 1;
    this.rotation = 0;
    this.targetRotation = 0;

    WebCompanion.totalCompanions++;
    WebCompanion.companions.push(this);

    this.init();
  }

  init() {
    this.createElement();
    this.setRandomTarget();
    this.bindEvents();
    this.animate(performance.now());
  }

  createElement() {
    this.container = document.createElement('div');
    this.container.className = 'web-companion style-' + this.options.style;
    this.container.style.width = this.options.size + 'px';
    this.container.style.height = this.options.size + 'px';
    this.container.style.pointerEvents = 'auto';
    this.container.style.transition = 'transform 0.1s ease-out, opacity 0.3s ease-out';
    this.container.dataset.id = this.id;

    let innerHTML = '';
    
    if (this.options.style === 'cat') {
      innerHTML = `
        <div class="companion-body">
          <div class="companion-ears">
            <div class="ear ear-left"></div>
            <div class="ear ear-right"></div>
          </div>
          <div class="companion-face">
            <div class="eye eye-left">
              <div class="pupil"></div>
            </div>
            <div class="eye eye-right">
              <div class="pupil"></div>
            </div>
            <div class="nose"></div>
            <div class="mouth"></div>
            <div class="whiskers whiskers-left"></div>
            <div class="whiskers whiskers-right"></div>
          </div>
        </div>
        <div class="burst-particles"></div>
      `;
    } else if (this.options.style === 'pi') {
      innerHTML = `
        <div class="companion-body">
          <div class="companion-face">
            <span class="pi-symbol">π</span>
            <div class="eye eye-left">
              <div class="pupil"></div>
            </div>
            <div class="eye eye-right">
              <div class="pupil"></div>
            </div>
            <div class="sparkle sparkle-1"></div>
            <div class="sparkle sparkle-2"></div>
          </div>
        </div>
        <div class="burst-particles"></div>
      `;
    } else if (this.options.style === 'sigma') {
      innerHTML = `
        <div class="companion-body">
          <div class="companion-face">
            <span class="sigma-symbol">Σ</span>
            <div class="eye eye-left">
              <div class="pupil"></div>
            </div>
            <div class="eye eye-right">
              <div class="pupil"></div>
            </div>
            <div class="glow-ring"></div>
          </div>
        </div>
        <div class="burst-particles"></div>
      `;
    } else if (this.options.style === 'infinity') {
      innerHTML = `
        <div class="companion-body">
          <div class="companion-face">
            <span class="infinity-symbol">∞</span>
            <div class="eye eye-left">
              <div class="pupil"></div>
            </div>
            <div class="eye eye-right">
              <div class="pupil"></div>
            </div>
            <div class="orbit-ring"></div>
          </div>
        </div>
        <div class="burst-particles"></div>
      `;
    }

    this.container.innerHTML = innerHTML;
    document.body.appendChild(this.container);
  }

  bindEvents() {
    this.container.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleClick();
    });

    this.container.addEventListener('mouseenter', () => {
      if (this.isAlive) {
        this.targetScale = 1.1;
        this.container.classList.add('hovering');
      }
    });

    this.container.addEventListener('mouseleave', () => {
      this.targetScale = 1;
      this.container.classList.remove('hovering');
    });

    document.addEventListener('mousemove', (e) => {
      this.targetMousePosition.x = e.clientX;
      this.targetMousePosition.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      this.ensureInBounds();
      this.setRandomTarget();
    });
  }

  handleClick() {
    if (!this.isAlive) return;

    this.isAlive = false;
    this.isWandering = false;

    this.playBurstSound();
    this.showPlusOne();
    this.createBurstParticles();
    this.container.classList.add('bursting');

    setTimeout(() => {
      this.container.style.display = 'none';
    }, 500);

    this.startRespawnCountdown();
  }

  playBurstSound() {
    if (!this.options.soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  showPlusOne() {
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = '+1';
    plusOne.style.left = (this.position.x + this.options.size / 2) + 'px';
    plusOne.style.top = (this.position.y - 20) + 'px';
    document.body.appendChild(plusOne);

    setTimeout(() => {
      if (plusOne.parentNode) {
        plusOne.parentNode.removeChild(plusOne);
      }
    }, 1000);
  }

  createBurstParticles() {
    const particlesContainer = this.container.querySelector('.burst-particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = (i / 12) * Math.PI * 2;
      const distance = 30 + Math.random() * 40;
      particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
      particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
      particle.style.setProperty('--delay', (i * 0.02) + 's');
      particlesContainer.appendChild(particle);
    }
  }

  startRespawnCountdown() {
    this.respawnStartTime = performance.now();
    
    const countdownInterval = setInterval(() => {
      const elapsed = performance.now() - this.respawnStartTime;
      const remaining = Math.max(0, Math.ceil((this.options.respawnTime - elapsed) / 1000));

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        this.respawn();
      } else {
        this.updateCountdownDisplay(remaining);
      }
    }, 100);
  }

  updateCountdownDisplay(seconds) {
    let countdownEl = document.getElementById('respawn-countdown-' + this.id);
    if (!countdownEl) {
      countdownEl = document.createElement('div');
      countdownEl.id = 'respawn-countdown-' + this.id;
      countdownEl.className = 'respawn-countdown';
      countdownEl.style.left = this.position.x + 'px';
      countdownEl.style.top = this.position.y + 'px';
      document.body.appendChild(countdownEl);
    }
    countdownEl.textContent = seconds + 's';
  }

  respawn() {
    const countdownEl = document.getElementById('respawn-countdown-' + this.id);
    if (countdownEl && countdownEl.parentNode) {
      countdownEl.parentNode.removeChild(countdownEl);
    }

    const bounds = this.getBounds();
    this.position.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    this.position.y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

    this.isAlive = true;
    this.isWandering = true;
    this.container.style.display = 'block';
    this.container.classList.remove('bursting');

    const particlesContainer = this.container.querySelector('.burst-particles');
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
    }

    this.setRandomTarget();
  }

  getBounds() {
    const padding = this.options.size / 2;
    return {
      minX: padding,
      maxX: window.innerWidth - padding,
      minY: padding,
      maxY: window.innerHeight - padding
    };
  }

  setRandomTarget() {
    const bounds = this.getBounds();
    
    this.startPosition.x = this.position.x;
    this.startPosition.y = this.position.y;
    this.target.x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
    this.target.y = bounds.minY + Math.random() * (bounds.maxY - bounds.minY);

    this.movementMode = Math.random() > 0.5 ? 'linear' : 'arc';
    
    if (this.movementMode === 'arc') {
      const midX = (this.startPosition.x + this.target.x) / 2;
      const midY = (this.startPosition.y + this.target.y) / 2;
      const offset = (Math.random() - 0.5) * 150;
      this.controlPoint.x = midX + offset;
      this.controlPoint.y = midY + offset;
    }
    
    this.moveStartTime = performance.now();
    this.isMoving = true;
    this.progress = 0;
  }

  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  calculateArcPosition(t) {
    const t2 = t * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    
    const x = mt2 * this.startPosition.x + 2 * mt * t * this.controlPoint.x + t2 * this.target.x;
    const y = mt2 * this.startPosition.y + 2 * mt * t * this.controlPoint.y + t2 * this.target.y;
    
    return { x, y };
  }

  updatePosition() {
    if (!this.isWandering || !this.isAlive) return;

    const now = performance.now();

    if (this.isMoving) {
      const elapsed = now - this.moveStartTime;
      this.progress = Math.min(elapsed / this.options.moveDuration, 1);

      if (this.progress >= 1) {
        this.position.x = this.target.x;
        this.position.y = this.target.y;
        this.isMoving = false;
        this.pauseStartTime = now;
      } else {
        const easedProgress = this.easeInOut(this.progress);
        
        if (this.movementMode === 'linear') {
          this.position.x = this.startPosition.x + (this.target.x - this.startPosition.x) * easedProgress;
          this.position.y = this.startPosition.y + (this.target.y - this.startPosition.y) * easedProgress;
        } else {
          const arcPos = this.calculateArcPosition(easedProgress);
          this.position.x = arcPos.x;
          this.position.y = arcPos.y;
        }
      }
    } else {
      const elapsed = now - this.pauseStartTime;
      if (elapsed >= this.options.pauseDuration) {
        this.setRandomTarget();
      }
    }

    this.ensureInBounds();
    
    const smoothingFactor = Math.min(1, this.smoothDeltaTime / 50);
    this.displayPosition.x += (this.position.x - this.displayPosition.x) * smoothingFactor;
    this.displayPosition.y += (this.position.y - this.displayPosition.y) * smoothingFactor;
    
    this.mousePosition.x += (this.targetMousePosition.x - this.mousePosition.x) * smoothingFactor;
    this.mousePosition.y += (this.targetMousePosition.y - this.mousePosition.y) * smoothingFactor;
    
    this.scale += (this.targetScale - this.scale) * smoothingFactor;
    this.rotation += (this.targetRotation - this.rotation) * smoothingFactor;
    
    this.container.style.transform = `translate(${this.displayPosition.x}px, ${this.displayPosition.y}px) scale(${this.scale}) rotate(${this.rotation}deg)`;
    this.container.style.left = '0px';
    this.container.style.top = '0px';
    
    this.updateEyes();
  }

  ensureInBounds() {
    const bounds = this.getBounds();
    this.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.position.x));
    this.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, this.position.y));
  }

  updateEyes() {
    if (!this.container || !this.isAlive) return;
    
    const eyes = this.container.querySelectorAll('.pupil');
    const companionCenterX = this.position.x + this.options.size / 2;
    const companionCenterY = this.position.y + this.options.size / 2;

    const dx = this.mousePosition.x - companionCenterX;
    const dy = this.mousePosition.y - companionCenterY;
    const angle = Math.atan2(dy, dx);
    const maxDistance = 4;

    const pupilX = Math.cos(angle) * maxDistance * this.options.eyeSensitivity;
    const pupilY = Math.sin(angle) * maxDistance * this.options.eyeSensitivity;

    eyes.forEach(pupil => {
      pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
  }

  animate(currentTime) {
    this.deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    const alpha = 0.1;
    this.smoothDeltaTime = this.smoothDeltaTime * (1 - alpha) + this.deltaTime * alpha;
    
    this.updatePosition();
    this.updatePerformanceMetrics(currentTime);
    requestAnimationFrame((time) => this.animate(time));
  }

  updatePerformanceMetrics(currentTime) {
    if (WebCompanion.companions[0] !== this) return;
    
    const metrics = WebCompanion.PERFORMANCE_METRICS;
    metrics.frameTimes.push(currentTime);
    
    while (metrics.frameTimes.length > 0 && currentTime - metrics.frameTimes[0] > 1000) {
      metrics.frameTimes.shift();
    }
    
    if (currentTime - metrics.lastMetricTime >= 500) {
      metrics.currentFPS = metrics.frameTimes.length;
      metrics.lastMetricTime = currentTime;
    }
  }

  static getPerformanceMetrics() {
    return {
      fps: WebCompanion.PERFORMANCE_METRICS.currentFPS,
      companionCount: WebCompanion.totalCompanions
    };
  }

  destroy() {
    const index = WebCompanion.companions.indexOf(this);
    if (index > -1) {
      WebCompanion.companions.splice(index, 1);
      WebCompanion.totalCompanions--;
    }

    const countdownEl = document.getElementById('respawn-countdown-' + this.id);
    if (countdownEl && countdownEl.parentNode) {
      countdownEl.parentNode.removeChild(countdownEl);
    }

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }

  static getTotalCount() {
    return WebCompanion.totalCompanions;
  }

  static canAddCompanion() {
    return WebCompanion.totalCompanions < WebCompanion.MAX_COMPANIONS;
  }

  static getMaxCount() {
    return WebCompanion.MAX_COMPANIONS;
  }

  static destroyAll() {
    [...WebCompanion.companions].forEach(companion => {
      companion.destroy();
    });
  }
}

window.WebCompanion = WebCompanion;

window.initWebCompanion = function(options) {
  return new WebCompanion(options);
};
