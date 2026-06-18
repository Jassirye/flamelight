/* ==========================================================================
   FLAMELIGHT — script.js
   Navigation, scroll reveals, ember particles, stat counters, misc UI.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initActiveNavLink();
  initReveals();
  initHeartDividers();
  initEmbers();
  initCounters();
  initScrollTop();
  initYear();
});

/* ---- Sticky header background on scroll -------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- Mobile nav toggle ---------------------------------------------------*/
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const scrim = document.querySelector('.nav-scrim');
  if (!toggle || !links) return;

  const close = () => {
    toggle.classList.remove('open');
    links.classList.remove('open');
    scrim && scrim.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    scrim && scrim.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  scrim && scrim.addEventListener('click', close);
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ---- Highlight current page in nav ---------------------------------------*/
function initActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ---- Fade-in-on-scroll reveals --------------------------------------------*/
function initReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
}

/* ---- Heart-divider draw-on animation ---------------------------------------*/
function initHeartDividers() {
  const dividers = document.querySelectorAll('.heart-divider');
  if (!dividers.length) return;

  if (!('IntersectionObserver' in window)) {
    dividers.forEach(el => el.classList.add('in-view'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  dividers.forEach(el => obs.observe(el));
}

/* ---- Ambient ember particles in hero ---------------------------------------*/
function initEmbers() {
  const field = document.querySelector('.hero-embers');
  if (!field) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 700 ? 14 : 26;
  for (let i = 0; i < count; i++) {
    const ember = document.createElement('span');
    ember.className = 'ember';
    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 10;
    const delay = Math.random() * 12;
    const dx = (Math.random() * 80 - 40) + 'px';
    const size = 2 + Math.random() * 3;
    ember.style.left = left + '%';
    ember.style.width = size + 'px';
    ember.style.height = size + 'px';
    ember.style.animationDuration = duration + 's';
    ember.style.animationDelay = '-' + delay + 's';
    ember.style.setProperty('--dx', dx);
    field.appendChild(ember);
  }
}

/* ---- Animated stat counters -----------------------------------------------*/
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isFloat = !Number.isInteger(target);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animate);
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
}

/* ---- Scroll-to-top button -------------------------------------------------*/
function initScrollTop() {
  const btn = document.querySelector('.to-top');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('visible', window.scrollY > 480);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Footer year ------------------------------------------------------------*/
function initYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}
