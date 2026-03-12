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
