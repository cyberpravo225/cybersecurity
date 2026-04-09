(function(){
  if (!window.initCyberBackgroundMode) {
    window.initCyberBackgroundMode = function initCyberBackgroundMode() {
      if (window.__cyberBackgroundModeInitialized) return;
      window.__cyberBackgroundModeInitialized = true;
      const root = document.documentElement;
      const body = document.body;
      if (!body) return;
      const storageKey = 'cyber_bg_mode';
      const style = document.createElement('style');
      style.textContent = `
        body{position:relative;isolation:isolate;}
        body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:radial-gradient(900px 550px at 10% 8%, color-mix(in srgb, var(--accent, #2dd4bf) 30%, transparent), transparent 70%),radial-gradient(900px 620px at 90% 10%, color-mix(in srgb, var(--accent-2, #60a5fa) 28%, transparent), transparent 72%);opacity:.55;transform:translate3d(0,0,0)}
        :root[data-bg-mode="animated"] body::before{animation:bgDrift 18s ease-in-out infinite alternate}
        :root[data-bg-mode="static"] body::before{animation:none}
        :root[data-bg-mode="static"] .theme-network{display:none !important}
        :root[data-bg-mode="static"] .theme-grid,:root[data-bg-mode="static"] .theme-orb{animation:none !important}
        .bg-mode-toggle{position:fixed;left:16px;bottom:16px;z-index:9999;border:1px solid rgba(255,255,255,.28);border-radius:999px;padding:10px 14px;background:rgba(7,13,34,.82);color:#fff;cursor:pointer;backdrop-filter:blur(4px);font-size:14px;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.35);transition:transform .2s ease,opacity .2s ease}
        .bg-mode-toggle:hover{transform:translateY(-1px)}
        @keyframes bgDrift{0%{transform:translate3d(0,0,0) scale(1)}100%{transform:translate3d(0,-2%,0) scale(1.04)}}
        @media (prefers-reduced-motion: reduce){:root[data-bg-mode="animated"] body::before{animation:none}}
      `;
      document.head.appendChild(style);
      root.setAttribute('data-bg-mode', localStorage.getItem(storageKey) === 'static' ? 'static' : 'animated');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'bg-mode-toggle';
      button.setAttribute('aria-label', 'Переключить режим фоновой анимации');
      const refresh = () => {
        const isAnimated = root.getAttribute('data-bg-mode') !== 'static';
        button.textContent = isAnimated ? '🌌 Фон: аним.' : '🖼️ Фон: статич.';
        button.style.opacity = isAnimated ? '1' : '.82';
      };
      button.addEventListener('click', () => {
        const next = root.getAttribute('data-bg-mode') === 'static' ? 'animated' : 'static';
        root.setAttribute('data-bg-mode', next);
        localStorage.setItem(storageKey, next);
        refresh();
      });
      body.appendChild(button);
      refresh();
    };
  }
  window.initCyberBackgroundMode();
})();

(function () {
  const SUPABASE_URL = 'https://vpnxkfpwmieerfaqijot.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwbnhrZnB3bWllZXJmYXFpam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzQ0NTIsImV4cCI6MjA5MDgxMDQ1Mn0.ImmCQUziNbBOkwZ2u3eaJu2DrLTmaKyWvUttUKKfckg';
  const AUTH_LOCAL_KEY = 'cyber_auth_local';
  const AUTH_SESSION_KEY = 'cyber_auth_session';

  function createClient(remember = true) {
    if (!window.supabase?.createClient) {
      throw new Error('Библиотека Supabase не загрузилась.');
    }
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: remember ? localStorage : sessionStorage,
        storageKey: remember ? AUTH_LOCAL_KEY : AUTH_SESSION_KEY
      }
    });
  }

  async function getCurrentSession() {
    for (const remember of [true, false]) {
      const sb = createClient(remember);
      const { data, error } = await sb.auth.getSession();
      if (error) continue;
      if (data?.session?.user) return { sb, user: data.session.user };
    }
    return null;
  }

  async function getProfile(sb, userId) {
    const { data, error } = await sb
      .from('profiles')
      .select('username,nickname,birth_date,age_group,avatar_url,country')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  function calculateAgeFromBirthDate(birthDate) {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return age >= 0 ? age : null;
  }

  function getAgeGroup(age) {
    if (age === null || age === undefined) return null;
    if (age < 10) return 'blocked';
    if (age < 16) return '10-16';
    return '16+';
  }

  async function requireAuth({ redirectTo = 'auth.html', message = 'Требуется авторизация.' } = {}) {
    const session = await getCurrentSession();
    if (session?.user) return session;
    const target = `${redirectTo}?reason=${encodeURIComponent(message)}&next=${encodeURIComponent(location.pathname + location.hash)}`;
    window.location.replace(target);
    throw new Error(message);
  }

  window.CyberSupabaseAuth = {
    createClient,
    getCurrentSession,
    getProfile,
    calculateAgeFromBirthDate,
    getAgeGroup,
    requireAuth
  };
})();
