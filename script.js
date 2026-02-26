/* ═══════════════════════════════════════════
   Antik Das Gupta — Portfolio Scripts
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── AOS (Animate On Scroll) INIT ───
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: 'mobile'
    });
  }

  // ─── CURSOR GLOW ───
  const glow = null; // Disabled in premium theme
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animate() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.left = gx + 'px';
      glow.style.top = gy + 'px';
      requestAnimationFrame(animate);
    })();
  } else if (glow) glow.style.display = 'none';

  // ─── NAVBAR SCROLL ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ─── MOBILE NAV ───
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ─── SHOWREEL PLAY/PAUSE ───
  const heroReel = document.getElementById('heroReel');
  const showreelVideo = document.getElementById('showreelVideo');
  const reelOverlay = document.getElementById('reelPlayOverlay');
  if (heroReel && showreelVideo) {
    // Force initial frame to avoid black starting screen
    showreelVideo.addEventListener('loadedmetadata', () => {
      showreelVideo.currentTime = 0.2;
    });

    // Handle play state for the overlay button
    showreelVideo.addEventListener('playing', () => {
      heroReel.classList.add('playing');
    });

    showreelVideo.addEventListener('pause', () => {
      heroReel.classList.remove('playing');
    });

    heroReel.addEventListener('click', () => {
      if (showreelVideo.paused) {
        showreelVideo.play();
      } else {
        showreelVideo.pause();
      }
    });
  }

  // ─── SCROLL REVEAL ───
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        let idx = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 100);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => revealObs.observe(el));

  // ─── PORTFOLIO FILTERS ───
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let delay = 0;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, delay);
          delay += 80;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  cards.forEach(card => {
    const vid = card.querySelector('.card-media video');
    if (vid) {
      vid.currentTime = 0.2; // Set initial frame
      card.addEventListener('mouseenter', () => {
        vid.currentTime = 0.2;
        vid.play();
      });
      card.addEventListener('mouseleave', () => { vid.pause(); });
    }
  });

  // ─── PROJECT MODAL ───
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalMedia = document.getElementById('modalMedia');
  const modalClose = document.getElementById('modalClose');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.desc;
      const videoSrc = card.dataset.video;
      const imgSrc = card.dataset.img;
      if (videoSrc) {
        modalMedia.innerHTML = `<video src="${videoSrc}" controls style="width:100%;border-radius:12px;"></video>`;
        const modalVid = modalMedia.querySelector('video');
        modalVid.addEventListener('loadedmetadata', () => {
          modalVid.currentTime = 0.2;
          modalVid.play();
        }, { once: true });
      } else if (imgSrc) {
        modalMedia.innerHTML = `<img src="${imgSrc}" alt="${card.dataset.title}" style="width:100%;border-radius:12px;" />`;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    modalMedia.innerHTML = '';
  };
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeLightbox(); } });

  // ─── PHOTO LIGHTBOX ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCloseBtn = document.getElementById('lightboxClose');

  document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  // ─── CONTACT FORM ───
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sent! ✓</span>';
    btn.style.background = 'var(--primary)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 2500);
  });

  // ─── SMOOTH ANCHOR ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ─── CREATIVE PORTFOLIO BACKGROUND ───
  // Shapes themed around visual design, video editing & photography
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w, h;
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  let mouseX = w / 2, mouseY = h / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  // Niche-appropriate shapes for a visual/video portfolio
  const SHAPES = ['filmFrame', 'aperture', 'playBtn', 'bezier', 'colorSwatch', 'filmStrip', 'penTool', 'viewfinder'];

  class CreativeShape {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 28 + 12;
      this.type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.opacity = Math.random() * 0.15 + 0.08;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.004;
      this.vx = (Math.random() - 0.5) * 0.12;
      this.vy = (Math.random() - 0.5) * 0.12;
      this.phase = Math.random() * Math.PI * 2;
      this.phaseSpeed = Math.random() * 0.002 + 0.001;
      // Color: bronze or green tint
      this.isBronze = Math.random() > 0.5;
    }
    getColor(alpha) {
      return this.isBronze
        ? `rgba(176, 137, 104, ${alpha || this.opacity})`
        : `rgba(27, 67, 50, ${(alpha || this.opacity) * 1.5})`;
    }
    update() {
      this.phase += this.phaseSpeed;
      this.rotation += this.rotSpeed;
      this.x += this.vx + Math.sin(this.phase) * 0.12;
      this.y += this.vy + Math.cos(this.phase * 0.7) * 0.08;

      // Mouse parallax
      const dx = mouseX - this.x, dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 250) {
        const force = (250 - dist) / 250 * 0.25;
        this.x -= dx * force * 0.003;
        this.y -= dy * force * 0.003;
      }

      if (this.x < -60) this.x = w + 60;
      if (this.x > w + 60) this.x = -60;
      if (this.y < -60) this.y = h + 60;
      if (this.y > h + 60) this.y = -60;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      const s = this.size;
      const col = this.getColor();
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1.2;

      switch (this.type) {
        case 'filmFrame': {
          // Movie film frame — rectangle with sprocket holes
          ctx.strokeRect(-s, -s * 0.7, s * 2, s * 1.4);
          // Sprocket holes
          for (let i = -1; i <= 1; i++) {
            ctx.fillRect(-s - 4, i * s * 0.4 - 2, 3, 4);
            ctx.fillRect(s + 1, i * s * 0.4 - 2, 3, 4);
          }
          break;
        }
        case 'aperture': {
          // Camera aperture — overlapping arcs
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.stroke();
          // Inner blades
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(
              Math.cos(angle) * s * 0.3,
              Math.sin(angle) * s * 0.3,
              s * 0.55, angle + 0.5, angle + 1.5
            );
            ctx.stroke();
          }
          break;
        }
        case 'playBtn': {
          // Video play button — triangle inside circle
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-s * 0.35, -s * 0.5);
          ctx.lineTo(-s * 0.35, s * 0.5);
          ctx.lineTo(s * 0.55, 0);
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'bezier': {
          // Design bezier curve with control points
          ctx.beginPath();
          ctx.moveTo(-s, s * 0.5);
          ctx.bezierCurveTo(-s * 0.3, -s * 1.2, s * 0.3, s * 1.2, s, -s * 0.5);
          ctx.stroke();
          // Control point dots
          ctx.fillStyle = this.getColor(this.opacity * 1.5);
          ctx.beginPath(); ctx.arc(-s, s * 0.5, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(s, -s * 0.5, 2.5, 0, Math.PI * 2); ctx.fill();
          // Control handles (dashed lines)
          ctx.setLineDash([2, 3]);
          ctx.beginPath(); ctx.moveTo(-s, s * 0.5); ctx.lineTo(-s * 0.3, -s * 1.2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(s, -s * 0.5); ctx.lineTo(s * 0.3, s * 1.2); ctx.stroke();
          ctx.setLineDash([]);
          break;
        }
        case 'colorSwatch': {
          // Color palette swatch — overlapping circles
          const swatchColors = [
            this.getColor(this.opacity * 0.8),
            `rgba(176, 137, 104, ${this.opacity * 0.6})`,
            `rgba(27, 67, 50, ${this.opacity * 0.9})`
          ];
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(i * s * 0.6 - s * 0.6, 0, s * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = swatchColors[i];
            ctx.fill();
          }
          break;
        }
        case 'filmStrip': {
          // Vertical film strip with perforations
          ctx.strokeRect(-s * 0.4, -s, s * 0.8, s * 2);
          for (let i = -2; i <= 2; i++) {
            ctx.fillRect(-s * 0.55, i * s * 0.4 - 1.5, 4, 3);
            ctx.fillRect(s * 0.35, i * s * 0.4 - 1.5, 4, 3);
          }
          // Inner frame lines
          ctx.strokeRect(-s * 0.3, -s * 0.7, s * 0.6, s * 0.55);
          ctx.strokeRect(-s * 0.3, s * 0.15, s * 0.6, s * 0.55);
          break;
        }
        case 'penTool': {
          // Pen tool cursor icon
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.3, s * 0.4);
          ctx.lineTo(0, s * 0.2);
          ctx.lineTo(-s * 0.3, s * 0.4);
          ctx.closePath();
          ctx.stroke();
          // Nib point
          ctx.beginPath();
          ctx.moveTo(-s * 0.15, s * 0.4);
          ctx.lineTo(0, s);
          ctx.lineTo(s * 0.15, s * 0.4);
          ctx.fill();
          break;
        }
        case 'viewfinder': {
          // Camera viewfinder — corners of a frame
          const v = s;
          const corner = s * 0.35;
          // Top-left
          ctx.beginPath(); ctx.moveTo(-v, -v + corner); ctx.lineTo(-v, -v); ctx.lineTo(-v + corner, -v); ctx.stroke();
          // Top-right
          ctx.beginPath(); ctx.moveTo(v - corner, -v); ctx.lineTo(v, -v); ctx.lineTo(v, -v + corner); ctx.stroke();
          // Bottom-left
          ctx.beginPath(); ctx.moveTo(-v, v - corner); ctx.lineTo(-v, v); ctx.lineTo(-v + corner, v); ctx.stroke();
          // Bottom-right
          ctx.beginPath(); ctx.moveTo(v - corner, v); ctx.lineTo(v, v); ctx.lineTo(v, v - corner); ctx.stroke();
          // Center crosshair
          ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(0, 3); ctx.stroke();
          break;
        }
      }
      ctx.restore();
    }
  }

  // Create shapes
  const shapes = [];
  const shapeCount = Math.min(40, Math.floor(w * h / 30000));
  for (let i = 0; i < shapeCount; i++) shapes.push(new CreativeShape());

  // Connection lines — styled as timeline tracks
  function drawConnections() {
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const dx = shapes[i].x - shapes[j].x;
        const dy = shapes[i].y - shapes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const opacity = 0.08 * (1 - dist / 180);
          ctx.beginPath();
          ctx.moveTo(shapes[i].x, shapes[i].y);
          ctx.lineTo(shapes[j].x, shapes[j].y);
          ctx.strokeStyle = `rgba(176, 137, 104, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }
  }

  // Ambient gradient orbs
  class GradientOrb {
    constructor(color1, color2, size) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = size;
      this.color1 = color1;
      this.color2 = color2;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.phase += 0.002;
      this.x += this.vx + Math.sin(this.phase) * 0.25;
      this.y += this.vy + Math.cos(this.phase * 0.7) * 0.15;
      if (this.x < -this.size) this.x = w + this.size;
      if (this.x > w + this.size) this.x = -this.size;
      if (this.y < -this.size) this.y = h + this.size;
      if (this.y > h + this.size) this.y = -this.size;
    }
    draw(ctx) {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, this.color1);
      grad.addColorStop(1, this.color2);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const orbs = [
    new GradientOrb('rgba(27, 67, 50, 0.12)', 'rgba(27, 67, 50, 0)', 350),
    new GradientOrb('rgba(176, 137, 104, 0.08)', 'rgba(176, 137, 104, 0)', 280),
    new GradientOrb('rgba(27, 67, 50, 0.06)', 'rgba(27, 67, 50, 0)', 400),
  ];

  let time = 0;
  (function animate() {
    time++;
    ctx.clearRect(0, 0, w, h);

    orbs.forEach(orb => { orb.update(); orb.draw(ctx); });
    drawConnections();
    shapes.forEach(s => { s.update(); s.draw(ctx); });

    requestAnimationFrame(animate);
  })();

})();
