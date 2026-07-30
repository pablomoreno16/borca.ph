/* ============================================================
   BORCA – script.js
   Comportamiento compartido por las 6 páginas del sitio.
   Cargar con <script src="script.js" defer></script>.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 22px rgba(0,0,0,0.11)' : '0 2px 14px rgba(0,0,0,0.08)';
  });

  /* ── Menú mobile (hamburguesa) ──────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navbarInner = document.querySelector('.navbar-inner');
  if (navToggle && navbarInner) {
    const closeMenu = () => {
      navbarInner.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    };
    navToggle.addEventListener('click', () => {
      const isOpen = navbarInner.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
    document.querySelectorAll('.nav-collapse a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }
  const targets = document.querySelectorAll('.card,.check-item,.timeline-item,.blog-card,.stat-box,.team-card,.anim');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)} });
  }, {threshold:0.10});
  targets.forEach((el,i) => {
    el.style.opacity='0'; el.style.transform='translateY(18px)';
    el.style.transition=`opacity .45s ease ${i*50}ms,transform .45s ease ${i*50}ms`;
    obs.observe(el);
  });
  document.querySelectorAll('.btn-cta,.btn-contact,.btn-submit').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r=this.getBoundingClientRect(), s=document.createElement('span'), sz=Math.max(r.width,r.height);
      s.style.cssText=`position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;
        background:rgba(255,255,255,0.25);transform:scale(0);animation:ripple .5s linear;
        left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px;pointer-events:none;`;
      this.style.position='relative';this.style.overflow='hidden';
      this.appendChild(s);s.addEventListener('animationend',()=>s.remove());
    });
  });
});

/* ── Carrusel de promociones y eventos (solo se activa si existe #promoCarousel, ej. index.html) ── */
(function(){
  const carousel = document.getElementById('promoCarousel');
  const track = document.getElementById('promoTrack');
  if(!carousel || !track) return;

  const slides = Array.from(track.children);
  const dots = Array.from(document.querySelectorAll('#promoDots .promo-dot'));
  const prevBtn = carousel.querySelector('.promo-prev');
  const nextBtn = carousel.querySelector('.promo-next');
  const progressBar = document.getElementById('promoProgressBar');
  const AUTOPLAY_MS = 5500;

  let index = 0;
  let autoplayTimer = null;
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  function goTo(i){
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => {
      const active = di === index;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }

  function startProgress(){
    if(!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressBar.style.transition = `width ${AUTOPLAY_MS}ms linear`;
        progressBar.style.width = '100%';
      });
    });
  }

  function stopAutoplay(){
    if(autoplayTimer){ clearInterval(autoplayTimer); autoplayTimer = null; }
    if(progressBar){ progressBar.style.transition = 'none'; }
  }

  function startAutoplay(){
    stopAutoplay();
    if(isPaused) return;
    startProgress();
    autoplayTimer = setInterval(() => { next(); startProgress(); }, AUTOPLAY_MS);
  }

  function userInteract(action){
    action();
    startAutoplay();
  }

  if(nextBtn) nextBtn.addEventListener('click', () => userInteract(next));
  if(prevBtn) prevBtn.addEventListener('click', () => userInteract(prev));
  dots.forEach((dot, i) => dot.addEventListener('click', () => userInteract(() => goTo(i))));

  carousel.addEventListener('mouseenter', () => { isPaused = true; stopAutoplay(); });
  carousel.addEventListener('mouseleave', () => { isPaused = false; startAutoplay(); });

  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight'){ userInteract(next); }
    if(e.key === 'ArrowLeft'){ userInteract(prev); }
  });

  /* Swipe / drag support */
  function dragStart(x){
    isDragging = true;
    startX = x; currentX = x;
    stopAutoplay();
    track.style.transition = 'none';
  }
  function dragMove(x){
    if(!isDragging) return;
    currentX = x;
    const delta = currentX - startX;
    const pct = (delta / track.clientWidth) * 100;
    track.style.transform = `translateX(calc(-${index * 100}% + ${pct}%))`;
  }
  function dragEnd(){
    if(!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    const delta = currentX - startX;
    const threshold = track.clientWidth * 0.15;
    if(delta > threshold) prev();
    else if(delta < -threshold) next();
    else goTo(index);
    startAutoplay();
  }

  track.addEventListener('touchstart', e => dragStart(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchmove', e => dragMove(e.touches[0].clientX), {passive:true});
  track.addEventListener('touchend', dragEnd);

  track.addEventListener('mousedown', e => { e.preventDefault(); dragStart(e.clientX); });
  window.addEventListener('mousemove', e => { if(isDragging) dragMove(e.clientX); });
  window.addEventListener('mouseup', () => { if(isDragging) dragEnd(); });

  goTo(0);
  startAutoplay();
})();
