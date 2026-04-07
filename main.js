/* ═══════════════════════════════════════════════════
   ARUNACHALA DIGI WORLD — MAIN.JS v4
   FIXES:
   • GSAP loaded via <script> tags in HTML (not dynamic fetch)
     so it works on file://, localhost, and live server equally
   • Page fade fixed — no blank flash
   • Canvas works fully offline (no external deps)
   • All animations safe-guarded with null checks
   ═══════════════════════════════════════════════════ */

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzs5eBSEIF57jjIV-HpXHPEaByYqciNQuVpziso25zlzI0gOjHJ1hFQjF_2jxElfwOm/exec';

/* ══════════════════════════════════════
   1. HERO 3D PARTICLE CANVAS
   (pure canvas — zero external deps)
══════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };
  const COUNT = window.innerWidth < 768 ? 45 : 90;

  function resize() {
    W = canvas.width  = canvas.offsetWidth  || window.innerWidth;
    H = canvas.height = canvas.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * (W || 1400);
      this.y  = init ? Math.random() * (H || 800) : (H || 800) + 10;
      this.z  = Math.random() * 0.8 + 0.2;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15) * this.z;
      this.r  = (Math.random() * 1.5 + 0.5) * this.z;
      this.a  = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.55 ? '0,229,255' : '124,58,237';
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.pulse += 0.02;
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        const force = (120 - dist) / 120 * 0.8;
        this.x += (dx / dist) * force * 2.5;
        this.y += (dy / dist) * force * 2.5;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10 || this.x < -50 || this.x > W + 50) this.reset(false);
    }
    draw() {
      const alpha = this.a * (0.7 + Math.sin(this.pulse) * 0.3);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,229,255,${(1 - d / 100) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  let ringAngle = 0;
  function drawRings() {
    ringAngle += 0.003;
    const cx = W * 0.5, cy = H * 0.5;
    [
      { rx: W * 0.38, ry: W * 0.12, tilt: 0.5,  color: '124,58,237', alpha: 0.06 },
      { rx: W * 0.28, ry: W * 0.09, tilt: -0.3, color: '0,229,255',  alpha: 0.05 },
      { rx: W * 0.48, ry: W * 0.15, tilt: 0.8,  color: '244,63,142', alpha: 0.04 },
    ].forEach((ring, i) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ringAngle * (i % 2 === 0 ? 1 : -1) + ring.tilt);
      ctx.scale(1, ring.ry / ring.rx);
      ctx.beginPath();
      ctx.arc(0, 0, ring.rx, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ring.color},${ring.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    });
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  let rafId;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    drawRings();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(tick);
  }
  tick();
})();

/* ══════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = ring.style.display = 'none'; return;
  }
  let mx=0,my=0,dx=0,dy=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function tick() {
    dx += (mx-dx)*0.9; dy += (my-dy)*0.9;
    rx += (mx-rx)*0.13; ry += (my-ry)*0.13;
    dot.style.transform  = `translate(${dx-3}px,${dy-3}px)`;
    ring.style.transform = `translate(${rx-15}px,${ry-15}px)`;
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a,button,label,.faq-q,.sc,.tcard,.step-card,.client-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = ring.style.height = '52px'; ring.style.borderColor = 'rgba(0,229,255,.7)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = ring.style.height = '30px'; ring.style.borderColor = 'rgba(0,229,255,.4)'; });
  });
})();

/* ══════════════════════════════════════
   3. NAVBAR
══════════════════════════════════════ */
(function initNavbar() {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('ham');
  const menu = document.getElementById('mobMenu');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
  ham?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
    const spans = ham.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ══════════════════════════════════════
   4. FAQ ACCORDION
══════════════════════════════════════ */
(function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ══════════════════════════════════════
   5. SMOOTH ANCHORS
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ══════════════════════════════════════
   6. FORM SUBMIT
══════════════════════════════════════ */
function getFormData(form) {
  const data = {}, fd = new FormData(form), svc = [];
  form.querySelectorAll('input[name="services"]:checked').forEach(cb => svc.push(cb.value));
  fd.forEach((v, k) => { if (k !== 'services') data[k] = v; });
  data.services  = svc.join(', ') || 'Not specified';
  data.timestamp = new Date().toISOString();
  data.page      = location.pathname;
  return data;
}
async function submitForm(data, form, successEl, btn) {
  const orig = btn.textContent;
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (_) { /* no-cors always throws — that's expected */ }
  form.style.display = 'none';
  successEl.style.display = 'block';
  setTimeout(() => {
    form.reset();
    form.style.display = '';
    successEl.style.display = 'none';
    btn.textContent = orig;
    btn.disabled = false;
  }, 7000);
}
const cForm = document.getElementById('contactForm');
if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(
      getFormData(cForm), cForm,
      document.getElementById('contactSuccess'),
      document.getElementById('contactBtn')
    );
  });
}

