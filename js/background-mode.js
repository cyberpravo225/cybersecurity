(function(){
  if (window.__cyberBackgroundModeInitialized) return;
  window.__cyberBackgroundModeInitialized = true;

  const STORAGE_KEY = 'cyber_bg_mode';
  const root = document.documentElement;
  const body = document.body;
  if (!body) return;

  const style = document.createElement('style');
  style.textContent = `
    body{position:relative;isolation:isolate;}
    body::before{
      content:"";
      position:fixed;
      inset:0;
      pointer-events:none;
      z-index:-1;
      background:
        radial-gradient(900px 550px at 10% 8%, color-mix(in srgb, var(--accent, #2dd4bf) 30%, transparent), transparent 70%),
        radial-gradient(900px 620px at 90% 10%, color-mix(in srgb, var(--accent-2, #60a5fa) 28%, transparent), transparent 72%);
      opacity:.55;
      transform:translate3d(0,0,0);
    }
    :root[data-bg-mode="animated"] body::before{
      animation:bgDrift 18s ease-in-out infinite alternate;
    }
    :root[data-bg-mode="static"] body::before{animation:none;}

    :root[data-bg-mode="static"] .theme-network{display:none !important;}
    :root[data-bg-mode="static"] .theme-grid,
    :root[data-bg-mode="static"] .theme-orb{animation:none !important;}

    .bg-mode-toggle{
      position:fixed; left:16px; bottom:16px; z-index:9999;
      border:1px solid rgba(255,255,255,.28); border-radius:999px;
      padding:10px 14px; background:rgba(7,13,34,.82); color:#fff;
      cursor:pointer; backdrop-filter:blur(4px); font-size:14px; font-weight:600;
      box-shadow:0 8px 28px rgba(0,0,0,.35);
      transition:transform .2s ease, opacity .2s ease;
    }
    .bg-mode-toggle:hover{transform:translateY(-1px);}

    @keyframes bgDrift {
      0% {transform:translate3d(0,0,0) scale(1);} 
      100% {transform:translate3d(0,-2%,0) scale(1.04);} 
    }

    @media (prefers-reduced-motion: reduce){
      :root[data-bg-mode="animated"] body::before{animation:none;}
    }
  `;
  document.head.appendChild(style);

  const saved = localStorage.getItem(STORAGE_KEY);
  const initialMode = saved === 'static' ? 'static' : 'animated';
  root.setAttribute('data-bg-mode', initialMode);

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
    const current = root.getAttribute('data-bg-mode') === 'static' ? 'static' : 'animated';
    const next = current === 'animated' ? 'static' : 'animated';
    root.setAttribute('data-bg-mode', next);
    localStorage.setItem(STORAGE_KEY, next);
    refresh();
  });

  body.appendChild(button);
  refresh();
})();
