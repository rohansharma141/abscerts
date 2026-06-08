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
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/* ===== Quote Modal ===== */
function openQuoteModal() {
  document.getElementById('quoteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuoteModal() {
  document.getElementById('quoteModal').classList.remove('open');
  document.body.style.overflow = '';
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
  window.open('https://wa.me/919625776771?text=Hi%20ABS%2C%20I%27m%20interested%20in%20getting%20certified.', '_blank');
}
function toggleCallMenu(e) {
  e.stopPropagation();
  document.getElementById('callMenu').classList.toggle('open');
}
document.addEventListener('click', () => document.getElementById('callMenu').classList.remove('open'));

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
  document.getElementById('exitPopup').classList.add('open');
  document.body.style.overflow = 'hidden';
  try { sessionStorage.setItem('absExitShown', '1'); } catch(e) {}
}
function closeExitPopup() {
  document.getElementById('exitPopup').classList.remove('open');
  document.body.style.overflow = '';
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
    closeExitPopup();
    if (document.getElementById('mobileNav').classList.contains('open')) toggleMobileNav();
  }
});
