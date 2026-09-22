/* ===== HERO CAROUSEL ===== */
const carouselSlides = document.querySelectorAll('.hero-slide');
const carouselDots = document.querySelectorAll('.hero-dot');
const heroCurrentEl = document.getElementById('heroCurrent');
let currentSlide = 0;
let carouselTimer = null;
const SLIDE_DURATION = 6000;

function goToSlide(index) {
  carouselSlides[currentSlide].classList.remove('active');
  carouselDots[currentSlide].classList.remove('active');
  currentSlide = (index + carouselSlides.length) % carouselSlides.length;
  carouselSlides[currentSlide].classList.add('active');
  carouselDots[currentSlide].classList.add('active');
  if (heroCurrentEl) heroCurrentEl.textContent = String(currentSlide + 1).padStart(2, '0');
  restartCarouselTimer();
}
function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }
function startCarouselTimer() {
  if (!carouselSlides.length) return; // no carousel on this page (e.g. /contact) — guard added during Astro port
  carouselTimer = setInterval(nextSlide, SLIDE_DURATION);
}
function stopCarouselTimer() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}
function restartCarouselTimer() {
  stopCarouselTimer();
  startCarouselTimer();
}
// Pause on hover (desktop)
const heroCarouselEl = document.getElementById('heroCarousel');
if (heroCarouselEl) {
  heroCarouselEl.addEventListener('mouseenter', stopCarouselTimer);
  heroCarouselEl.addEventListener('mouseleave', startCarouselTimer);
}
// Pause on tab inactive
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopCarouselTimer();
  else startCarouselTimer();
});
// Touch swipe (mobile)
let touchStartX = 0;
if (heroCarouselEl) {
  heroCarouselEl.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  heroCarouselEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) nextSlide(); else prevSlide();
    }
  }, { passive: true });
}
// Keyboard arrows when carousel is focused
if (heroCarouselEl) {
  heroCarouselEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
}
startCarouselTimer();

/* ===== Page routing ===== */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  const navItem = document.getElementById('nav-' + name);
  if (navItem) navItem.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ===== FAQ toggle ===== */
function toggleFaq(btn) {
  btn.parentElement.classList.toggle('open');
}

/* ===== Mobile nav ===== */
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const hamburger = document.querySelector('.hamburger');
  const isOpen = nav.classList.toggle('open');
  backdrop.classList.toggle('open', isOpen);
  hamburger.classList.toggle('open', isOpen);
  nav.toggleAttribute('inert', !isOpen); // only focusable/exposed to AT when open
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ===== Pop-up focus handling (quote, partner, consultation, "Before you go") =====
   While a pop-up is open the rest of the page is inert, focus moves into its dialog, and on close it returns to
   the element that opened it (content review: decision §8.2 for the consultation pop-up, finding N14 for the
   others). Overlays that manage their own inert state (the mobile menu, the other pop-ups) are left alone. */
const OWN_INERT = '#mobileNav, #mobileNavBackdrop, .modal-backdrop, .exit-popup, script';
const overlayState = new Map(); // open overlay → { returnTo, inerted }
function overlayOpened(overlay, dialog) {
  if (overlayState.has(overlay)) return;
  // Make everything outside the overlay inert: the siblings of the overlay and of each of its ancestors.
  const inerted = [];
  for (let node = overlay; node !== document.body && node.parentElement; node = node.parentElement) {
    for (const sib of node.parentElement.children) {
      if (sib !== node && !sib.hasAttribute('inert') && !sib.matches(OWN_INERT)) {
        sib.setAttribute('inert', '');
        inerted.push(sib);
      }
    }
  }
  overlayState.set(overlay, { returnTo: document.activeElement, inerted });
  if (dialog) dialog.focus({ preventScroll: true });
}
function overlayClosed(overlay) {
  const state = overlayState.get(overlay);
  if (!state) return;
  overlayState.delete(overlay);
  state.inerted.forEach((el) => el.removeAttribute('inert'));
  // Back to the opener; if it has gone (e.g. a mobile-menu button, now closed), to the menu button if visible.
  let back = state.returnTo;
  if (!back || back === document.body || back.closest('[inert]') || typeof back.focus !== 'function') {
    const burger = document.querySelector('.hamburger');
    back = burger && burger.offsetParent !== null ? burger : null;
  }
  if (back) back.focus({ preventScroll: true });
}

/* ===== Quote Modal ===== */
function openQuoteModal() {
  const m = document.getElementById('quoteModal');
  m.classList.add('open');
  m.removeAttribute('inert');
  document.body.style.overflow = 'hidden';
  overlayOpened(m, m.querySelector('.modal'));
}
function closeQuoteModal() {
  const m = document.getElementById('quoteModal');
  m.classList.remove('open');
  m.setAttribute('inert', '');
  document.body.style.overflow = '';
  overlayClosed(m);
}

