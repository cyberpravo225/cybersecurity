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
   Profile modal + Supabase auth (home page)
   ========================= */
(function(){
  const profileToggle = document.getElementById('profile-toggle');
  const modal = document.getElementById('profileModal');
  if (!profileToggle || !modal) return;

  const closeBtn = document.getElementById('profileModalClose');
  const registerBtn = document.getElementById('profileRegisterBtn');
  const loginBtn = document.getElementById('profileLoginBtn');
  const statusBox = document.getElementById('profileModalStatus');
  const passwordToggle = document.getElementById('profilePasswordToggle');
  const registerToggle = document.getElementById('profileRegisterToggle');
  const backToLoginBtn = document.getElementById('profileBackToLoginBtn');
  const authPanel = document.getElementById('profileAuthPanel');
  const authText = document.getElementById('profileAuthText');

  const emailInput = document.getElementById('profileEmailInput');
  const passwordInput = document.getElementById('profilePasswordInput');
  const usernameInput = document.getElementById('profileUsernameInput');
  const birthDateInput = document.getElementById('profileBirthDateInput');

  const SUPABASE_URL = 'https://vpnxkfpwmieerfaqijot.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwbnhrZnB3bWllZXJmYXFpam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzQ0NTIsImV4cCI6MjA5MDgxMDQ1Mn0.ImmCQUziNbBOkwZ2u3eaJu2DrLTmaKyWvUttUKKfckg';
  const STORAGE_DEVICE_ID = 'device_id';

  const setStatus = (text, type = '') => {
    if (!statusBox) return;
    statusBox.textContent = text;
    statusBox.classList.remove('ok', 'error');
    if (type) statusBox.classList.add(type);
  };

  const setMode = (mode) => {
    const registerMode = mode === 'register';
    authPanel?.classList.toggle('is-register', registerMode);
    if (registerToggle) registerToggle.setAttribute('aria-expanded', String(registerMode));
    if (authText) {
      authText.textContent = registerMode ? 'Регистрируйтесь.' : 'Войдите в аккаунт.';
    }
  };

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    setMode('login');
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (passwordInput) passwordInput.type = 'password';
    if (passwordToggle) {
      passwordToggle.dataset.state = 'show';
      passwordToggle.setAttribute('aria-label', 'Показать пароль');
    }
    setMode('login');
  };

  const getDeviceId = () => {
    let id = localStorage.getItem(STORAGE_DEVICE_ID);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_DEVICE_ID, id);
    }
    return id;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const createClient = () => {
    if (!window.supabase?.createClient) {
      throw new Error('Библиотека Supabase не загрузилась.');
    }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  };

  const withPending = (btn, fn) => async () => {
    if (!btn) return;
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '...';
    try {
      await fn();
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  };

  profileToggle.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  registerToggle?.addEventListener('click', () => {
    setMode('register');
  });
  backToLoginBtn?.addEventListener('click', () => setMode('login'));
  passwordToggle?.addEventListener('click', () => {
    const isHidden = passwordInput?.type === 'password';
    if (!passwordInput) return;
    passwordInput.type = isHidden ? 'text' : 'password';
    passwordToggle.dataset.state = isHidden ? 'hide' : 'show';
    passwordToggle.setAttribute('aria-label', isHidden ? 'Скрыть пароль' : 'Показать пароль');
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  registerBtn?.addEventListener('click', withPending(registerBtn, async () => {
    try {
      const email = (emailInput?.value || '').trim();
      const password = passwordInput?.value || '';
      const username = (usernameInput?.value || '').trim();
      const birthDate = birthDateInput?.value || '';

      if (!email || !password || !username || !birthDate) {
        throw new Error('Для регистрации заполни email, пароль, логин и дату рождения.');
      }

      const sb = createClient();
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      if (!data?.user) {
        throw new Error('Пользователь не создан. Проверь подтверждение email в Supabase.');
      }

      const profileRow = {
        id: data.user.id,
        username,
        birth_date: birthDate,
        age: calculateAge(birthDate),
        score: 0,
        device_id: getDeviceId()
      };

      const { error: profileError } = await sb.from('profiles').insert(profileRow);
      if (profileError) throw profileError;

      setStatus('Профиль создан. Теперь можно войти.', 'ok');
    } catch (error) {
      setStatus(error.message || 'Ошибка при создании профиля.', 'error');
    }
  }));

  loginBtn?.addEventListener('click', withPending(loginBtn, async () => {
    try {
      const email = (emailInput?.value || '').trim();
      const password = passwordInput?.value || '';
      if (!email || !password) throw new Error('Для входа заполни email и пароль.');

      const sb = createClient();
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setStatus(`Вход выполнен: ${data.user.email}`, 'ok');
    } catch (error) {
      setStatus(error.message || 'Ошибка при входе.', 'error');
    }
  }));

})();


/* =========================
   Background animation performance toggle
   ========================= */
(function(){
  const root = document.documentElement;
  const STORAGE_KEY = 'cyber_bg_animation';
  const prefersPhoneDefaults = () => {
    const narrow = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return narrow || (coarsePointer && window.innerWidth <= 1024);
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  let enabled = saved ? saved === 'on' : !prefersPhoneDefaults();

  const applyMode = (nextEnabled) => {
    enabled = Boolean(nextEnabled);
    root.classList.toggle('bg-anim-off', !enabled);
    root.classList.toggle('bg-anim-on', enabled);
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    window.dispatchEvent(new CustomEvent('cyber:bg-animation-change', { detail: { enabled } }));

    const btn = document.getElementById('performance-toggle');
    if (!btn) return;

    btn.setAttribute('aria-pressed', String(enabled));
    btn.dataset.mode = enabled ? 'performance' : 'saving';
    btn.title = enabled ? 'Режим производительности (анимация включена)' : 'Режим энергосбережения (анимация выключена)';
    btn.setAttribute('aria-label', enabled
      ? 'Режим производительности: анимация фона включена'
      : 'Режим энергосбережения: анимация фона выключена');
  };

  applyMode(enabled);

  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  if (!themeToggle || !menuToggle || !themeToggle.parentElement) return;

  const perfBtn = document.createElement('button');
  perfBtn.id = 'performance-toggle';
  perfBtn.className = 'btn icon-btn perf-toggle';
  perfBtn.type = 'button';
  perfBtn.innerHTML = `
    <svg class="icon-performance" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path class="icon-bolt" d="M13.5 2L6 13h5l-1 9 8-12h-5.2L13.5 2z"/>
      <g class="icon-battery">
        <rect class="battery-shell" x="2.8" y="5.2" width="16.2" height="11.6" rx="3"/>
        <rect class="battery-tip" x="19.4" y="8.6" width="1.8" height="4" rx="0.9"/>
        <rect class="battery-core" x="4.7" y="7" width="10.8" height="8" rx="1.7"/>
        <rect class="battery-cell battery-cell-1" x="5.6" y="8" width="2.4" height="6" rx="1"/>
        <rect class="battery-cell battery-cell-2" x="9" y="8" width="2.4" height="6" rx="1"/>
        <rect class="battery-cell battery-cell-3" x="12.4" y="8" width="2.4" height="6" rx="1"/>
      </g>
    </svg>`;

  themeToggle.insertAdjacentElement('afterend', perfBtn);
  applyMode(enabled);

  perfBtn.addEventListener('click', () => {
    applyMode(!enabled);
  });
})();

/* =========================
   Performance profile (for weak phones)
   ========================= */
(function(){
  const root = document.documentElement;
  const hasTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const isPhoneLike = hasTouch && window.innerWidth <= 900;
  const ua = navigator.userAgent || '';
  const cpu = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || null;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const screenShortSide = Math.min(window.screen.width || window.innerWidth, window.screen.height || window.innerHeight);
  const isOldSmallIphone = /iPhone/i.test(ua) && screenShortSide <= 375;
  const isLowEndPhone = isPhoneLike && (cpu <= 4 || (memory !== null && memory <= 4) || prefersReducedMotion || isOldSmallIphone);

  if (isLowEndPhone) {
    root.classList.add('low-end-device');
  }
})();

/* =========================
   Normalize arrow icons in navigation labels
   ========================= */
(function(){
  document.querySelectorAll('.back-btn').forEach(link => {
    link.textContent = link.textContent.replace(/^\s*[←↩]+\s*/, '').trim();
  });

  document.querySelectorAll('a, button').forEach(el => {
    const text = el.textContent || '';
    if (/главное\s+меню/i.test(text)) {
      el.textContent = text.replace(/^\s*[←↩🏠]+\s*/, '').trim();
      if (el.closest('.topbar')) {
        el.classList.add('header-main-menu');
      }
    }
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
    document.body.classList.toggle('menu-open', !open);
  });
}
   // закрытие меню при клике вне него
document.addEventListener('click', (e) => {
  if (!navList.classList.contains('open')) return;

  if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
    navList.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
});

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
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('in-view');
      el.classList.add('visible');
    });
    return;
  }

  const lowEndPhone = document.documentElement.classList.contains('low-end-device');
  const isDesktop = window.matchMedia && window.matchMedia('(min-width: 1025px)').matches;
  if (lowEndPhone || !isDesktop) {
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('in-view');
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      } else {
        // optional: keep visible after first reveal
        // entry.target.classList.remove('in-view');
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px -8% 0px' });

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
  if (document.documentElement.classList.contains('low-end-device')) return;
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
  navList.classList.remove('open');
  menuToggle.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}
    }
  });
})();

