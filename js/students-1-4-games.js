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
    roundNumber: 0,
    roundsOrder: [],
    currentRound: null,
    passwordValue: ''
  };

  const SAFE_LINK_ROUNDS_TOTAL = 10;

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
    },
    {
      links: [
        { url: 'https://kids-museum.city', safe: true, reason: 'Официальный HTTPS-адрес сайта музея без подмен.' },
        { url: 'https://kids-museum.city.security-check.page', safe: false, reason: 'Домен security-check.page маскируется под музей.' },
        { url: 'http://kids-museum.city', safe: false, reason: 'Нет HTTPS-защиты соединения.' },
        { url: 'https://klds-museum.city', safe: false, reason: 'Подмена i на l в названии домена.' },
        { url: 'https://kids-museum-city-login.com', safe: false, reason: 'Фишинговое слово login в стороннем домене.' }
      ]
    },
    {
      links: [
        { url: 'https://school-olympiad.org', safe: true, reason: 'Прямой адрес олимпиады с HTTPS.' },
        { url: 'https://school-olympiad.org.gift-prize.site', safe: false, reason: 'Реальный домен gift-prize.site, а не olympiad.org.' },
        { url: 'http://school-olympiad.org', safe: false, reason: 'HTTP без шифрования.' },
        { url: 'https://school-0lympiad.org', safe: false, reason: 'Буква o заменена цифрой 0.' },
        { url: 'https://olympiad-fast-win.net', safe: false, reason: 'Подозрительные слова fast-win в адресе.' }
      ]
    },
    {
      links: [
        { url: 'https://library.kids-reading.ru', safe: true, reason: 'Корректный поддомен библиотеки с HTTPS.' },
        { url: 'https://library.kids-reading.ru.sign-in.help', safe: false, reason: 'Настоящий домен sign-in.help.' },
        { url: 'http://library.kids-reading.ru', safe: false, reason: 'Небезопасный HTTP-протокол.' },
        { url: 'https://library.kids-readlng.ru', safe: false, reason: 'Подмена буквы i на l в слове reading.' },
        { url: 'https://kids-reading-bonus.ru', safe: false, reason: 'Сомнительный бонусный домен.' }
      ]
    },
    {
      links: [
        { url: 'https://edu-games.school', safe: true, reason: 'Нормальный адрес образовательной платформы.' },
        { url: 'https://edu-games.school.secure-user-login.com', safe: false, reason: 'Реальный домен secure-user-login.com.' },
        { url: 'http://edu-games.school', safe: false, reason: 'Сайт без HTTPS.' },
        { url: 'https://edu-garnes.school', safe: false, reason: 'Буква m подменена сочетанием rn.' },
        { url: 'https://free-edu-games-gift.fun', safe: false, reason: 'Слишком рекламный и подозрительный адрес.' }
      ]
    },
    {
      links: [
        { url: 'https://school-video.lessons.ru', safe: true, reason: 'Официальный адрес уроков со шифрованием.' },
        { url: 'https://school-video.lessons.ru.account-safe.xyz', safe: false, reason: 'Домен xyz скрывает подделку.' },
        { url: 'http://school-video.lessons.ru', safe: false, reason: 'Нет HTTPS.' },
        { url: 'https://school-vldeo.lessons.ru', safe: false, reason: 'Подмена i на l в слове video.' },
        { url: 'https://lessons-superreward.ru', safe: false, reason: 'Подозрительное слово reward в домене.' }
      ]
    },
    {
      links: [
        { url: 'https://class-chat.schoolnet.ru', safe: true, reason: 'Стандартный школьный сервис с HTTPS.' },
        { url: 'https://class-chat.schoolnet.ru.confirm-data.page', safe: false, reason: 'Домен confirm-data.page выдаёт себя за школу.' },
        { url: 'http://class-chat.schoolnet.ru', safe: false, reason: 'Отсутствует HTTPS.' },
        { url: 'https://class-chat.schooInet.ru', safe: false, reason: 'Подмена l на I в слове schoolnet.' },
        { url: 'https://chat-schoolnet-win.click', safe: false, reason: 'Сомнительный домен с click.' }
      ]
    },
    {
      links: [
        { url: 'https://kids-weather.app', safe: true, reason: 'Короткий читаемый HTTPS-адрес.' },
        { url: 'https://kids-weather.app.check-profile.top', safe: false, reason: 'Настоящий домен check-profile.top.' },
        { url: 'http://kids-weather.app', safe: false, reason: 'Незащищённый протокол.' },
        { url: 'https://klds-weather.app', safe: false, reason: 'Подмена i на l в слове kids.' },
        { url: 'https://kids-weather-prize.top', safe: false, reason: 'Слово prize в адресе часто у мошенников.' }
      ]
    },
    {
      links: [
        { url: 'https://art-for-kids.studio', safe: true, reason: 'Официальный домен без лишних вставок.' },
        { url: 'https://art-for-kids.studio.safe-auth.space', safe: false, reason: 'Поддельный домен safe-auth.space.' },
        { url: 'http://art-for-kids.studio', safe: false, reason: 'HTTP без шифрования.' },
        { url: 'https://art-f0r-kids.studio', safe: false, reason: 'Буква o заменена цифрой 0.' },
        { url: 'https://art-kids-bonus.space', safe: false, reason: 'Подозрительный «bonus» адрес.' }
      ]
    },
    {
      links: [
        { url: 'https://school-calendar.edu.ru', safe: true, reason: 'Надёжный образовательный домен с HTTPS.' },
        { url: 'https://school-calendar.edu.ru.login-safe.one', safe: false, reason: 'Настоящий домен login-safe.one.' },
        { url: 'http://school-calendar.edu.ru', safe: false, reason: 'Небезопасное подключение.' },
        { url: 'https://school-caIendar.edu.ru', safe: false, reason: 'Подмена l на I в слове calendar.' },
        { url: 'https://edu-calendar-reward.ru', safe: false, reason: 'Сомнительное слово reward в адресе.' }
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
    state.roundNumber = 0;
    state.roundsOrder = [];
    state.passwordValue = '';
  }

  function renderGame(gameId) {
    content.innerHTML = '';
    if (gameId === 'safe-link') {
      title.textContent = 'Найди безопасную ссылку';
      state.correctAnswers = 0;
      state.roundNumber = 0;
      state.roundsOrder = shuffle(safeLinksRounds).slice(0, SAFE_LINK_ROUNDS_TOTAL);
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
    if (state.roundNumber >= SAFE_LINK_ROUNDS_TOTAL) {
      renderSafeLinkResult();
      return;
    }

    const round = state.roundsOrder[state.roundNumber];
    state.currentRound = {
      links: shuffle(round.links),
      selected: null,
      answered: false
    };

    const wrapper = document.createElement('section');
    wrapper.className = 'game-panel';

    wrapper.innerHTML = `
      <p class="game-subtitle">Выбери ссылку, которую безопаснее всего открыть.</p>
      <p class="game-score">Раунд <strong>${state.roundNumber + 1}/${SAFE_LINK_ROUNDS_TOTAL}</strong> · Правильных ответов: <strong>${state.correctAnswers}</strong></p>
      <div class="game-links" id="game-links"></div>
      <div class="game-feedback" id="game-link-feedback" aria-live="polite"></div>
      <button class="game-button" type="button" id="game-next-round" disabled>${state.roundNumber + 1 === SAFE_LINK_ROUNDS_TOTAL ? 'Показать результат' : 'Следующий раунд'}</button>
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
          if (isSafe) {
            card.classList.add('game-correct');
          }
          if (card.textContent === link.url && !link.safe) {
            card.classList.add('game-incorrect', 'game-picked-wrong');
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
      state.roundNumber += 1;
      renderSafeLinkRound();
    });
  }

  function renderSafeLinkResult() {
    const percent = Math.round((state.correctAnswers / SAFE_LINK_ROUNDS_TOTAL) * 100);
    let message = 'Хорошая работа!';
    if (percent === 100) message = 'Отлично! Ты мастер безопасных ссылок!';
    else if (percent < 50) message = 'Неплохо для начала — потренируйся ещё немного!';

    const wrapper = document.createElement('section');
    wrapper.className = 'game-panel';
    wrapper.innerHTML = `
      <p class="game-subtitle">Игра завершена.</p>
      <p class="game-score">Результат: <strong>${state.correctAnswers} из ${SAFE_LINK_ROUNDS_TOTAL}</strong> (${percent}%)</p>
      <div class="game-feedback" aria-live="polite">
        <p><strong>${message}</strong></p>
        <p>Нажми кнопку ниже, чтобы пройти 10 раундов заново.</p>
      </div>
      <button class="game-button" type="button" id="game-restart-rounds">Играть снова</button>
    `;

    content.innerHTML = '';
    content.appendChild(wrapper);

    wrapper.querySelector('#game-restart-rounds')?.addEventListener('click', () => {
      state.correctAnswers = 0;
      state.roundNumber = 0;
      state.roundsOrder = shuffle(safeLinksRounds).slice(0, SAFE_LINK_ROUNDS_TOTAL);
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
