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

  // ─── VIDEO THUMBNAILS — SEEK TO 3 SECONDS ───
  document.querySelectorAll('.card-media video').forEach(function (video) {
    video.preload = 'metadata';
    function seekTo3() {
      if (video.duration >= 3) {
        video.currentTime = 3;
      } else if (video.duration > 0) {
        video.currentTime = video.duration * 0.3;
      }
      video.removeEventListener('loadedmetadata', seekTo3);
    }
    if (video.readyState >= 1) {
      seekTo3();
    } else {
      video.addEventListener('loadedmetadata', seekTo3);
    }
  });

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

  // ─── VIDEO SCROLL-TO-SCALE ANIMATION ───
  const videoScrollSection = document.getElementById('video-scroll');
  const videoScaleWrapper = document.getElementById('videoScaleWrapper');

  if (videoScrollSection && videoScaleWrapper) {
    const startScale = 0.35;
    let ticking = false;

    function updateVideoScale() {
      const rect = videoScrollSection.getBoundingClientRect();
      const sectionHeight = videoScrollSection.offsetHeight;
      const windowHeight = window.innerHeight;

      // How far the section top has scrolled past the viewport top
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = sectionHeight - windowHeight;

      // Guard against division by zero
      if (maxScroll <= 0) return;

      const progress = Math.min(scrolled / maxScroll, 1);
      const scale = startScale + (progress * (1 - startScale));
      videoScaleWrapper.style.transform = 'scale(' + scale + ')';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateVideoScale);
        ticking = true;
      }
    }, { passive: true });

    // Run on load
    updateVideoScale();
  }

  // ─── WEBGL LIGHTNING SHADER — HERO ONLY ───
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const glCanvas = document.createElement('canvas');
    glCanvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;';
    heroSection.insertBefore(glCanvas, heroSection.firstChild);

    // Hue slider control only
    let currentHue = 220;
    const hueSlider = document.getElementById('lightningHue');
    const hueLabel = document.getElementById('hueValue');

    if (hueSlider) {
      hueSlider.addEventListener('input', e => {
        currentHue = Number(e.target.value);
        if (hueLabel) hueLabel.textContent = currentHue + '°';
      });
    }

    function resizeGL() {
      glCanvas.width = glCanvas.clientWidth;
      glCanvas.height = glCanvas.clientHeight;
    }
    resizeGL();
    window.addEventListener('resize', resizeGL);

    const gl = glCanvas.getContext('webgl');
    if (gl) {
      const vertSrc = `
        attribute vec2 aPosition;
        void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
      `;

      const fragSrc = `
        precision mediump float;
        uniform vec2 iResolution;
        uniform float iTime;
        uniform float uHue;

        #define OCTAVE_COUNT 10

        vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
        }

        float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
        }

        float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }

        mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
            value += amplitude * noise(p);
            p *= rotate2d(0.45);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;

          // Single central lightning bolt (smaller, focused)
          uv += 2.0 * fbm(uv * 3.5 + 0.8 * iTime * 1.6) - 1.0;
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * 1.6)) / dist, 1.0) * 0.1;
          gl_FragColor = vec4(col, 1.0);
        }
      `;

      function compileShader(src, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error('Shader error:', gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }

      const vs = compileShader(vertSrc, gl.VERTEX_SHADER);
      const fs = compileShader(fragSrc, gl.FRAGMENT_SHADER);

      if (vs && fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);

          const verts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
          const buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

          const aPos = gl.getAttribLocation(program, 'aPosition');
          gl.enableVertexAttribArray(aPos);
          gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

          const uRes = gl.getUniformLocation(program, 'iResolution');
          const uTime = gl.getUniformLocation(program, 'iTime');
          const uHue = gl.getUniformLocation(program, 'uHue');

          const startTime = performance.now();

          (function renderLoop() {
            resizeGL();
            gl.viewport(0, 0, glCanvas.width, glCanvas.height);
            gl.uniform2f(uRes, glCanvas.width, glCanvas.height);
            gl.uniform1f(uTime, (performance.now() - startTime) / 1000.0);
            gl.uniform1f(uHue, currentHue);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(renderLoop);
          })();
        }
      }
    }
  }

})();
