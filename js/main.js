// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');
hamburger?.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileNav.classList.remove('open'));

// ===== PAGE ROUTING =====
function showPage(pageId) {
  // Hide all main pages
  document.querySelectorAll('.page, .service-detail-page, .blog-detail-page').forEach(p => {
    p.classList.remove('active');
  });

  // Show requested page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update nav active state
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => a.classList.remove('active'));
  const mainPage = ['home','services','work','blogs','why','contact'].find(p => pageId === p || pageId.startsWith('sd-') && p === 'services' || pageId.startsWith('bd-') && p === 'blogs');
  if (mainPage) {
    document.querySelectorAll(`[data-page="${mainPage}"]`).forEach(a => a.classList.add('active'));
  }

  mobileNav?.classList.remove('open');
  setTimeout(initAnimations, 80);
}

document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const pg = el.getAttribute('data-page');
    if (pg) showPage(pg);
  });
});

// ===== SERVICE CARD CLICKS → detail pages =====
document.querySelectorAll('.service-card[data-service]').forEach(card => {
  card.addEventListener('click', () => {
    const sid = card.getAttribute('data-service');
    showPage('sd-' + sid);
  });
});
window.goBackToServices = function() { showPage('services'); };

// ===== BLOG CARD CLICKS → detail pages =====
document.querySelectorAll('.blog-card[data-blog]').forEach(card => {
  card.addEventListener('click', () => {
    const bid = card.getAttribute('data-blog');
    showPage('bd-' + bid);
  });
});
window.goBackToBlogs = function() { showPage('blogs'); };

// ===== TAB SYSTEM =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    const tabGroup = btn.closest('.steps-tabs');

    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // find associated panels container (next sibling div)
    let panelsContainer = tabGroup.nextElementSibling;
    if (panelsContainer) {
      panelsContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    }

    setTimeout(initAnimations, 60);
  });
});

// ===== PORTFOLIO FILTER =====
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.portfolio-item').forEach(item => {
      const show = filter === 'all' || item.getAttribute('data-cat') === filter;
      item.style.display = show ? '' : 'none';
      if (show) {
        item.style.animation = 'none';
        requestAnimationFrame(() => { item.style.animation = ''; });
      }
    });
  });
});

// ===== CONTACT FORM → localStorage =====
document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;

  const data = {
    name: form.name.value,
    mobile: form.mobile.value,
    email: form.email.value,
    brand: form.brand.value,
    services: form.service.value,
    address: "",
    message: form.message.value
  };

  try {
    // ✅ Send to Google Sheets (Excel)
    await fetch("https://script.google.com/macros/s/AKfycbzs5eBSEIF57jjIV-HpXHPEaByYqciNQuVpziso25zlzI0gOjHJ1hFQjF_2jxElfwOm/exec", {
      method: "POST",
      body: JSON.stringify(data)
    });

    // ✅ Show success
    document.getElementById("contactSuccess").style.display = "block";

    // ✅ Reset form
    form.reset();

   

  } catch (error) {
    alert("Error submitting form");
    console.error(error);
  }
});

// ===== SCROLL ANIMATIONS =====
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.page.active .fade-up, .service-detail-page.active .fade-up, .blog-detail-page.active .fade-up').forEach(el => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const step = target / 80;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 20);
  });
}

// ===== CARD 3D HOVER =====
function init3DHover() {
  document.querySelectorAll('.service-card, .blog-card, .testimonial-card, .why-point').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
      card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  setTimeout(animateCounters, 600);
  setTimeout(init3DHover, 200);
  renderSubmissions();
});