/* ===== Partner Modal ("Become a Partner" — header + mobile menu) ===== */
function openPartnerModal() {
  const m = document.getElementById('partnerModal');
  m.classList.add('open');
  m.removeAttribute('inert');
  document.body.style.overflow = 'hidden';
  overlayOpened(m, m.querySelector('.modal'));
}
function closePartnerModal() {
  const m = document.getElementById('partnerModal');
  m.classList.remove('open');
  m.setAttribute('inert', '');
  document.body.style.overflow = '';
  overlayClosed(m);
}

/* ===== Consultation Modal ("Book a free consultation" — contact page only) =====
   Opened by the closing banner's "Book free consultation" button and the "Book a meeting" card
   (content review, decision §8.2). */
function openConsultModal() {
  const m = document.getElementById('consultModal');
  if (!m || m.classList.contains('open')) return;
  m.classList.add('open');
  m.removeAttribute('inert');
  document.body.style.overflow = 'hidden';
  overlayOpened(m, m.querySelector('.modal'));
}
function closeConsultModal() {
  const m = document.getElementById('consultModal');
  if (!m || !m.classList.contains('open')) return;
  m.classList.remove('open');
  m.setAttribute('inert', '');
  document.body.style.overflow = '';
  overlayClosed(m);
}

/* ===== Scroll to contact form on contact page ===== */
function jumpToContactForm() {
  showPage('contact');
  setTimeout(() => {
    const el = document.getElementById('contact-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

/* ===== Floating widget actions ===== */
function openWhatsApp() {
  window.open('https://wa.me/919821696444?text=Hi%20ABS%2C%20I%27m%20interested%20in%20getting%20certified.', '_blank');
}

/* ===== Scroll-to-top button visibility ===== */
const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) scrollTopBtn.classList.add('visible');
  else scrollTopBtn.classList.remove('visible');
});
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== Exit-intent popup ===== */
let exitShown = false;
function showExitPopup() {
  if (exitShown) return;
  exitShown = true;
  const p = document.getElementById('exitPopup');
  p.classList.add('open');
  p.removeAttribute('inert');
  document.body.style.overflow = 'hidden';
  overlayOpened(p, p.querySelector('.exit-popup-card'));
  try { sessionStorage.setItem('absExitShown', '1'); } catch(e) {}
}
function closeExitPopup() {
  const p = document.getElementById('exitPopup');
  p.classList.remove('open');
  p.setAttribute('inert', '');
  document.body.style.overflow = '';
  overlayClosed(p);
}
function switchExitTab(btn, type) {
  document.querySelectorAll('.exit-popup-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('exitFormEmail').style.display = type === 'email' ? 'block' : 'none';
  document.getElementById('exitFormPhone').style.display = type === 'phone' ? 'block' : 'none';
}

/* Exit-intent: trigger when mouse leaves viewport upward (desktop), or after inactivity on mobile */
try {
  if (!sessionStorage.getItem('absExitShown')) {
    // Desktop: detect cursor leaving toward top
    document.addEventListener('mouseout', (e) => {
      if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) {
        showExitPopup();
      }
    });
    // Mobile fallback: show after 45s of activity if user hasn't engaged with CTAs
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        if (window.scrollY > 200) showExitPopup();
      }, 45000);
    }
    // Back-button fallback: detect rapid scroll-to-top + history change attempts
    let lastScroll = window.scrollY;
    window.addEventListener('scroll', () => {
      if (lastScroll - window.scrollY > 200 && window.scrollY < 100) {
        showExitPopup();
      }
      lastScroll = window.scrollY;
    }, { passive: true });
  }
} catch(e) {}