/* ══════════════════════════════════════
   7. PAGE ENTER FADE — FIXED
   Sets opacity via CSS class, not inline
   style on body, to avoid blank flash
══════════════════════════════════════ */
(function initPageFade() {
  // Add fade-in class — CSS handles the animation
  document.documentElement.classList.add('page-loading');
  window.addEventListener('load', () => {
    // Small rAF delay ensures paint happens before fade starts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('page-loading');
        document.documentElement.classList.add('page-loaded');
      });
    });
  });
})();

/* ══════════════════════════════════════
   8. SCROLL REVEAL (CSS class toggle)
══════════════════════════════════════ */
(function initReveal() {
  const items = document.querySelectorAll('.rev');
  if (!items.length) return;
  const reveal = el => el.classList.add('on');

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { reveal(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

    items.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(() => reveal(el), 80);
      } else {
        obs.observe(el);
      }
    });
  } else {
    items.forEach((el, i) => setTimeout(() => reveal(el), i * 60));
  }

  window.addEventListener('scroll', () => {
    items.forEach(el => {
      if (!el.classList.contains('on') && el.getBoundingClientRect().top < window.innerHeight - 20)
        reveal(el);
    });
  }, { passive: true });
})();

/* ══════════════════════════════════════
   9. GSAP ANIMATIONS
   GSAP is now loaded via <script> tags
   in the HTML <head>, NOT dynamically,
   so it works on file:// with no issues
══════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') {
    // GSAP not available (offline without CDN) — skip gracefully
    // CSS-only animations and scroll reveal still work
    console.warn('GSAP not loaded — animations running in CSS-only mode');
    // Reveal hero words via CSS fallback
    document.querySelectorAll('.ht-word').forEach((w, i) => {
      w.style.transition = `opacity 0.6s ease ${0.3 + i * 0.07}s, transform 0.6s ease ${0.3 + i * 0.07}s`;
      w.style.opacity = '0';
      w.style.transform = 'translateY(30px)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        w.style.opacity = '1';
        w.style.transform = 'translateY(0)';
      }));
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Scroll progress bar */
  const prog = document.createElement('div');
  prog.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#7c3aed,#00e5ff);z-index:9999;width:0;pointer-events:none';
  document.body.appendChild(prog);
  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom',
    onUpdate: self => { prog.style.width = (self.progress * 100) + '%'; }
  });

  /* Hero words */
  const words = document.querySelectorAll('.ht-word');
  if (words.length) {
    gsap.set(words, { y: '105%', opacity: 0, rotateX: -50, skewX: -6 });
    gsap.to(words, {
      y: '0%', opacity: 1, rotateX: 0, skewX: 0,
      duration: 0.95, stagger: 0.07, ease: 'expo.out', delay: 0.3,
      transformOrigin: '50% 100%'
    });
  }

  /* Hero sub-elements */
  gsap.fromTo('.hero-sub',   { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.0 });
  gsap.fromTo('.hero-btns',  { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.15 });
  gsap.fromTo('.hero-stats', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 1.3 });

  /* Badge */
  gsap.fromTo('.badge.hero-eyebrow, .badge.ai0',
    { y: -20, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)', delay: 0.15 }
  );

  /* Scroll progress bar */
  ScrollTrigger.create({
    trigger: document.body, start: 'top top', end: 'bottom bottom',
    onUpdate: self => { prog.style.width = (self.progress * 100) + '%'; }
  });

  /* Orb parallax */
  gsap.to('.orb1', { y: -80, x: 40, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: '+=700', scrub: 1.5 }});
  gsap.to('.orb2', { y: -60, x: -30, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: '+=700', scrub: 1 }});
  gsap.to('.orb3', { y: -100, x: 20, ease: 'none', scrollTrigger: { trigger: 'body', start: 'top top', end: '+=700', scrub: 2 }});

  /* Counter animation */
  document.querySelectorAll('.hstat b').forEach(el => {
    const text = el.textContent;
    const num = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[0-9]/g, '');
    if (isNaN(num)) return;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: num, duration: 1.8, ease: 'power2.out', delay: 0.2,
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
        });
      }
    });
  });

  /* H2 headings clip reveal */
  gsap.utils.toArray('.h2').forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  /* Eyebrows */
  gsap.utils.toArray('.eyebrow').forEach(el => {
    gsap.fromTo(el, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* Service cards */
  const scCards = gsap.utils.toArray('.sc');
  if (scCards.length) {
    gsap.fromTo(scCards, { y: 70, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: '.svc-grid', start: 'top 83%', once: true } });
  }

  /* Step cards */
  gsap.utils.toArray('.step-card').forEach((c, i) => {
    gsap.fromTo(c, { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: i * 0.15,
        scrollTrigger: { trigger: '.steps-row', start: 'top 80%', once: true } });
  });

  /* Testimonials */
  gsap.utils.toArray('.tcard').forEach((c, i) => {
    gsap.fromTo(c, { y: 60, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'back.out(1.5)', delay: i * 0.12,
        scrollTrigger: { trigger: c, start: 'top 88%', once: true } });
  });

  /* Client cards */
  gsap.utils.toArray('.client-card').forEach((c, i) => {
    gsap.fromTo(c, { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.95, ease: 'expo.out', delay: i * 0.18,
        scrollTrigger: { trigger: '.clients-grid', start: 'top 83%', once: true } });
  });

  /* FAQ */
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.fromTo(item, { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: i * 0.07,
        scrollTrigger: { trigger: item, start: 'top 90%', once: true } });
  });

  /* About image parallax */
  const aboutImg = document.querySelector('.about-img-container img');
  if (aboutImg) {
    gsap.to(aboutImg, { y: -50, ease: 'none',
      scrollTrigger: { trigger: '.about-layout', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
  }

  /* About badges */
  const ab1 = document.querySelector('.ab-b1'), ab2 = document.querySelector('.ab-b2');
  const aboutVis = document.querySelector('.about-visual');
  if (ab1 && aboutVis) gsap.fromTo(ab1, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: aboutVis, start: 'top 78%', once: true } });
  if (ab2 && aboutVis) gsap.fromTo(ab2, { x: 50, opacity: 0 },  { x: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: 'expo.out', scrollTrigger: { trigger: aboutVis, start: 'top 78%', once: true } });

  /* Pills */
  const pillsContainer = document.querySelector('.pills');
  if (pillsContainer) {
    gsap.utils.toArray('.pill').forEach((pill, i) => {
      gsap.fromTo(pill, { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)', delay: i * 0.07,
          scrollTrigger: { trigger: pillsContainer, start: 'top 88%', once: true } });
    });
  }

  /* Info rows */
  gsap.utils.toArray('.info-row').forEach((row, i) => {
    gsap.fromTo(row, { x: -25, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out', delay: i * 0.1,
        scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
  });

  /* CTA band */
  const ctaBand = document.querySelector('.cta-band');
  if (ctaBand) {
    ScrollTrigger.create({
      trigger: ctaBand, start: 'top 70%', once: true,
      onEnter: () => {
        gsap.fromTo('.cta-inner > *', { y: 45, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.15, ease: 'expo.out' });
      }
    });
  }

  /* Quote block */
  gsap.utils.toArray('.quote-block').forEach(el => {
    gsap.fromTo(el, { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  /* Continuous orb float */
  gsap.to('.orb1', { x: '+=35', y: '-=25', duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.orb2', { x: '-=28', y: '+=40', duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.orb3', { x: '+=22', y: '-=45', duration: 17, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  /* 3D card tilt */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.sc,.step-card,.tcard,.client-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(card, { rotateY: x * 12, rotateX: y * -10, transformPerspective: 900, duration: 0.35, ease: 'power2.out', force3D: true });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.55, ease: 'expo.out' });
      });
    });
  }
}

/* Run GSAP init when DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGSAP);
} else {
  initGSAP();
}
