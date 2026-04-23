(function initStudents58Practice() {
  const cards = Array.from(document.querySelectorAll('[data-practice]'));
  const overlay = document.getElementById('practice-overlay');
  const modal = document.getElementById('practice-modal');
  const title = document.getElementById('practice-modal-title');
  const content = document.getElementById('practice-modal-content');
  const closeBtn = document.getElementById('practice-close-btn');
  const backBtn = document.getElementById('practice-back-btn');

  if (!cards.length || !overlay || !modal || !title || !content || !closeBtn || !backBtn) {
    return;
  }

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const mailCases = [
    {
      from: 'security@instagrarn-help.net',
      subject: 'Аккаунт будет удалён через 1 час',
      body: 'Подтвердите пароль по ссылке, чтобы сохранить профиль.',
      isPhishing: true,
      clues: [
        'Подмена буквы в домене (rn вместо m).',
        'Давление временем, чтобы ты не проверял детали.',
        'Просьба ввести пароль через ссылку из письма.'
      ],
      safeAction: 'Открой приложение вручную и проверь уведомления в настройках безопасности.'
    },
    {
      from: 'no-reply@school.edu.ru',
      subject: 'Изменения в расписании на пятницу',
      body: 'Посмотри обновление в электронном дневнике через школьный портал.',
      isPhishing: false,
      clues: [
        'Официальный домен школы без лишних символов.',
        'Нет требований прислать пароль или код из SMS.',
        'Сообщение просит перейти через знакомый портал, а не через подозрительную ссылку.'
      ],
      safeAction: 'Переходи только через сохранённую закладку школьного портала.'
    },
    {
      from: 'bonus@steam-gifts-support.com',
      subject: 'Только сегодня: бесплатный скин',
      body: 'Введи логин и код подтверждения, чтобы получить подарок.',
      isPhishing: true,
      clues: [
        'Слишком выгодное предложение и срочность — классическая приманка.',
        'Просят логин + код подтверждения (2FA), это опасно.',
        'Неофициальный адрес отправителя.'
      ],
      safeAction: 'Игнорируй письмо и проверь акции только в официальном приложении/сайте.'
    },
    {
      from: 'help@vk.com',
      subject: 'Новый вход в аккаунт',
      body: 'Мы заметили вход с нового устройства. Если это не ты, смени пароль в настройках безопасности.',
      isPhishing: false,
      clues: [
        'Письмо не просит пароль или код напрямую.',
        'Текст предлагает действие через настройки, а не через подозрительную форму.',
        'Домен выглядит официально.'
      ],
      safeAction: 'Проверь устройство в настройках аккаунта и завершай незнакомые сессии.'
    },
    {
      from: 'support@robIox-gifts.com',
      subject: 'Компенсация: 5000 Robux за опрос',
      body: 'Заполни форму и укажи пароль для проверки аккаунта.',
      isPhishing: true,
      clues: [
        'Подмена символа в названии бренда (I вместо l).',
        'Запрос пароля под видом проверки.',
        'Сомнительная «компенсация» за простое действие.'
      ],
      safeAction: 'Не заполняй форму, пожалуйся на письмо и удали его.'
    },
    {
      from: 'events@museum-city.ru',
      subject: 'Подтверждение регистрации на олимпиаду',
      body: 'Спасибо за заявку. Детали доступны в личном кабинете на сайте организатора.',
      isPhishing: false,
      clues: [
        'Информационное письмо без запроса приватных данных.',
        'Нет запугивания и фразы «срочно введи пароль».',
        'Логичное содержание относительно регистрации на мероприятие.'
      ],
      safeAction: 'Переходи в кабинет через официальный сайт из закладок.'
    }
  ];

  const siteCases = [
    {
      url: 'https://vk-security-check.freebonus-login.net',
      details: 'Страница обещает подарок и просит телефон, пароль и код из SMS.',
      checks: [
        { label: 'Адрес сайта слишком длинный и с лишними словами.', ok: true, hint: 'Поддельные сайты часто добавляют случайные слова в домен.' },
        { label: 'Сайт обещает бонус за срочный вход.', ok: true, hint: 'Слишком выгодные и срочные предложения — красный флаг.' },
        { label: 'Запрашивает сразу пароль и SMS-код.', ok: true, hint: 'Так мошенники пытаются сразу украсть доступ к аккаунту.' },
        { label: 'Есть HTTPS — значит сайт точно настоящий.', ok: false, hint: 'HTTPS защищает соединение, но не подтверждает честность сайта.' }
      ],
      safeAction: 'Закрой вкладку и зайди на сайт через закладку или вручную набранный официальный адрес.'
    },
    {
      url: 'https://shkolaportal-gov-login.help-center.ru',
      details: 'Перед входом просит отправить фото паспорта «для ускорения проверки».',
      checks: [
        { label: 'Адрес похож на официальный, но с лишними частями.', ok: true, hint: 'Мошенники часто маскируют адрес под гос/школьные сервисы.' },
        { label: 'Запрос фото паспорта для обычного входа.', ok: true, hint: 'Для входа такие данные обычно не нужны.' },
        { label: 'Сайт похож на привычный интерфейс, значит безопасно.', ok: false, hint: 'Копия дизайна не доказывает подлинность сайта.' },
        { label: 'Можно проверить домен и зайти вручную через официальный портал.', ok: true, hint: 'Это правильный безопасный подход.' }
      ],
      safeAction: 'Ничего не загружай и проверь адрес через официальный источник школы/госуслуг.'
    },
    {
      url: 'https://accounts.google.com',
      details: 'Стандартная страница входа без требований отправить пароль в чат или SMS-код в форму поддержки.',
      checks: [
        { label: 'Домен известного сервиса без лишних слов.', ok: true, hint: 'Официальный домен — хороший признак.' },
        { label: 'Сайт требует отправить пароль в Telegram-бот.', ok: false, hint: 'Если такого требования нет — этот пункт отмечать не нужно.' },
        { label: 'На странице нет обещаний «нажми срочно и получи приз».', ok: true, hint: 'Отсутствие манипуляций — плюс.' },
        { label: 'Нужно всё равно проверять адрес в строке браузера.', ok: true, hint: 'Даже знакомые страницы всегда лучше перепроверять.' }
      ],
      safeAction: 'Продолжай только если адрес точно совпадает с официальным и сертификат не вызывает ошибок.'
    }
  ];

  const scenarios = {
    mail: {
      title: 'Разбери письмо: кибер-детектив',
      intro: '3 раунда: реши, где фишинг, и выбери лучший безопасный шаг.',
      safeAction: 'Главное правило: не вводи пароль по ссылке из письма и всегда проверяй отправителя.'
    },
    site: {
      title: 'Проверь сайт за 30 секунд',
      intro: 'Отметь все тревожные признаки сайта. В каждом запуске — новый пример.',
      safeAction: 'Если есть сомнение, закрой страницу и открой сервис вручную.'
    }
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  let activeScenario = null;

  function renderMailGame() {
    const rounds = shuffle(mailCases).slice(0, 3);
    let roundIndex = 0;
    let totalScore = 0;

    const renderRound = () => {
      const current = rounds[roundIndex];
      const options = shuffle([
        { id: 'phishing', label: 'Это фишинг', ok: current.isPhishing },
        { id: 'safe', label: 'Письмо похоже на нормальное', ok: !current.isPhishing }
      ]);

      const safeSteps = shuffle([
        { label: 'Перейти по ссылке и быстро ввести пароль', ok: false },
        { label: current.safeAction, ok: true },
        { label: 'Ответить на письмо и отправить код из SMS', ok: false }
      ]);

      content.innerHTML = `
        <section class="game-panel">
          <p class="game-score">Раунд ${roundIndex + 1} / ${rounds.length} · Очки: ${totalScore}</p>
          <p class="game-subtitle">${escapeHtml(scenarios.mail.intro)}</p>
          <div class="game-feedback">
            <p><strong>От:</strong> ${escapeHtml(current.from)}</p>
            <p><strong>Тема:</strong> ${escapeHtml(current.subject)}</p>
            <p>${escapeHtml(current.body)}</p>
          </div>

          <div class="mail-decision-grid" id="mail-decision-grid">
            ${options
              .map(
                (option, idx) => `<button type="button" class="game-button game-button-secondary" data-mail-answer="${option.ok ? 'yes' : 'no'}">${idx + 1}. ${escapeHtml(option.label)}</button>`
              )
              .join('')}
          </div>

          <p class="game-subtitle">Лучший безопасный шаг:</p>
          <div class="mail-decision-grid" id="mail-action-grid">
            ${safeSteps
              .map(
                (step, idx) => `<button type="button" class="game-button game-button-ghost" data-mail-step="${step.ok ? 'yes' : 'no'}">${idx + 1}. ${escapeHtml(step.label)}</button>`
              )
              .join('')}
          </div>

          <button type="button" class="game-button" id="mail-check-btn">Проверить раунд</button>
          <div class="game-feedback" id="mail-result" aria-live="polite"></div>
        </section>
      `;

      const result = content.querySelector('#mail-result');
      const checkBtn = content.querySelector('#mail-check-btn');

      checkBtn?.addEventListener('click', () => {
        const answerBtn = content.querySelector('[data-mail-answer].is-picked');
        const stepBtn = content.querySelector('[data-mail-step].is-picked');

        if (!answerBtn || !stepBtn) {
          if (result) {
            result.innerHTML = '<p><strong>Выбери оба ответа:</strong> решение по письму и безопасный шаг.</p>';
          }
          return;
        }

        const answerOk = answerBtn.dataset.mailAnswer === 'yes';
        const stepOk = stepBtn.dataset.mailStep === 'yes';
        const points = (answerOk ? 1 : 0) + (stepOk ? 1 : 0);
        totalScore += points;

        const clueList = current.clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join('');
        const verdict = answerOk && stepOk ? 'Отлично! Раунд пройден на 2/2.' : `Раунд: ${points}/2. Разберём ошибки и признаки.`;

        if (result) {
          result.innerHTML = `<p><strong>${verdict}</strong></p><ul>${clueList}</ul><p>${escapeHtml(current.safeAction)}</p>`;
        }

        content.querySelectorAll('[data-mail-answer], [data-mail-step]').forEach((button) => {
          const isCorrect = button.dataset.mailAnswer === 'yes' || button.dataset.mailStep === 'yes';
          button.disabled = true;
          button.classList.add(isCorrect ? 'game-answer-correct' : 'game-answer-wrong');
        });

        checkBtn.disabled = true;

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'game-button';

        if (roundIndex + 1 < rounds.length) {
          nextBtn.textContent = 'Следующее письмо';
          nextBtn.addEventListener('click', () => {
            roundIndex += 1;
            renderRound();
          });
        } else {
          nextBtn.textContent = 'Сыграть снова';
          nextBtn.addEventListener('click', renderMailGame);
          if (result) {
            result.innerHTML += `<p><strong>Итог:</strong> ${totalScore} из ${rounds.length * 2}. ${escapeHtml(scenarios.mail.safeAction)}</p>`;
          }
        }

        result?.insertAdjacentElement('afterend', nextBtn);
      });

      content.querySelectorAll('[data-mail-answer], [data-mail-step]').forEach((button) => {
        button.addEventListener('click', () => {
          const group = button.hasAttribute('data-mail-answer') ? '[data-mail-answer]' : '[data-mail-step]';
          content.querySelectorAll(group).forEach((item) => item.classList.remove('is-picked'));
          button.classList.add('is-picked');
        });
      });
    };

    renderRound();
  }

  function renderSiteGame() {
    const current = shuffle(siteCases)[0];

    content.innerHTML = `
      <section class="game-panel" id="practice-quiz">
        <p class="game-subtitle">${escapeHtml(scenarios.site.intro)}</p>
        <div class="game-feedback"><p><strong>URL:</strong> ${escapeHtml(current.url)}</p><p>${escapeHtml(current.details)}</p></div>
        <div class="game-links">
          ${current.checks
            .map(
              (check, index) => `
                <label class="game-link-card" for="practice-check-${index}">
                  <input id="practice-check-${index}" type="checkbox" data-ok="${check.ok ? 'yes' : 'no'}" data-hint="${escapeHtml(check.hint)}">
                  <span>${escapeHtml(check.label)}</span>
                </label>
              `
            )
            .join('')}
        </div>
        <button type="button" class="game-button" id="practice-check-btn">Проверить ответы</button>
        <button type="button" class="game-button game-button-secondary" id="practice-new-btn">Новый сайт</button>
        <div class="game-feedback" id="practice-result" aria-live="polite"></div>
      </section>
    `;

    const checkBtn = content.querySelector('#practice-check-btn');
    const newBtn = content.querySelector('#practice-new-btn');
    const result = content.querySelector('#practice-result');

    checkBtn?.addEventListener('click', () => {
      const items = Array.from(content.querySelectorAll('input[type="checkbox"]'));
      let score = 0;
      const hints = [];

      items.forEach((item) => {
        const isChecked = item.checked;
        const shouldCheck = item.dataset.ok === 'yes';
        const card = item.closest('.game-link-card');

        if (isChecked === shouldCheck) {
          score += 1;
          card?.classList.add('game-answer-correct');
          card?.classList.remove('game-answer-wrong');
        } else {
          card?.classList.add('game-answer-wrong');
          card?.classList.remove('game-answer-correct');
          hints.push(item.dataset.hint || 'Проверь этот пункт ещё раз.');
        }
      });

      if (!result) return;

      if (score === items.length) {
        result.innerHTML = `<p><strong>Отлично!</strong> Ты заметил(а) все риски.</p><p>${escapeHtml(current.safeAction)}</p>`;
      } else {
        result.innerHTML = `<p><strong>Результат:</strong> ${score} из ${items.length}. Подсказки:</p><ul>${hints
          .map((hint) => `<li>${escapeHtml(hint)}</li>`)
          .join('')}</ul><p>${escapeHtml(current.safeAction)}</p>`;
      }
    });

    newBtn?.addEventListener('click', renderSiteGame);
  }

  function renderScenario(key) {
    activeScenario = scenarios[key];
    if (!activeScenario) return;

    title.textContent = activeScenario.title;

    if (key === 'mail') {
      renderMailGame();
      return;
    }

    renderSiteGame();
  }

  function openModal(key) {
    renderScenario(key);
    overlay.hidden = false;
    modal.hidden = false;
    requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      modal.classList.add('is-open');
    });
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    modal.classList.remove('is-open');

    setTimeout(() => {
      overlay.hidden = true;
      modal.hidden = true;
      content.innerHTML = '';
      activeScenario = null;
    }, 180);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card.dataset.practice));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card.dataset.practice);
      }
    });
  });

  [overlay, closeBtn, backBtn].forEach((element) => {
    element.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
})();
