/* main.js
   - переключатель темы (localStorage)
   - mobile menu toggle
   - sub-menu toggle
   - reveal on scroll (IntersectionObserver)
   - page link transition (fade out before navigation)
   - simple parallax effect
*/

/* =========================
   Theme handling
   ========================= */
(function(){
  const root = document.documentElement;
  const THEME_KEY = 'cyber_theme';
  const saved = localStorage.getItem(THEME_KEY);

  // Default: light, allow system preference
  if (saved) {
    root.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.setAttribute('data-theme', 'dark');
  }

  // Attach to all theme buttons (there are several on pages)
  document.querySelectorAll('#theme-toggle, #theme-toggle-2, #theme-toggle-3, #theme-toggle-4, #theme-toggle-5, #theme-toggle-6, #theme-toggle-7')
    .forEach(btn => {
      btn?.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem(THEME_KEY, next);

        // brief micro-anim on icon
        const icon = btn.querySelector('.icon-theme');
        if (icon) {
          icon.style.transform = 'rotate(22deg) scale(1.05)';
          setTimeout(()=> icon.style.transform = '', 220);
        }
      });
    });
})();

/* =========================
   Mobile menu and submenus
   ========================= */
(function(){
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');

 if (menuToggle && navList){
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));

    navList.classList.toggle('open');
    menuToggle.classList.toggle('is-open');
  });
}

  // Submenu toggles for desk/mobile
  document.querySelectorAll('.has-sub > .sub-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (sub) sub.style.display = open ? 'none' : 'block';
    });
  });
})();

/* =========================
   Reveal on scroll (IntersectionObserver)
   ========================= */
(function(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        // optional: keep visible after first reveal
        // entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* =========================
   Page transitions: fade out on link click, then navigate
   ========================= */
(function(){
  const links = Array.from(document.querySelectorAll('a[href]')).filter(a => a.target !== '_blank' && !a.href.startsWith('mailto:'));
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      // ignore fragments and same-page anchors
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      // external? if starts with http and not same origin, allow immediate
      if (href.startsWith('http') && !href.includes(location.hostname)) return;
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(()=> location.href = href, 200); // within animation timing
    });
  });
})();

/* =========================
   Simple parallax for elements with data-parallax
   ========================= */
(function(){
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxEls.forEach(el => {
      // move background slower than scroll
      el.style.backgroundPosition = `center ${-y * 0.12}px`;
    });
  }, { passive:true });
})();

/* =========================
   Small accessibility helpers & keyboard menu support
   ========================= */
(function(){
  // Close mobile nav on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const menuToggle = document.getElementById('menu-toggle');
      const navList = document.getElementById('nav-list');
      if (menuToggle && navList){
        menuToggle.setAttribute('aria-expanded','false');
        navList.style.display = 'none';
      }
    }
  });
})();
