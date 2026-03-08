/* ═══════════════════════════════════════════
   ARUNACHALA DIGI WORLD — MAIN.JS
   Fixed: scroll reveal, cursor, navbar, forms
   ═══════════════════════════════════════════ */

// ── GOOGLE APPS SCRIPT URL ─────────────────
// Replace with your deployed script URL after setup
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzs5eBSEIF57jjIV-HpXHPEaByYqciNQuVpziso25zlzI0gOjHJ1hFQjF_2jxElfwOm/exec';

// ══════════════════════════════════════════
// 1. CUSTOM CURSOR (desktop only)
// ══════════════════════════════════════════
(function initCursor() {
  const dot  = document.getElementById('curDot');
  const ring = document.getElementById('curRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = ring.style.display = 'none';
    return;
  }
  let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function tick() {
    dx += (mx - dx) * 0.88; dy += (my - dy) * 0.88;
    rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
    dot.style.transform  = `translate(${dx-4}px,${dy-4}px)`;
    ring.style.transform = `translate(${rx-17}px,${ry-17}px)`;
    requestAnimationFrame(tick);
  }
  tick();
  document.querySelectorAll('a,button,label').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.style.width = ring.style.height = '52px'; ring.style.borderColor = 'rgba(37,99,235,.6)'; });
    el.addEventListener('mouseleave', () => { ring.style.width = ring.style.height = '34px'; ring.style.borderColor = 'rgba(37,99,235,.35)'; });
  });
})();

// ══════════════════════════════════════════
// 2. NAVBAR — scroll shrink + hamburger
// ══════════════════════════════════════════
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const ham = document.getElementById('ham');
  const menu = document.getElementById('mobMenu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  ham?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
    // Animate hamburger lines
    const spans = ham.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu on link click
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

// ══════════════════════════════════════════
// 3. SCROLL REVEAL — robust, always fires
// ══════════════════════════════════════════
(function initReveal() {
  const items = document.querySelectorAll('.rev');
  if (!items.length) return;

  function reveal(el) {
    el.classList.add('on');
  }

  // Use IntersectionObserver if available
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    items.forEach(el => {
      // If already in viewport on load (important for file:// protocol)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Small delay so CSS transition plays
        setTimeout(() => reveal(el), 100);
      } else {
        obs.observe(el);
      }
    });
  } else {
    // Fallback: reveal all immediately
    items.forEach((el, i) => setTimeout(() => reveal(el), i * 60));
  }

  // Also trigger on scroll (belt-and-suspenders)
  window.addEventListener('scroll', () => {
    items.forEach(el => {
      if (el.classList.contains('on')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30) reveal(el);
    });
  }, { passive: true });
})();

// ══════════════════════════════════════════
// 4. GSAP ANIMATIONS (if available)
// ══════════════════════════════════════════
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Blob float
  gsap.to('.b1', { x: 30, y: -25, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.b2', { x: -25, y: 35, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  gsap.to('.b3', { x: 20, y: -40, duration: 13, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  // Service card tilt on hover (desktop only)
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.sc, .step-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const cx = r.width / 2, cy = r.height / 2;
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const rx = ((y - cy) / cy) * -5;
        const ry = ((x - cx) / cx) * 5;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
}

// ══════════════════════════════════════════
// 5. FORM HELPERS
// ══════════════════════════════════════════
function getFormData(form) {
  const data = {};
  const fd = new FormData(form);
  const svc = [];
  form.querySelectorAll('input[name="services"]:checked')
    .forEach(cb => svc.push(cb.value));
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
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (_) { /* no-cors throws, that's fine */ }

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

// ── Home form ──
const hForm = document.getElementById('homeForm');
if (hForm) {
  hForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(getFormData(hForm), hForm, document.getElementById('homeSuccess'), document.getElementById('homeBtn'));
  });
}

// ── Contact form ──
const cForm = document.getElementById('contactForm');
if (cForm) {
  cForm.addEventListener('submit', e => {
    e.preventDefault();
    submitForm(getFormData(cForm), cForm, document.getElementById('contactSuccess'), document.getElementById('contactBtn'));
  });
}

// ══════════════════════════════════════════
// 6. SMOOTH ANCHOR SCROLLING
// ══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
