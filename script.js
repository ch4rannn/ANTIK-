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

  // ─── PARTICLE BACKGROUND ───
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0.4';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w; this.y = Math.random() * h;
      this.s = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.o = Math.random() * 0.5 + 0.1;
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fillStyle = `rgba(99,102,241,${this.o})`; ctx.fill(); }
  }
  // Particles disabled

  (function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    // // requestAnimationFrame(loop);
  })();

})();