/* ===== Close on Escape ===== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuoteModal();
    closePartnerModal();
    closeConsultModal();
    closeExitPopup();
    if (document.getElementById('mobileNav').classList.contains('open')) toggleMobileNav();
  }
});

/* ===== Form submission (quote / contact / newsletter → Cloudflare Pages Functions) ===== */
(function () {
  const forms = document.querySelectorAll('form[data-form]');
  if (!forms.length) return; // no wired forms on this page — guard (same pattern as the carousel)

  const SUCCESS_MESSAGES = {
    quote: "Thanks — we'll be in touch within 24 hours.",
    contact: "Thanks — your enquiry is in. We'll reply within 4 business hours.",
    newsletter: "Thanks — we'll be in touch shortly.",
    download: "Thanks — we've emailed you the guide. You can also download it now:",
    partner: "Thanks — your partner enquiry is in. Our team will be in touch.",
    consultation: "Thanks, your consultation request is in. We'll be in touch to arrange a time.", // no reply-time promise (§5.32)
  };

  forms.forEach((form) => {
    // Screen readers announce messages written into the status area (content review, N14).
    const statusArea = form.querySelector('[data-form-status]');
    if (statusArea) statusArea.setAttribute('role', 'status');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const type = form.getAttribute('data-form'); // quote | contact | newsletter
      const status = form.querySelector('[data-form-status]');
      const submitBtn = form.querySelector('[data-submit]');

      // Serialize all named fields (includes the hidden "website" honeypot, which the
      // Pages Function uses to silently drop bot submissions).
      const payload = Object.fromEntries(new FormData(form).entries());

      if (status) { status.className = ''; status.textContent = ''; }
      if (submitBtn) {
        submitBtn.disabled = true;
        if (!submitBtn.dataset.originalLabel) submitBtn.dataset.originalLabel = submitBtn.innerHTML;
        submitBtn.innerHTML = submitBtn.dataset.sending || 'Sending…'; // icon-only buttons (footer) use a short label
      }

      try {
        const res = await fetch('/api/' + type, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Request failed: ' + res.status);

        // Success — replace the form with a confirmation state.
        var downloadHtml = '';
        if (type === 'download' && form.dataset.download) {
          downloadHtml =
            '<a class="btn btn-primary" href="' + form.dataset.download + '" download style="margin-top:14px;">' +
            'Download now <span class="btn-icon-square"><i class="ti ti-download"></i></span></a>';
        }
        form.innerHTML =
          '<div class="form-success">' +
          '<span class="form-success-icon"><i class="ti ti-circle-check"></i></span>' +
          '<p>' + (form.dataset.success || SUCCESS_MESSAGES[type] || 'Thanks — message received.') + '</p>' +
          downloadHtml +
          '</div>';
        // The form (and its focused button) is gone: move focus to the confirmation so it's read out.
        const done = form.querySelector('.form-success');
        done.setAttribute('tabindex', '-1');
        done.focus({ preventScroll: true });

        if (type === 'quote') setTimeout(closeQuoteModal, 3000);
        if (type === 'partner') setTimeout(closePartnerModal, 3000);
        if (type === 'consultation') setTimeout(closeConsultModal, 3000);
        if (type === 'newsletter' && form.closest('#exitPopup')) setTimeout(closeExitPopup, 3000); // not the footer sign-up
      } catch (err) {
        if (status) {
          status.className = 'form-status form-status-error';
          status.innerHTML =
            'Something went wrong. Please call us at <a href="tel:+919821696444">+91 98216 96444</a> ' +
            'or email <a href="mailto:info@abscerts.com">info@abscerts.com</a>.';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtn.dataset.originalLabel) submitBtn.innerHTML = submitBtn.dataset.originalLabel;
        }
      }
    });
  });
})();

/* ===== Mega-menu (desktop hover) + mobile Services accordion ===== */
(function () {
  // Desktop mega-menu: open on hover of the Services trigger or the panel,
  // close 300ms after the pointer leaves both.
  const trigger = document.getElementById('megaTrigger');
  const panel = document.getElementById('megaMenu');
  if (trigger && panel) {
    let closeTimer = null;
    const open = () => {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      panel.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      panel.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    };
    const scheduleClose = () => {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 300);
    };
    trigger.addEventListener('mouseenter', open);
    trigger.addEventListener('mouseleave', scheduleClose);
    panel.addEventListener('mouseenter', open);
    panel.addEventListener('mouseleave', scheduleClose);
    trigger.addEventListener('focus', open);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });
  }

  // Mobile drawer Services accordion (level 1) + per-category sub-accordions (level 2).
  const servicesToggle = document.querySelector('.m-services-toggle');
  if (servicesToggle) {
    servicesToggle.addEventListener('click', () => {
      const wrap = servicesToggle.closest('.m-services');
      const isOpen = wrap.classList.toggle('open');
      servicesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
  document.querySelectorAll('.m-cat-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.closest('.m-cat');
      const isOpen = cat.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });
})();

/* ===== Search-within-category (vanilla, client-side substring match) ===== */
(function () {
  const input = document.querySelector('[data-category-search]');
  if (!input) return; // only on category pages that render the search box

  const tiles = Array.from(document.querySelectorAll('[data-search-target]'));
  const emptyState = document.querySelector('[data-search-empty-state]');

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    let visible = 0;
    tiles.forEach((tile) => {
      const textEl = tile.querySelector('.service-tile-search-text');
      const text = (textEl ? textEl.textContent : tile.textContent || '').toLowerCase();
      const match = q === '' || text.indexOf(q) !== -1;
      tile.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
    // Split category pages: hide a section's heading when none of its tiles match
    document.querySelectorAll('[data-search-section]').forEach((section) => {
      const any = Array.from(section.querySelectorAll('[data-search-target]')).some((t) => t.style.display !== 'none');
      section.hidden = !any;
    });
  });
})();
