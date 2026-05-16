/* ============================================
   PORTFOLIO — script.js
   Premium vanilla JS interactions
   ============================================ */

(function () {
  'use strict';

  // ============================================
  // LOADER
  // ============================================
  const loader = document.getElementById('loader');
  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      triggerHeroReveal();
    }, 2000);
  });

  function triggerHeroReveal() {
    const heroEls = document.querySelectorAll('#hero .reveal-up');
    heroEls.forEach((el, i) => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
    });
    animateCounters();
  }

  // ============================================
  // CURSOR
  // ============================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let rafId;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      rafId = requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover state
    const hoverTargets = document.querySelectorAll('a, button, .skill-badge, .project-card, input, textarea, .social-link, .magnetic');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  // ============================================
  // MAGNETIC BUTTONS
  // ============================================
  const magneticEls = document.querySelectorAll('.magnetic');

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const strength = 0.25;
      el.style.transform = `translate(${distX * strength}px, ${distY * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });

  // ============================================
  // SCROLL PROGRESS
  // ============================================
  const scrollBar = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    scrollBar.style.width = pct + '%';
  }

  // ============================================
  // NAVBAR
  // ============================================
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ============================================
  // BACK TO TOP
  // ============================================
  const backToTop = document.getElementById('back-to-top');

  function updateBackToTop() {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // SCROLL EVENTS
  // ============================================
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
    updateBackToTop();
  }, { passive: true });

  // ============================================
  // INTERSECTION OBSERVER — Reveal animations
  // ============================================
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => {
    // Skip hero elements — handled by triggerHeroReveal()
    if (!el.closest('#hero')) {
      revealObserver.observe(el);
    }
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1800;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  // ============================================
  // PARTICLE CANVAS
  // ============================================
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let W, H;

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    class Particle {
      constructor() { this.reset(true); }

      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : Math.random() * -50;
        this.size = Math.random() * 1.2 + 0.3;
        this.speedY = Math.random() * 0.4 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 400 + 200;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life++;

        const lifePct = this.life / this.maxLife;
        if (lifePct < 0.1) this.opacity = lifePct * 5 * (Math.random() * 0.4 + 0.2);
        else if (lifePct > 0.8) this.opacity *= 0.99;

        if (this.y > H + 10 || this.life > this.maxLife) this.reset();
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#00d9ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particles = Array.from({ length: 80 }, () => new Particle());
    }

    function drawConnections() {
      const maxDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.08;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#00d9ff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrame = requestAnimationFrame(loop);
    }

    initParticles();
    loop();
  }

  // ============================================
  // HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-primary');
      const originalContent = btn.innerHTML;

      btn.innerHTML = `<span>Sending...</span>`;
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.style.opacity = '';
        btn.style.pointerEvents = '';
        form.reset();
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }, 1600);
    });

    // Animated label float
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.closest('.form-group').classList.add('focused');
      });
      input.addEventListener('blur', () => {
        input.closest('.form-group').classList.remove('focused');
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR NAV LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // SKILL BADGE STAGGER
  // ============================================
  const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.skill-badge');
        badges.forEach((badge, i) => {
          badge.style.opacity = '0';
          badge.style.transform = 'translateY(16px)';
          setTimeout(() => {
            badge.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
          }, i * 60);
        });
        badgeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => {
    badgeObserver.observe(cat);
  });

  // ============================================
  // CURSOR GLOW ON HERO
  // ============================================
  const heroSection = document.getElementById('hero');
  const heroGlow = document.querySelector('.hero-glow');

  if (heroSection && heroGlow) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroGlow.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(0,217,255,0.1) 0%, transparent 65%)`;
    });
  }

  // ============================================
  // INITIAL STATE
  // ============================================
  updateNavbar();
  updateBackToTop();
  updateScrollProgress();

})();