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
  let heightAnimTimer = null;

  function animateModalContentHeight(previousHeight) {
    const startHeight = typeof previousHeight === 'number' ? previousHeight : content.getBoundingClientRect().height;
    const endHeight = content.scrollHeight;

    if (Math.abs(startHeight - endHeight) < 2) return;

    clearTimeout(heightAnimTimer);
    content.style.overflow = 'hidden';
    content.style.height = `${startHeight}px`;
    content.style.transition = 'height .28s ease';

    requestAnimationFrame(() => {
      content.style.height = `${endHeight}px`;
    });

    heightAnimTimer = setTimeout(() => {
      content.style.transition = '';
      content.style.height = '';
      content.style.overflow = '';
    }, 320);
  }

  function renderWithHeightAnimation(renderFn) {
    const before = content.getBoundingClientRect().height;
    renderFn();
    animateModalContentHeight(before);
  }

  function showResultBlock(resultElement, html) {
    if (!resultElement) return;

    resultElement.classList.remove('is-visible');
    setTimeout(() => {
      resultElement.innerHTML = html;
      requestAnimationFrame(() => {
        resultElement.classList.add('is-visible');
        animateModalContentHeight();
      });
    }, 80);
  }

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

      renderWithHeightAnimation(() => {
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
      });

      const result = content.querySelector('#mail-result');
      const checkBtn = content.querySelector('#mail-check-btn');

      checkBtn?.addEventListener('click', () => {
        const answerBtn = content.querySelector('[data-mail-answer].is-picked');
        const stepBtn = content.querySelector('[data-mail-step].is-picked');

        if (!answerBtn || !stepBtn) {
          showResultBlock(result, '<p><strong>Выбери оба ответа:</strong> решение по письму и безопасный шаг.</p>');
          return;
        }

        const answerOk = answerBtn.dataset.mailAnswer === 'yes';
        const stepOk = stepBtn.dataset.mailStep === 'yes';
        const points = (answerOk ? 1 : 0) + (stepOk ? 1 : 0);
        totalScore += points;

        const clueList = current.clues.map((clue) => `<li>${escapeHtml(clue)}</li>`).join('');
        const verdict = answerOk && stepOk ? 'Отлично! Раунд пройден на 2/2.' : `Раунд: ${points}/2. Разберём ошибки и признаки.`;

        showResultBlock(result, `<p><strong>${verdict}</strong></p><ul>${clueList}</ul><p>${escapeHtml(current.safeAction)}</p>`);

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
            result.classList.add('is-visible');
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

    renderWithHeightAnimation(() => {
      content.innerHTML = `
      <section class="game-panel" id="practice-quiz">
        <p class="game-subtitle">${escapeHtml(scenarios.site.intro)}</p>
        <div class="game-feedback"><p><strong>URL:</strong> ${escapeHtml(current.url)}</p><p>${escapeHtml(current.details)}</p></div>
        <div class="game-links">
          ${current.checks
            .map(
              (check, index) => `
                <label class="game-link-card site-option" for="practice-check-${index}">
                  <input id="practice-check-${index}" type="checkbox" data-ok="${check.ok ? 'yes' : 'no'}" data-hint="${escapeHtml(check.hint)}">
                  <span class="site-option-mark" aria-hidden="true">✓</span>
                  <span class="site-option-text">${escapeHtml(check.label)}</span>
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
    });

    const checkBtn = content.querySelector('#practice-check-btn');
    const newBtn = content.querySelector('#practice-new-btn');
    const result = content.querySelector('#practice-result');
    const inputs = Array.from(content.querySelectorAll('input[type="checkbox"]'));

    inputs.forEach((input) => {
      input.addEventListener('change', () => {
        const card = input.closest('.site-option');
        card?.classList.toggle('is-picked', input.checked);
      });
    });

    checkBtn?.addEventListener('click', () => {
      let score = 0;
      const hints = [];

      inputs.forEach((item) => {
        const isChecked = item.checked;
        const shouldCheck = item.dataset.ok === 'yes';
        const card = item.closest('.game-link-card');

        card?.classList.remove('game-answer-correct', 'game-answer-wrong');

        if (shouldCheck) {
          card?.classList.add('game-answer-correct');
        }

        if (isChecked === shouldCheck) {
          score += 1;
        }

        if (isChecked && !shouldCheck) {
          card?.classList.add('game-answer-wrong');
          hints.push(item.dataset.hint || 'Проверь этот пункт ещё раз.');
        }

        item.disabled = true;
      });

      checkBtn.disabled = true;

      if (!result) return;

      if (score === inputs.length) {
        showResultBlock(result, `<p><strong>Отлично!</strong> Ты заметил(а) все риски.</p><p>${escapeHtml(current.safeAction)}</p>`);
      } else {
        showResultBlock(
          result,
          `<p><strong>Результат:</strong> ${score} из ${inputs.length}. Подсказки:</p><ul>${hints
            .map((hint) => `<li>${escapeHtml(hint)}</li>`)
            .join('')}</ul><p>${escapeHtml(current.safeAction)}</p>`
        );
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

  window.addEventListener('resize', () => {
    if (!modal.hidden) {
      animateModalContentHeight();
    }
  });
})();

(function initStudents58Presentation() {
  const presentationCards = Array.from(document.querySelectorAll('.senior-card.presentation'));
  if (!presentationCards.length) return;

  const targetCard = presentationCards.find((card) => {
    const heading = card.querySelector('h3')?.textContent?.trim() || '';
    const description = card.querySelector('p')?.textContent?.trim() || '';
    return heading === 'Интернет и личная информация' && description === 'Какие данные нельзя публиковать в интернете.';
  });

  if (!targetCard) return;

  const STYLE_ID = 'students58-presentation-style';
  const REVEAL_CSS_ID = 'students58-reveal-css';
  const REVEAL_THEME_ID = 'students58-reveal-theme';
  const REVEAL_SCRIPT_ID = 'students58-reveal-script';

  let overlay = null;
  let deck = null;
  let scrollY = 0;
  let previousFocus = null;
  let previousHash = '';

  const slidesMarkup = `
    <section>
      <h1>Интернет и личная информация</h1>
      <p>Какие данные нельзя публиковать в интернете 🛡️</p>
      <p style="font-size:.72em">5–8 классы · Понятно · Полезно</p>
    </section>
    <section>
      <h2>Что такое личная информация?</h2>
      <ul>
        <li class="fragment">Данные, по которым можно узнать именно тебя 🙂</li>
        <li class="fragment">Имя, школа, класс, телефон</li>
        <li class="fragment">Адрес и места, где ты часто бываешь</li>
        <li class="fragment">Логины, пароли, коды</li>
        <li class="fragment">Фото и видео тоже могут выдать лишнее</li>
      </ul>
    </section>
    <section>
      <h2>Почему это важно?</h2>
      <ul>
        <li class="fragment">Мошенники любят открытые профили 🎭</li>
        <li class="fragment">По данным могут взломать аккаунт</li>
        <li class="fragment">Можно столкнуться с шантажом и обманом</li>
        <li class="fragment">Информация быстро копируется</li>
        <li class="fragment">Удалить всё потом сложно</li>
      </ul>
    </section>
    <section>
      <h2>Кто может использовать данные?</h2>
      <ul>
        <li class="fragment">Незнакомцы в соцсетях</li>
        <li class="fragment">Фейковые аккаунты и боты</li>
        <li class="fragment">Мошенники с поддельными сайтами</li>
        <li class="fragment">Люди, которые случайно пересылают твой контент</li>
      </ul>
    </section>
    <section>
      <h2>Нельзя публиковать: часть 1</h2>
      <ul>
        <li class="fragment">🏠 Домашний адрес</li>
        <li class="fragment">📞 Номер телефона</li>
        <li class="fragment">🔑 Пароли</li>
        <li class="fragment">💬 SMS-коды подтверждения</li>
        <li class="fragment">🪪 Фото документов</li>
      </ul>
    </section>
    <section>
      <h2>Нельзя публиковать: часть 2</h2>
      <ul>
        <li class="fragment">💳 Данные банковской карты</li>
        <li class="fragment">📍 Точную геолокацию</li>
        <li class="fragment">🕒 Когда дома никого нет</li>
        <li class="fragment">🗓️ Подробный личный график</li>
        <li class="fragment">Ответы на секретные вопросы</li>
      </ul>
    </section>
    <section>
      <h2>Фото и видео</h2>
      <ul>
        <li class="fragment">Проверь фон: адреса, номера, документы</li>
        <li class="fragment">Отключай геометки перед публикацией</li>
        <li class="fragment">Не снимай билеты, пропуска, бейджи</li>
        <li class="fragment">Сторис «я сейчас тут» может быть рискованной 📌</li>
      </ul>
    </section>
    <section>
      <h2>О себе лучше не писать</h2>
      <ul>
        <li class="fragment">«Я один дома»</li>
        <li class="fragment">Где лежат деньги/ключи</li>
        <li class="fragment">Точный маршрут из школы</li>
        <li class="fragment">Когда семья уехала в отпуск ✈️</li>
      </ul>
    </section>
    <section>
      <h2>Мини-квиз 🤔</h2>
      <p>Что нельзя публиковать?</p>
      <ul>
        <li class="fragment">A) «Уехали на дачу до воскресенья, дома пусто»</li>
        <li class="fragment">B) Фото рисунка без личных данных</li>
        <li class="fragment">C) Скрин с кодом из SMS</li>
        <li class="fragment">D) Мем без геолокации</li>
      </ul>
      <p class="fragment"><strong>Ответ:</strong> нельзя A и C.</p>
    </section>
    <section>
      <h2>Как защитить себя</h2>
      <ul>
        <li class="fragment">Закрытый профиль для незнакомцев</li>
        <li class="fragment">Сложные пароли + 2FA</li>
        <li class="fragment">Думай перед публикацией</li>
        <li class="fragment">Добавляй в друзья только знакомых</li>
        <li class="fragment">При сомнении спроси взрослого 👨‍🏫</li>
      </ul>
    </section>
    <section>
      <h2>Если уже выложил(а) лишнее</h2>
      <ul>
        <li class="fragment">Сразу удали публикацию</li>
        <li class="fragment">Смени пароли</li>
        <li class="fragment">Сообщи родителям или учителю</li>
        <li class="fragment">Заблокируй подозрительные аккаунты</li>
      </ul>
    </section>
    <section>
      <h2>Главный вывод</h2>
      <p>Личная информация — это твоя безопасность 💙</p>
      <p class="fragment">Перед постом: «Это безопасно? Это нужно? Это точно для всех?»</p>
    </section>
  `;

  function ensurePresentationStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .students58-presentation-overlay { position: fixed; inset: 0; z-index: 2100; background: rgba(9, 14, 40, .68); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 12px; }
      .students58-presentation-modal { position: relative; width: min(1200px, 100%); height: min(96vh, 100%); border-radius: 16px; overflow: hidden; background: linear-gradient(145deg,#edf3ff,#f6f0ff); box-shadow: 0 22px 50px rgba(16, 26, 74, .45); }
      .students58-presentation-close { position: absolute; top: 12px; right: 12px; width: 42px; height: 42px; border: 0; border-radius: 999px; background: rgba(29,41,100,.9); color: #fff; font-size: 26px; line-height: 1; cursor: pointer; z-index: 20; }
      .students58-presentation-close:hover,.students58-presentation-close:focus-visible { outline: 2px solid #7db2ff; outline-offset: 2px; background: #3656ff; }
      .students58-presentation-modal .reveal { height: 100%; font-size: clamp(22px, 2.2vw, 34px); }
      .students58-presentation-modal .slides { text-align: left; }
      .students58-presentation-modal .slides section { border-radius: 14px; color: #1a2858; background: linear-gradient(140deg,#f8fbff,#f4f0ff); padding: 1.2rem 1.45rem; }
      .students58-presentation-modal h1,.students58-presentation-modal h2 { color: #2a3db1; }
      .students58-presentation-modal p,.students58-presentation-modal li { font-size: .84em; line-height: 1.35; }
      .students58-presentation-modal ul { padding-left: 1.05em; margin: 0; }
      @media (max-width: 900px) {
        .students58-presentation-overlay { padding: 0; }
        .students58-presentation-modal { width: 100%; height: 100vh; border-radius: 0; }
        .students58-presentation-modal .slides section { padding: 1rem 1.1rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function loadCss(href, id) {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadRevealScript() {
    if (window.Reveal) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existing = document.getElementById(REVEAL_SCRIPT_ID);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Reveal.js не загрузился')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = REVEAL_SCRIPT_ID;
      script.src = 'https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Reveal.js не загрузился'));
      document.body.appendChild(script);
    });
  }

  function cleanupBodyState() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
  }

  function closePresentation() {
    document.removeEventListener('keydown', onDocumentKeyDown);

    if (deck && typeof deck.destroy === 'function') {
      deck.destroy();
    }

    deck = null;

    if (overlay) {
      overlay.remove();
      overlay = null;
    }

    cleanupBodyState();

    const cleanUrl = `${window.location.pathname}${window.location.search}${previousHash}`;
    window.history.replaceState(null, '', cleanUrl);

    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    } else {
      targetCard.focus();
    }
  }

  function onDocumentKeyDown(event) {
    if (event.key === 'Escape' && overlay) {
      event.preventDefault();
      closePresentation();
    }
  }

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'students58-presentation-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Презентация: Интернет и личная информация');

    overlay.innerHTML = `
      <div class="students58-presentation-modal" id="students58-presentation-modal">
        <button type="button" class="students58-presentation-close" aria-label="Закрыть презентацию">✕</button>
        <div class="reveal" id="students58-reveal-root">
          <div class="slides">${slidesMarkup}</div>
        </div>
      </div>
    `;

    overlay.addEventListener('click', (event) => {
      const modal = overlay.querySelector('#students58-presentation-modal');
      if (!modal.contains(event.target)) {
        closePresentation();
      }
    });

    overlay.querySelector('.students58-presentation-close')?.addEventListener('click', closePresentation);

    document.body.appendChild(overlay);
  }

  async function openPresentation() {
    if (overlay) return;

    previousFocus = document.activeElement;
    previousHash = window.location.hash;
    scrollY = window.scrollY;

    ensurePresentationStyles();
    loadCss('https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css', REVEAL_CSS_ID);
    loadCss('https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/white.css', REVEAL_THEME_ID);

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    buildOverlay();

    try {
      await loadRevealScript();

      const root = overlay.querySelector('#students58-reveal-root');
      deck = new window.Reveal(root, {
        controls: true,
        progress: true,
        slideNumber: true,
        hash: false,
        transition: 'fade',
        backgroundTransition: 'fade',
        center: true
      });
      await deck.initialize();

      overlay.querySelector('.students58-presentation-close')?.focus();
      document.addEventListener('keydown', onDocumentKeyDown);
    } catch (error) {
      closePresentation();
      window.alert('Не удалось открыть презентацию. Проверь подключение к интернету и попробуй снова.');
    }
  }

  targetCard.addEventListener('click', (event) => {
    event.preventDefault();
    openPresentation();
  });

  targetCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPresentation();
    }
  });
})();
