/* ============================================================
   BORCA – script.js
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll shadow ────────────────────────────── */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)';
      } else {
        navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
      }
    });
  
    /* ── Smooth scroll for anchor nav links ─────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
    /* ── Intersection Observer: fade-in on scroll ──────── */
    const fadeTargets = document.querySelectorAll(
      '.service-card, .why-list li, .banner-card, .benefit-item'
    );
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  
    fadeTargets.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = `opacity 0.45s ease ${i * 60}ms, transform 0.45s ease ${i * 60}ms`;
      observer.observe(el);
    });
  
    /* Visible state applied by observer */
    document.addEventListener('animationend', () => {}, false);
  
    /* Helper: add .visible class → triggers CSS transition */
    const style = document.createElement('style');
    style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
  
    /* ── Hero title stagger animation ───────────────────── */
    const titleGreen = document.querySelector('.title-green');
    const titleGold  = document.querySelector('.title-gold');
    const heroDesc   = document.querySelector('.hero-desc');
    const heroBtns   = document.querySelector('.hero-btns');
  
    [titleGreen, titleGold, heroDesc, heroBtns].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(22px)';
      el.style.transition = `opacity 0.55s ease ${i * 110 + 100}ms, transform 0.55s ease ${i * 110 + 100}ms`;
      // Trigger after short delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  
    /* ── Dropdown simulation (Servicios) ────────────────── */
    // Just a simple hover state (CSS handles it visually)
    // If needed for accessibility:
    const dropdownLink = document.querySelector('.has-dropdown');
    if (dropdownLink) {
      dropdownLink.setAttribute('aria-haspopup', 'true');
      dropdownLink.setAttribute('aria-expanded', 'false');
    }
  
    /* ── Active nav link on scroll ──────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
  
    if (sections.length && navLinks.length) {
      const scrollSpy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => link.classList.remove('active'));
            const active = document.querySelector(
              `.nav-links a[href="#${entry.target.id}"]`
            );
            if (active) active.classList.add('active');
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
  
      sections.forEach(s => scrollSpy.observe(s));
    }
  
    /* ── Button ripple effect ───────────────────────────── */
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-contact, .btn-banner').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255,255,255,0.28);
          transform: scale(0);
          animation: ripple 0.5s linear;
          left: ${e.clientX - rect.left - size / 2}px;
          top: ${e.clientY - rect.top - size / 2}px;
          pointer-events: none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
      });
    });
  
    /* Ripple keyframe */
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
      @keyframes ripple {
        to { transform: scale(2.5); opacity: 0; }
      }
      .nav-links a.active {
        color: #0B5D5B;
        background: rgba(11,93,91,0.07);
      }
    `;
    document.head.appendChild(rippleStyle);
  
    /* ── Console branding ──────────────────────────────── */
    console.log('%cBORCA – Transformamos Copropiedades', 'color:#0B5D5B;font-size:16px;font-weight:bold;');
    console.log('%c© 2024 BORCA. Todos los derechos reservados.', 'color:#C8A96B;font-size:11px;');
  
  });