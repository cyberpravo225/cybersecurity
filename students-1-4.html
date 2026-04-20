/* students-1-4-games.js
   Две мини-игры для страницы students-1-4.html
   - Найди безопасную ссылку
   - Создай сильный пароль
   Код изолирован в IIFE, без глобальных переменных.
*/
(function () {
  const page = document.body?.dataset?.page;
  if (page !== 'students-1-4') return;

  const overlay = document.getElementById('game-overlay');
  const modal = document.getElementById('game-modal');
  const content = document.getElementById('game-modal-content');
  const title = document.getElementById('game-modal-title');
  const closeBtn = document.getElementById('game-close-btn');
  const backBtn = document.getElementById('game-back-btn');
  const gameCards = document.querySelectorAll('.senior-card.game');

  if (!overlay || !modal || !content || !title || !closeBtn || !backBtn || !gameCards.length) return;

  const state = {
    activeGame: null,
    correctAnswers: 0,
    currentRound: null,
    passwordValue: ''
  };

  const safeLinksRounds = [
    {
      links: [
        { url: 'https://secure-school-library.edu', safe: true, reason: 'HTTPS и официальный домен образовательного учреждения.' },
        { url: 'http://secure-school-library-login.help', safe: false, reason: 'Нет HTTPS и подозрительный адрес с похожим названием.' },
        { url: 'https://secure-school-library.edu.verify-now.org', safe: false, reason: 'Настоящий домен скрыт внутри длинного поддомена.' },
        { url: 'https://secure-sch00l-library.edu', safe: false, reason: 'Подмена букв и цифр — частый признак фишинга.' },
        { url: 'https://school-library-urgent-check.com', safe: false, reason: 'Маркетинговый/тревожный домен не связан со школой.' }
      ]
    },
    {
      links: [
        { url: 'https://kids-news.example.org', safe: true, reason: 'Корректный HTTPS-адрес без лишних символов и подмен.' },
        { url: 'https://kids-news.example.org.secure-signin.site', safe: false, reason: 'Основной домен на самом деле secure-signin.site.' },
        { url: 'http://kids-news-example.org', safe: false, reason: 'HTTP без шифрования и изменённое имя сайта.' },
        { url: 'https://kids-news-examp1e.org', safe: false, reason: 'Буква l заменена цифрой 1.' },
        { url: 'https://news-kids-bonus-click.net', safe: false, reason: 'Подозрительный призыв «bonus-click» в домене.' }
      ]
    },
    {
      links: [
        { url: 'https://portal.classroom-online.ru', safe: true, reason: 'Нормальный защищённый адрес школьного портала.' },
        { url: 'https://portal.classroom-online.ru.login-access.info', safe: false, reason: 'Сервис login-access.info маскируется под портал.' },
        { url: 'http://portal.classroom-online.ru', safe: false, reason: 'Нет HTTPS — данные могут быть перехвачены.' },
        { url: 'https://portal-classroom-online.ru-confirm.com', safe: false, reason: 'Лишние слова в домене и подмена структуры адреса.' },
        { url: 'https://classroom-onIine.ru', safe: false, reason: 'Подмена латинской l на I делает адрес обманчивым.' }
      ]
    }
  ];

  const passwordParts = {
    upper: ['A', 'B', 'D', 'K', 'M', 'R'],
    lower: ['a', 'e', 'g', 'm', 'r', 'y'],
    digit: ['2', '4', '6', '7', '8', '9'],
    symbol: ['!', '@', '#', '$', '%', '&', '?']
  };

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function openModal(gameId) {
    state.activeGame = gameId;
    overlay.hidden = false;
    modal.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      modal.classList.add('is-open');
    });

    renderGame(gameId);
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    modal.classList.remove('is-open');

    setTimeout(() => {
      overlay.hidden = true;
      modal.hidden = true;
      resetState();
      content.innerHTML = '';
      title.textContent = 'Игра';
    }, 180);
  }

  function resetState() {
    state.activeGame = null;
    state.currentRound = null;
    state.correctAnswers = 0;
    state.passwordValue = '';
  }

  function renderGame(gameId) {
    content.innerHTML = '';
    if (gameId === 'safe-link') {
      title.textContent = 'Найди безопасную ссылку';
      state.correctAnswers = 0;
      renderSafeLinkRound();
      return;
    }

    if (gameId === 'strong-password') {
      title.textContent = 'Создай сильный пароль';
      state.passwordValue = '';
      renderPasswordGame();
    }
  }

  function renderSafeLinkRound() {
    const round = safeLinksRounds[Math.floor(Math.random() * safeLinksRounds.length)];
    state.currentRound = {
      links: shuffle(round.links),
      selected: null,
      answered: false
    };

    const wrapper = document.createElement('section');
    wrapper.className = 'game-panel';

    wrapper.innerHTML = `
      <p class="game-subtitle">Выбери ссылку, которую безопаснее всего открыть.</p>
      <p class="game-score">Правильных ответов: <strong>${state.correctAnswers}</strong></p>
      <div class="game-links" id="game-links"></div>
      <div class="game-feedback" id="game-link-feedback" aria-live="polite"></div>
      <button class="game-button" type="button" id="game-next-round" disabled>Следующий раунд</button>
    `;

    content.appendChild(wrapper);

    const linksEl = wrapper.querySelector('#game-links');
    const feedbackEl = wrapper.querySelector('#game-link-feedback');
    const nextBtn = wrapper.querySelector('#game-next-round');

    state.currentRound.links.forEach((link) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'game-link-card';
      btn.dataset.safe = String(link.safe);
      btn.textContent = link.url;

      btn.addEventListener('click', () => {
        if (state.currentRound.answered) return;
        state.currentRound.answered = true;
        state.currentRound.selected = link;

        linksEl.querySelectorAll('.game-link-card').forEach((card) => {
          const isSafe = card.dataset.safe === 'true';
          card.disabled = true;
          card.classList.add(isSafe ? 'game-correct' : 'game-incorrect');

          if (card.textContent === link.url && !link.safe) {
            card.classList.add('game-picked-wrong');
          }
        });

        if (link.safe) {
          state.correctAnswers += 1;
          feedbackEl.innerHTML = `<p><strong>Верно!</strong> ${link.reason}</p>`;
        } else {
          const safeOption = state.currentRound.links.find((item) => item.safe);
          feedbackEl.innerHTML = `<p><strong>Почти!</strong> ${link.reason}</p><p>Безопасный вариант: <span class="game-inline-safe">${safeOption.url}</span>. ${safeOption.reason}</p>`;
        }

        nextBtn.disabled = false;
      });

      linksEl.appendChild(btn);
    });

    nextBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      renderSafeLinkRound();
    });
  }

  function evaluatePassword(password) {
    const checks = {
      length: password.length >= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    let label = 'Слабый';
    if (score >= 5) label = 'Сильный';
    else if (score >= 3) label = 'Средний';

    return { checks, score, label };
  }

  function randomFrom(list, count) {
    return shuffle(list).slice(0, count);
  }

  function buildPool() {
    return shuffle([
      ...randomFrom(passwordParts.upper, 4),
      ...randomFrom(passwordParts.lower, 4),
      ...randomFrom(passwordParts.digit, 4),
      ...randomFrom(passwordParts.symbol, 4)
    ]);
  }

  function generateStrongPassword() {
    const arr = [
      ...randomFrom(passwordParts.upper, 3),
      ...randomFrom(passwordParts.lower, 4),
      ...randomFrom(passwordParts.digit, 3),
      ...randomFrom(passwordParts.symbol, 3)
    ];
    return shuffle(arr).join('');
  }

  function renderPasswordGame() {
    const wrapper = document.createElement('section');
    wrapper.className = 'game-panel';

    wrapper.innerHTML = `
      <p class="game-subtitle">Собери пароль: нажимай на символы или используй генератор.</p>
      <div class="game-password-box" id="game-password-output" aria-live="polite">Пароль: <span>—</span></div>

      <div class="game-password-controls">
        <button class="game-button" type="button" id="game-password-check">Проверить</button>
        <button class="game-button game-button-secondary" type="button" id="game-password-clear">Очистить</button>
        <button class="game-button game-button-secondary" type="button" id="game-password-generate">Сгенерировать пароль</button>
      </div>

      <div class="game-password-pool" id="game-password-pool"></div>

      <div class="game-strength-wrap">
        <div class="game-strength-bar"><span id="game-strength-fill"></span></div>
        <p class="game-strength-text" id="game-strength-text">Уровень: —</p>
      </div>

      <ul class="game-checks" id="game-checks">
        <li data-check="length">Минимум 12 символов</li>
        <li data-check="upper">Есть заглавные буквы</li>
        <li data-check="lower">Есть строчные буквы</li>
        <li data-check="digit">Есть цифры</li>
        <li data-check="symbol">Есть спецсимволы</li>
      </ul>
    `;

    content.appendChild(wrapper);

    const output = wrapper.querySelector('#game-password-output span');
    const pool = wrapper.querySelector('#game-password-pool');
    const checkBtn = wrapper.querySelector('#game-password-check');
    const clearBtn = wrapper.querySelector('#game-password-clear');
    const generateBtn = wrapper.querySelector('#game-password-generate');
    const fill = wrapper.querySelector('#game-strength-fill');
    const strengthText = wrapper.querySelector('#game-strength-text');
    const checksList = wrapper.querySelector('#game-checks');

    buildPool().forEach((char) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'game-char';
      btn.dataset.char = char;
      btn.textContent = char;
      btn.addEventListener('click', () => {
        state.passwordValue += char;
        output.textContent = state.passwordValue;
      });
      pool.appendChild(btn);
    });

    clearBtn.addEventListener('click', () => {
      state.passwordValue = '';
      output.textContent = '—';
      fill.style.width = '0%';
      fill.className = '';
      strengthText.textContent = 'Уровень: —';
      checksList.querySelectorAll('li').forEach((item) => item.classList.remove('is-ok'));
    });

    generateBtn.addEventListener('click', () => {
      state.passwordValue = generateStrongPassword();
      output.textContent = state.passwordValue;
    });

    checkBtn.addEventListener('click', () => {
      const result = evaluatePassword(state.passwordValue);
      const percent = Math.round((result.score / 5) * 100);

      fill.style.width = `${percent}%`;
      fill.className = result.label === 'Сильный'
        ? 'is-strong'
        : result.label === 'Средний'
          ? 'is-medium'
          : 'is-weak';

      strengthText.textContent = `Уровень: ${result.label}`;

      checksList.querySelectorAll('li').forEach((item) => {
        const checkName = item.dataset.check;
        item.classList.toggle('is-ok', Boolean(result.checks[checkName]));
      });
    });
  }

  function resolveGameId(card) {
    const heading = card.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
    if (heading.includes('безопасную ссылку')) return 'safe-link';
    if (heading.includes('сильный пароль')) return 'strong-password';
    return null;
  }

  gameCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      const gameId = resolveGameId(card);
      if (!gameId) return;
      openModal(gameId);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
})();