/* =========================
   Unify card styles across pages
   ========================= */
(function(){
  const EXCLUDED_CARD_CLASSES = new Set([
    'card-grid',
    'card-photo',
    'card-icon',
    'answer-card',
    'result-card'
  ]);

  const isCardLike = (el) => {
    if (!(el instanceof HTMLElement)) return false;
    const classNames = Array.from(el.classList);
    if (!classNames.length) return false;
    if (classNames.some(className => EXCLUDED_CARD_CLASSES.has(className))) return false;
    return classNames.some(className => className === 'card' || className.endsWith('-card'));
  };

  const applyIndexCardLook = (root) => {
    const scope = root instanceof HTMLElement || root instanceof Document ? root : document;
    const candidates = [];

    if (scope instanceof HTMLElement && isCardLike(scope)) {
      candidates.push(scope);
    }

    scope.querySelectorAll?.('[class*="card"]').forEach((el) => {
      if (isCardLike(el)) {
        candidates.push(el);
      }
    });

    candidates.forEach((card) => {
      card.classList.add('index-like-card');

      const firstImage = card.querySelector('img');
      if (firstImage && !firstImage.classList.contains('card-photo')) {
        firstImage.classList.add('index-like-card-photo');
      }
    });
  };

  applyIndexCardLook(document);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          applyIndexCardLook(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();

/* =========================
   Fix malformed CyberGuessr mode cards markup at runtime
   ========================= */
(function(){
  const isCyberGuessrHub = /cyberguessr\.html$/i.test(window.location.pathname);
  if (!isCyberGuessrHub) return;

  const gameModes = document.querySelector('.game-modes');
  if (!gameModes) return;

  let nestedCards = gameModes.querySelectorAll('a.mode-card a.mode-card');
  while (nestedCards.length) {
    nestedCards.forEach((nestedCard) => {
      gameModes.appendChild(nestedCard);
    });
    nestedCards = gameModes.querySelectorAll('a.mode-card a.mode-card');
  }
})();
/* =========================
   School card age chooser
   ========================= */
(function(){
  const card = document.getElementById('school-card');
  const ages = document.getElementById('school-ages');

  if (!card || !ages) return;

card.addEventListener('click', (e) => {

  // чтобы клик по кнопкам внутри не закрывал меню
  if (e.target.closest('.school-ages')) return;

  ages.classList.toggle('show');
});
   document.querySelectorAll('#nav-list a').forEach(link => {
  link.addEventListener('click', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    navList.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.classList.remove('is-open');
  });
});
})();
/* =========================
   База советов
========================= */

const tips = [

{
title: "Никогда не сообщайте код из SMS",
text: "Если вам звонят и просят назвать код подтверждения — это мошенники. Ни банк, ни полиция, ни служба поддержки никогда не спрашивают такие данные.",
img: "assets/earth-hero.svg"
},

{
title: "Проверяйте адрес сайта",
text: "Фишинговые сайты — это поддельные страницы, которые маскируются под настоящие, чтобы украсть ваши данные: логины, пароли, коды из SMS, банковскую информацию. Они могут выглядеть почти идентично оригиналу, но отличаться всего одной буквой в адресе.",
img: "assets/tip2.jpg"
},

{
title: "Не переходите по подозрительным ссылкам",
text: "Мошенники часто присылают SMS с фальшивыми ссылками, которые ведут на поддельные сайты. Они маскируются под банк, магазин или службу доставки и просят ввести личные данные.",
img: "assets/tip3.jpg"
},

{
title: "Используйте сложные пароли",
text: "Сложный пароль — это ваша защита. Он должен содержать **буквы, цифры и специальные символы**, чтобы его было невозможно угадать или подобрать. Чем разнообразнее и длиннее пароль — тем надёжнее ваша цифровая безопасность.",
img: "assets/tip4.jpg"
},

{
title: "ВКЛЮЧАЙТЕ ДВУХФАКТОРНУЮ АУТЕНТИФИКАЦИЮ",
text: "Это добавляет второй уровень защиты: даже если злоумышленник узнает ваш пароль, ему всё равно понадобится одноразовый код, который приходит только вам. Такой подход резко снижает вероятность взлома аккаунта, особенно в соцсетях и почте, где хранятся личные данные.",
img: "assets/tip5.jpg"
},

{
title: "ИСПОЛЬЗУЙТЕ РАЗНЫЕ ПАРОЛИ ДЛЯ РАЗНЫХ СЕРВИСОВ",
text: "Если один сайт взломают или пароль утечёт, остальные аккаунты останутся в безопасности. Мошенники часто проверяют украденный пароль на десятках популярных сервисов — уникальные комбинации полностью ломают эту схему.",
img: "assets/tip6.jpg"
},
   
{
title: "ПРОВЕРЯЙТЕ АКТИВНЫЕ УСТРОЙСТВА В АККАУНТЕ",
text: "В настройках большинства сервисов можно увидеть, с каких устройств выполнялся вход. Если замечаете незнакомое — это признак взлома. Немедленно завершайте все сессии и меняйте пароль, чтобы заблокировать злоумышленника.",
img: "assets/tip7.jpg"
},
   
{
title: "УСТАНАВЛИВАЙТЕ ПРИЛОЖЕНИЯ ТОЛЬКО ИЗ ОФИЦИАЛЬНЫХ МАГАЗИНОВ",
text: "Сторонние сайты часто распространяют поддельные версии программ, в которые встроены вирусы, рекламные модули или инструменты для кражи данных. Магазины вроде Google Play и App Store проверяют приложения и снижают риск заражения.",
img: "assets/tip8.jpg"
},
   
{
title: "НЕ ВВОДИТЕ ДАННЫЕ НА ПОДОЗРИТЕЛЬНЫХ СТРАНИЦАХ",
text: "Ошибки в тексте, странный дизайн, всплывающие окна, агрессивные просьбы «ввести данные срочно» — признаки фишинга. Такие сайты созданы, чтобы украсть ваши логины, пароли или данные карты.",
img: "assets/tip9.jpg"
},
   
{
title: "НЕ ОТПРАВЛЯЙТЕ ЛИЧНЫЕ ДАННЫЕ В ПЕРЕПИСКАХ",
text: "Паспорт, номер карты, адрес, фото документов — всё это может быть использовано для мошенничества, оформления кредитов или шантажа. Даже если собеседник кажется знакомым, его аккаунт могли взломать.",
img: "assets/tip10.jpg"
},

{
title: "НЕ ОТПРАВЛЯЙТЕ ЛИЧНЫЕ ДАННЫЕ В ПЕРЕПИСКАХ",
text: "Паспорт, номер карты, адрес, фото документов — всё это может быть использовано для мошенничества, оформления кредитов или шантажа. Даже если собеседник кажется знакомым, его аккаунт могли взломать.",
img: "assets/tip10.jpg"
},

{
title: "ПРОВЕРЯЙТЕ КТО ВАМ ПИШЕТ",
text: "Мошенники копируют аватар, имя и стиль общения, чтобы вызвать доверие. Если человек просит деньги, код из SMS или ссылку — обязательно уточните голосом или другим способом.",
img: "assets/tip11.jpg"
},

{
title: "НЕ ПОДКЛЮЧАЙТЕСЬ К НЕИЗВЕСТНЫМ Wi‑Fi СЕТЯМ",
text: "Публичные сети могут перехватывать ваши данные и перенаправлять вас на поддельные сайты. Лучше использовать мобильный интернет или личную точку доступа.",
img: "assets/Copilot_20260321_040436.png"
},

{
title: "НЕ УСТАНАВЛИВАЙТЕ ВЗЛОМАННЫЕ ИГРЫ И МОДЫ",
text: "В них часто встроены вирусы, которые работают незаметно. Они могут красть данные, показывать рекламу или давать злоумышленнику доступ к устройству.",
img: "assets/Copilot_20260321_150056.png"
},

{
title: "ПРОВЕРЯЙТЕ КУДА ВЕДЁТ ССЫЛКА ПРЕЖДЕ ЧЕМ НАЖАТЬ НА НЕЁ",
text: "Если навести курсор, можно увидеть настоящий адрес. Мошенники часто маскируют вредоносные ссылки под знакомые названия.",
img: "assets/Copilot_20260321_150308.png"
},

{
title: "НЕ ПРИНИМАЙТЕ ЗАЯВКИ В ДРУЗЬЯ ОТ НЕЗНАКОМЦЕВ",
text: "Фейковые аккаунты собирают информацию или пытаются выманить данные. Даже если фото выглядит реальным, это может быть мошенник.",
img: "assets/Copilot_20260321_150621.png"
},

{
title: "НЕ ПУБЛИКУЙТЕ ФОТО ДОКУМЕНТОВ И БИЛЕТОВ",
text: "По ним можно узнать ваши личные данные или даже получить доступ к аккаунтам. Такие фото легко распространяются без вашего контроля.",
img: "assets/Copilot_20260321_150931.png"
},

{
title: "НЕ ПЕРЕХОДИТЕ ПО ССЫЛКАМ В КОМЕНТАРИЯХ",
text: "Там часто скрываются фишинговые сайты или вредоносные загрузки. Мошенники используют комментарии, потому что люди меньше их проверяют.",
img: "assets/Copilot_20260321_151230.png"
}
];


/* =========================
   Совет дня (главная)
========================= */

const TIP_DATE_KEY = "cybersecurity:lastTipDate";
const TIP_INDEX_KEY = "cybersecurity:lastTipIndex";
const START_DATE = new Date("2026-03-10T00:00:00");

const now = new Date();
const todayKey = now.toISOString().slice(0, 10);

let todayIndex = 0;
const savedDate = localStorage.getItem(TIP_DATE_KEY);
const savedIndex = Number(localStorage.getItem(TIP_INDEX_KEY));

if (savedDate === todayKey && Number.isInteger(savedIndex) && savedIndex >= 0 && savedIndex < tips.length) {
  todayIndex = savedIndex;
} else {
  const baseIndex = Number.isInteger(savedIndex) ? savedIndex : -1;
  todayIndex = (baseIndex + 1 + tips.length) % tips.length;

  localStorage.setItem(TIP_DATE_KEY, todayKey);
  localStorage.setItem(TIP_INDEX_KEY, String(todayIndex));
}

const todayTip = tips[todayIndex];

const title = document.querySelector(".tip-title");
const text = document.querySelector(".tip-text");
const img = document.querySelector(".tip-image");

if(title && text && img){

title.textContent = todayTip.title;
text.textContent = todayTip.text;
img.src = todayTip.img;

}


/* =========================
   История советов
========================= */

const tipsContainer = document.querySelector(".tips-history");

if(tipsContainer){

const diffTime = now - START_DATE;
const passedDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

for(let day = 0; day < passedDays; day++){

const tip = tips[day % tips.length];

const card = document.createElement("div");
card.className = "tip-card";

card.innerHTML = `
<img src="${tip.img}" class="tip-image">

<div class="tip-content">
<h3>${tip.title}</h3>
<p>${tip.text}</p>
</div>
`;

tipsContainer.appendChild(card);

}
   // открытие выбора сложности

const testCards = document.querySelectorAll(".test-card")
const modal = document.getElementById("difficultyModal")
const closeBtn = document.querySelector(".modal-close")

if(testCards){
testCards.forEach(card=>{
card.addEventListener("click",()=>{
modal.classList.add("active")
})
})
}

if(closeBtn){
closeBtn.addEventListener("click",()=>{
modal.classList.remove("active")
})
}

}
const dictButtons = document.querySelectorAll(".dictionary-header")

dictButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

const block = btn.parentElement
const content = btn.nextElementSibling

block.classList.toggle("active")

if(content.style.maxHeight){
content.style.maxHeight = null
}else{
content.style.maxHeight = content.scrollHeight + "px"
}

})

})
// поиск терминов словаря

