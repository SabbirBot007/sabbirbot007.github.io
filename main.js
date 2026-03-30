/* ============================================
   PORTFOLIO – main.js
   All interactive functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── Mobile hamburger menu ────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ── Generic Carousel factory ─────────────────────────
  function initCarousel(trackId, prevId, nextId, dotsId, autoplay = true, speed = 3500) {
    const track = document.getElementById(trackId);
    const prev  = document.getElementById(prevId);
    const next  = document.getElementById(nextId);
    const dotsEl = document.getElementById(dotsId);
    if (!track) return;

    const slides = track.querySelectorAll('.carousel-slide');
    let current = 0;
    let timer;

    // Build dots
    if (dotsEl) {
      slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      });
    }

    function goTo(n) {
      slides[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      if (dotsEl) {
        dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      }
    }

    if (prev) prev.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
    if (next) next.addEventListener('click', () => { goTo(current + 1); resetTimer(); });

    function resetTimer() {
      clearInterval(timer);
      if (autoplay) timer = setInterval(() => goTo(current + 1), speed);
    }

    if (autoplay) resetTimer();
  }

  // Init home carousel (autostart, 3.5s, transition 0.5s via CSS)
  initCarousel('carouselTrack', 'carouselPrev', 'carouselNext', 'carouselDots', true, 3500);
  // Init gallery carousel
  initCarousel('galleryCarouselTrack', 'galleryCarouselPrev', 'galleryCarouselNext', 'galleryCarouselDots', true, 4000);

  // ── Gallery filter ───────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  // ── Lightbox ─────────────────────────────────────────
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbCaption  = document.getElementById('lightboxCaption');
  const lbClose    = document.getElementById('lightboxClose');

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const cap = item.querySelector('.gallery-overlay span');
        if (img && !item.classList.contains('gallery-placeholder')) {
          lbImg.src = img.src;
          lbCaption.textContent = cap ? cap.textContent : '';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── Scroll fade-in animation ─────────────────────────
  const fadeEls = document.querySelectorAll(
    '.achievement-card, .social-card, .timeline-item, .gallery-item, .cv-section-item, .contact-item'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));

  // ── Smooth active link highlighting ──────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

});
