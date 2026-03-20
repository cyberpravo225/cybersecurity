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
  });
}
   // закрытие меню при клике вне него
document.addEventListener('click', (e) => {
  if (!navList.classList.contains('open')) return;

  if (!navList.contains(e.target) && !menuToggle.contains(e.target)) {
    navList.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.classList.remove('is-open');
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
  navList.classList.remove('open');
  menuToggle.classList.remove('is-open');
}
    }
  });
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
img: "assets/tip1.jpg"
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
}
];


/* =========================
   Совет дня (главная)
========================= */

/* считаем дни с запуска проекта */

const startDate = new Date("2026-03-10"); 
const today = new Date();

const diffTime = today - startDate;
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

const todayIndex = diffDays % tips.length;
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

for(let i = 0; i < todayIndex; i++){

const tip = tips[i];

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
const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("visible")

}

})

},{
threshold:0.15
})

document.querySelectorAll(".reveal").forEach(el=>{
observer.observe(el)
})

/* =========================
   Premium theme network background
   ========================= */
(function(){
  const canvas = document.getElementById('theme-network');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let nodes = [];
  let stars = [];
  let sceneSignature = '';

  const isDarkTheme = () => document.documentElement.getAttribute('data-theme') === 'dark';
  const isMobile = () => window.innerWidth < 720;

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
          star: 'rgba(191,219,254,0.72)',
          starBright: 'rgba(255,255,255,1)',
          node: 'rgba(224,242,254,0.96)',
          nodeBright: 'rgba(255,255,255,1)',
          line: 'rgba(148,163,184,0.12)',
          lineBright: 'rgba(125,211,252,0.2)'
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
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
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
    const nodeCount = isMobile() ? 48 : 96;
    const starCount = isMobile() ? 420 : 1100;
    const random = seededRandom(Array.from(sceneSignature).reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 17), 97));

    nodes = Array.from({ length: nodeCount }, () => {
      const depth = random();
      return {
        x: random() * width,
        y: random() * height,
        z: depth,
        size: 0.7 + depth * 2.4,
        vx: (random() - 0.5) * (0.08 + depth * 0.14),
        vy: (random() - 0.5) * (0.06 + depth * 0.12),
        pulse: random() * Math.PI * 2,
        hotspot: random() > 0.88
      };
    });

    stars = Array.from({ length: starCount }, () => {
      const depth = random();
      return {
        x: random() * width,
        y: random() * height,
        z: depth,
        size: 0.35 + depth * 1.35,
        alpha: 0.22 + random() * 0.52,
        drift: 0.25 + random() * 0.7
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
    for (const star of stars){
      const twinkle = star.alpha + Math.sin(time * star.drift + star.x * 0.01 + star.y * 0.008) * 0.08;
      const alpha = Math.max(0.16, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.fillStyle = rgbaWithAlpha(star.z > 0.72 ? colors.starBright : colors.star, alpha);
      ctx.shadowBlur = star.z > 0.8 ? 12 : (star.z > 0.55 ? 4 : 0);
      ctx.shadowColor = star.z > 0.8 ? colors.starBright : 'transparent';
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function updateNodes(time){
    for (const node of nodes){
      const parallaxShift = Math.sin(time * (0.18 + node.z * 0.22) + node.pulse) * (0.08 + node.z * 0.22);
      node.x += node.vx + parallaxShift * 0.02;
      node.y += node.vy + Math.cos(time * 0.16 + node.pulse) * 0.015;
      node.pulse += 0.012 + node.z * 0.01;

      if (node.x < -60) node.x = width + 60;
      if (node.x > width + 60) node.x = -60;
      if (node.y < -60) node.y = height + 60;
      if (node.y > height + 60) node.y = -60;
    }
  }

  function drawConnections(colors){
    const range = isMobile() ? 150 : 220;
    for (let i = 0; i < nodes.length; i++){
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++){
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance > range) continue;

        const depth = (a.z + b.z) * 0.5;
        const alphaBase = isDarkTheme() ? 0.24 : 0.14;
        const alpha = (1 - distance / range) * alphaBase * (0.7 + depth * 0.9);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = 0.45 + depth * (isDarkTheme() ? 0.72 : 0.46);
        ctx.strokeStyle = rgbaWithAlpha(depth > 0.62 ? colors.lineBright : colors.line, alpha);
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    }
  }

  function drawNodes(colors, time){
    for (const node of nodes){
      const pulse = (Math.sin(node.pulse + time * 0.65) + 1) * 0.5;
      const radius = node.size * (0.8 + pulse * 0.28 + node.z * 0.18);
      const alpha = 0.38 + node.z * 0.42 + (node.hotspot ? 0.12 : 0);
      const fill = node.hotspot ? colors.nodeBright : (node.z > 0.62 ? colors.nodeBright : colors.node);
      const glow = node.hotspot ? 28 + node.z * 18 : 8 + node.z * 12;

      ctx.beginPath();
      ctx.fillStyle = rgbaWithAlpha(fill, Math.min(alpha, 1));
      ctx.shadowBlur = glow;
      ctx.shadowColor = rgbaWithAlpha(fill, isDarkTheme() ? 0.9 : 0.75);
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function render(){
    const colors = palette();
    const time = performance.now() * 0.001;
    ctx.clearRect(0, 0, width, height);
    drawBackdrop(colors);
    drawStars(colors, time);
    updateNodes(time);
    drawConnections(colors);
    drawNodes(colors, time);
    animationFrame = requestAnimationFrame(render);
  }

  resize(true);
  render();

  const refresh = (forceRebuild = false) => {
    cancelAnimationFrame(animationFrame);
    resize(forceRebuild);
    render();
  };

  window.addEventListener('resize', () => refresh(), { passive: true });

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'data-theme')) {
      refresh(false);
    }
  });

  observer.observe(document.documentElement, { attributes: true });
})();