const searchInput = document.getElementById("dictionarySearch")

if(searchInput){

searchInput.addEventListener("input",()=>{

const query = searchInput.value.toLowerCase()

const terms = document.querySelectorAll(".dictionary-content p")

const blocks = document.querySelectorAll(".dictionary-block")

// если меньше 3 символов — показать всё

if(query.length < 3){

terms.forEach(term=>{
term.style.display="block"
})

blocks.forEach(block=>{

block.style.display="block"

const content = block.querySelector(".dictionary-content")

block.classList.remove("active")
content.style.maxHeight = null

})

return
}
blocks.forEach(block=>{

let blockHasResult = false

const blockTerms = block.querySelectorAll("p")

blockTerms.forEach(term=>{

const text = term.innerText.toLowerCase()

if(text.includes(query)){

term.style.display="block"
blockHasResult = true

}else{

term.style.display="none"

}

})

blocks.forEach(block=>{

let blockHasResult = false

const blockTerms = block.querySelectorAll("p")
const content = block.querySelector(".dictionary-content")

blockTerms.forEach(term=>{

const text = term.innerText.toLowerCase()

if(text.includes(query)){

term.style.display="block"
blockHasResult = true

}else{

term.style.display="none"

}

})

if(blockHasResult){

block.style.display="block"

/* автоматически раскрываем */

block.classList.add("active")
content.style.maxHeight = content.scrollHeight + "px"

}else{

block.style.display="none"

}

})

})

})

}
const clearBtn = document.getElementById("searchClear")

if(searchInput && clearBtn){

searchInput.addEventListener("input",()=>{

clearBtn.style.display = searchInput.value.length ? "block" : "none"

})

clearBtn.addEventListener("click",()=>{

searchInput.value = ""
clearBtn.style.display="none"

searchInput.dispatchEvent(new Event("input"))

})

}
/* =========================
   Premium theme network background
   ========================= */
(function(){
  const hasThemeNetwork = Boolean(document.getElementById('theme-network'));
  if (hasThemeNetwork) return;
  const canvas = document.getElementById('theme-network');
  if (!canvas) return;
  if (canvas.dataset.networkInit === '1') return;
  canvas.dataset.networkInit = '1';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let lastFrameTime = 0;
  let nodes = [];
  let stars = [];
  let sceneSignature = '';
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollOffset = 0;
  let backgroundAnimationEnabled = !reducedMotion && !document.documentElement.classList.contains('bg-anim-off');

  const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const isMobile = () => window.innerWidth < 720;
  const isLowPowerDevice = () => {
    const cpu = navigator.hardwareConcurrency || 0;
    const memory = navigator.deviceMemory || 0;
    return cpu > 0 && cpu <= 4 || memory > 0 && memory <= 4;
  };
  const prefersPerformanceMode = () => isMobile() || isLowPowerDevice() || (width * height > 2000000);

  const palette = () => {
    const dark = isDarkTheme();
    return dark
      ? {
          hazeTop: '#02040a',
          hazeMid: '#07111f',
          hazeBottom: '#030712',
          depthGlow: 'rgba(37,99,235,0.16)',
          lowerGlow: 'rgba(34,211,238,0.10)',
          star: 'rgba(186,230,253,0.92)',
          starBright: 'rgba(255,255,255,1)',
          node: 'rgba(125,211,252,1)',
          nodeBright: 'rgba(255,255,255,1)',
          line: 'rgba(96,165,250,0.24)',
          lineBright: 'rgba(125,211,252,0.36)'
        }
      : {
          hazeTop: '#f8fbff',
          hazeMid: '#edf5ff',
          hazeBottom: '#dfebfb',
          depthGlow: 'rgba(191,219,254,0.3)',
          lowerGlow: 'rgba(255,255,255,0.35)',
          star: 'rgba(255,255,255,1)',
          starBright: 'rgba(255,255,255,1)',
          node: 'rgba(186,230,253,1)',
          nodeBright: 'rgba(255,255,255,1)',
          line: 'rgba(59,130,246,0.2)',
          lineBright: 'rgba(56,189,248,0.3)'
        };
  };

  function seededRandom(seed){
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;
    return () => {
      value = value * 16807 % 2147483647;
      return (value - 1) / 2147483646;
    };
  }

  function getSceneSignature(){
    const widthBucket = Math.max(1, Math.round(window.innerWidth / 120));
    const heightBucket = Math.max(1, Math.round(window.innerHeight / 120));
    return `${isMobile() ? 'mobile' : 'desktop'}:${widthBucket}:${heightBucket}`;
  }

  function resize(forceRebuild = false){
    const ratio = Math.min(window.devicePixelRatio || 1, prefersPerformanceMode() ? 1.25 : 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const nextSignature = getSceneSignature();
    if (forceRebuild || sceneSignature !== nextSignature || !nodes.length || !stars.length) {
      sceneSignature = nextSignature;
      createScene();
    }
  }

  function createScene(){
    const perfMode = prefersPerformanceMode();
    const nodeCount = perfMode ? (isMobile() ? 28 : 54) : (isMobile() ? 40 : 72);
    const starCount = perfMode ? (isMobile() ? 90 : 240) : (isMobile() ? 150 : 520);
    const random = seededRandom(Array.from(sceneSignature).reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 17), 97));

    nodes = Array.from({ length: nodeCount }, () => {
      const depth = random();
      return {
        x: random() * width,
        y: random() * height,
        baseX: 0,
        baseY: 0,
        z: depth,
        layer: 0.6 + depth * 1.6,
        size: 0.7 + depth * 2.4,
        driftX: 10 + random() * 10,
        driftY: 10 + random() * 10,
        vx: (random() - 0.5) * (0.05 + depth * 0.08),
        vy: (random() - 0.5) * (0.05 + depth * 0.08),
        pulse: random() * Math.PI * 2,
        phaseX: random() * Math.PI * 2,
        phaseY: random() * Math.PI * 2,
        hotspot: random() > 0.88
      };
    }).map((node) => ({ ...node, baseX: node.x, baseY: node.y }));

    stars = Array.from({ length: starCount }, () => {
      const depth = random();
      const cycleSeconds = 6 + random() * 6;
      return {
        x: random() * width,
        y: random() * height,
        z: depth,
        size: 0.35 + depth * 1.35,
        alpha: 0.22 + random() * 0.52,
        drift: (Math.PI * 2) / cycleSeconds,
        phase: random() * Math.PI * 2,
        orbit: 10 + random() * 10,
        ellipse: 0.7 + random() * 0.6,
        parallax: 0.15 + depth * 0.85
      };
    });
  }

  function rgbaWithAlpha(color, alpha){
    return color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${alpha})`);
  }

  function drawBackdrop(colors){
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, colors.hazeTop);
    gradient.addColorStop(0.5, colors.hazeMid);
    gradient.addColorStop(1, colors.hazeBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const depth = ctx.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, Math.max(width, height) * 0.4);
    depth.addColorStop(0, colors.depthGlow);
    depth.addColorStop(0.55, rgbaWithAlpha(colors.depthGlow, isDarkTheme() ? 0.05 : 0.08));
    depth.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = depth;
    ctx.fillRect(0, 0, width, height);

    const lower = ctx.createRadialGradient(width * 0.5, height * 0.88, 0, width * 0.5, height * 0.88, Math.max(width, height) * 0.18);
    lower.addColorStop(0, colors.lowerGlow);
    lower.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lower;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStars(colors, time){
    const darkTheme = isDarkTheme();
    const lightTheme = !darkTheme;
    const perfMode = prefersPerformanceMode();
    for (const star of stars){
      const orbit = star.orbit * (0.9 + star.z * 0.2);
      const driftX = Math.sin(time * star.drift + star.phase) * orbit;
      const driftY = Math.cos(time * star.drift + star.phase * 0.9) * orbit * star.ellipse;
      const x = star.x + driftX - pointer.x * star.parallax * 2.2;
      const y = star.y + driftY + scrollOffset * star.parallax * 60;
      const twinkle = star.alpha + Math.sin(time * star.drift + star.phase + star.x * 0.01 + star.y * 0.008) * 0.08;
      const alphaFloor = darkTheme ? 0.16 : 0.5;
      const alpha = Math.max(alphaFloor, Math.min(1, twinkle));
      const starSize = darkTheme ? star.size : star.size * 1.18;
      ctx.beginPath();
      ctx.fillStyle = lightTheme
        ? rgbaWithAlpha(colors.starBright, alpha)
        : rgbaWithAlpha(star.z > 0.72 ? colors.starBright : colors.star, alpha);
      ctx.shadowBlur = perfMode
        ? (star.z > 0.76 ? 4 : 0)
        : (star.z > 0.8 ? (darkTheme ? 12 : 16) : (star.z > 0.55 ? (darkTheme ? 4 : 7) : (darkTheme ? 0 : 3)));
      ctx.shadowColor = lightTheme
        ? 'rgba(255,255,255,0.65)'
        : (star.z > 0.8 ? colors.starBright : 'transparent');
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function updateNodes(time){
    pointer.x += (pointer.tx - pointer.x) * 0.035;
    pointer.y += (pointer.ty - pointer.y) * 0.035;

    for (const node of nodes){
      node.baseX += node.vx;
      node.baseY += node.vy;
      node.pulse += 0.012 + node.z * 0.01;

      if (node.baseX < -80) node.baseX = width + 80;
      if (node.baseX > width + 80) node.baseX = -80;
      if (node.baseY < -80) node.baseY = height + 80;
      if (node.baseY > height + 80) node.baseY = -80;

      const floatX = Math.sin(time * (0.18 + node.z * 0.14) + node.phaseX) * node.driftX;
      const floatY = Math.cos(time * (0.16 + node.z * 0.12) + node.phaseY) * node.driftY;
      const parallaxX = -pointer.x * node.layer * 0.9;
      const parallaxY = (-pointer.y * node.layer * 0.65) + scrollOffset * node.layer * 0.35;

      node.x = node.baseX + floatX + parallaxX;
      node.y = node.baseY + floatY + parallaxY;
    }
  }

  function drawConnections(colors, time){
    const perfMode = prefersPerformanceMode();
    const range = perfMode ? (isMobile() ? 110 : 150) : (isMobile() ? 140 : 205);
    const maxLinksPerNode = perfMode ? 3 : 6;
    const rangeSq = range * range;
    const darkTheme = isDarkTheme();
    for (let i = 0; i < nodes.length; i++){
      const a = nodes[i];
      let links = 0;
      for (let j = i + 1; j < nodes.length; j++){
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq > rangeSq) continue;
        const distance = Math.sqrt(distanceSq);

        const depth = (a.z + b.z) * 0.5;
        const alphaBase = darkTheme ? 0.24 : 0.14;
        const shimmer = 0.72 + (Math.sin(time * (1.2 + depth) + i * 0.7 + j * 0.33) + 1) * 0.22;
        const flicker = Math.sin(time * (5.2 + depth * 2.4) + i * 0.9 + j * 0.7) > 0.96 ? 1.45 : 1;
        const alpha = (1 - distance / range) * alphaBase * (0.7 + depth * 0.9) * shimmer * flicker;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (!perfMode) {
          const dashA = 2 + depth * 4;
          const dashB = 8 + depth * 12;
          const dashSpan = dashA + dashB;
          ctx.setLineDash([dashA, dashB]);
          ctx.lineDashOffset = -((time * (18 + depth * 22)) % dashSpan);
        }
        ctx.lineWidth = 0.45 + depth * (darkTheme ? 0.72 : 0.46);
        ctx.strokeStyle = rgbaWithAlpha(depth > 0.62 ? colors.lineBright : colors.line, alpha);
        ctx.shadowBlur = perfMode ? 0 : (shimmer > 1 ? 8 + depth * 8 : 0);
        ctx.shadowColor = rgbaWithAlpha(colors.lineBright, alpha * 0.9);
        ctx.stroke();
        if (!perfMode) {
          ctx.setLineDash([]);
        }
        links++;

        const signalStrength = (1 - distance / range) * depth;
        if (!perfMode && signalStrength > 0.28) {
          const signal = (time * (0.18 + depth * 0.2) + i * 0.17 + j * 0.11) % 1;
          const glowX = a.x + (b.x - a.x) * signal;
          const glowY = a.y + (b.y - a.y) * signal;
          const glowAlpha = Math.min(0.9, 0.24 + signalStrength * 0.9);
          ctx.beginPath();
          ctx.fillStyle = rgbaWithAlpha(colors.nodeBright, glowAlpha);
          ctx.shadowBlur = 12 + depth * 20;
          ctx.shadowColor = rgbaWithAlpha(colors.lineBright, glowAlpha);
          ctx.arc(glowX, glowY, 0.8 + depth * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        if (links >= maxLinksPerNode) break;
      }
    }
  }

  function drawNodes(colors, time){
    const darkTheme = isDarkTheme();
    const perfMode = prefersPerformanceMode();
    for (const node of nodes){
      const pulse = (Math.sin(node.pulse + time * 0.65) + 1) * 0.5;
      const radius = node.size * (0.8 + pulse * 0.28 + node.z * 0.18);
      const alpha = 0.38 + node.z * 0.42 + (node.hotspot ? 0.12 : 0);
      const fill = node.hotspot ? colors.nodeBright : (node.z > 0.62 ? colors.nodeBright : colors.node);
      const glow = node.hotspot ? 28 + node.z * 18 : 8 + node.z * 12;

      ctx.beginPath();
      ctx.fillStyle = rgbaWithAlpha(fill, Math.min(alpha, 1));
      ctx.shadowBlur = perfMode ? Math.min(8, glow * 0.4) : glow;
      ctx.shadowColor = rgbaWithAlpha(fill, darkTheme ? 0.9 : 0.75);
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render(now = performance.now()){
    if (!backgroundAnimationEnabled) {
      animationFrame = 0;
      return;
    }
    const targetFrameMs = prefersPerformanceMode() ? 33 : 16;
    if (lastFrameTime && (now - lastFrameTime) < targetFrameMs) {
      animationFrame = requestAnimationFrame(render);
      return;
    }
    lastFrameTime = now;

    const colors = palette();
    const time = now * 0.001;
    ctx.clearRect(0, 0, width, height);
    drawBackdrop(colors);
    drawStars(colors, time);
    updateNodes(time);
    drawConnections(colors, time);
    drawNodes(colors, time);
    animationFrame = requestAnimationFrame(render);
  }

  resize(true);
  if (backgroundAnimationEnabled) {
    render();
  }

  const refresh = (forceRebuild = false) => {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastFrameTime = 0;
    resize(forceRebuild);
    if (backgroundAnimationEnabled) {
      render();
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };

  window.addEventListener('resize', () => refresh(), { passive: true });

  window.addEventListener('pointermove', (event) => {
    pointer.tx = (event.clientX / Math.max(width, 1) - 0.5) * 2;
    pointer.ty = (event.clientY / Math.max(height, 1) - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointer.tx = 0;
    pointer.ty = 0;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollOffset = Math.max(-0.35, Math.min(0.35, window.scrollY / Math.max(height * 1.8, 1)));
  }, { passive: true });

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'data-theme')) {
      refresh(false);
    }
  });

  observer.observe(document.documentElement, { attributes: true });

  window.addEventListener('cyber:bg-animation-change', (event) => {
    if (reducedMotion) {
      backgroundAnimationEnabled = false;
      refresh(false);
      return;
    }
    backgroundAnimationEnabled = Boolean(event.detail?.enabled);
    refresh(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      return;
    }
    if (backgroundAnimationEnabled && !animationFrame) {
      lastFrameTime = 0;
      animationFrame = requestAnimationFrame(render);
    }
  });
})();
