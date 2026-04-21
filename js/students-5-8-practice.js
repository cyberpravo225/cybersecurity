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

  const scenarios = {
    mail: {
      title: 'Разбери письмо',
      intro: 'Выбери все признаки фишинга в сообщении от «службы поддержки».',
      source: {
        from: 'support@secure-gmaiI.com',
        subject: 'СРОЧНО: аккаунт будет удалён через 2 часа',
        body: 'Мы заметили подозрительную активность. Перейдите по ссылке и подтвердите пароль, иначе доступ будет заблокирован.'
      },
      checks: [
        { label: 'Подозрительный адрес отправителя (буква I вместо l).', ok: true, hint: 'Подмена символов в домене — частая уловка мошенников.' },
        { label: 'Давление по времени: «через 2 часа».', ok: true, hint: 'Фишинг часто торопит, чтобы ты не успел подумать.' },
        { label: 'Просьба подтвердить пароль по ссылке из письма.', ok: true, hint: 'Надёжные сервисы не просят вводить пароль через письмо.' },
        { label: 'В письме нет ошибок, значит оно точно безопасно.', ok: false, hint: 'Даже грамотно написанное письмо может быть мошенническим.' }
      ],
      safeAction: 'Безопасный шаг: не переходи по ссылке, открой сервис вручную и проверь уведомления в официальном приложении.'
    },
    site: {
      title: 'Проверь сайт за 30 секунд',
      intro: 'Отметь пункты, которые говорят, что сайт может быть опасным.',
      source: {
        url: 'https://vk-security-check.freebonus-login.net',
        details: 'Страница просит ввести телефон, пароль и код из SMS для получения «подарка».'
      },
      checks: [
        { label: 'Адрес сайта слишком длинный и с лишними словами.', ok: true, hint: 'Поддельные сайты часто добавляют случайные слова в домен.' },
        { label: 'Сайт обещает бонус за срочный вход.', ok: true, hint: 'Слишком выгодные и срочные предложения — красный флаг.' },
        { label: 'Запрашивает сразу пароль и SMS-код.', ok: true, hint: 'Так мошенники пытаются сразу украсть доступ к аккаунту.' },
        { label: 'Есть HTTPS — значит сайт точно настоящий.', ok: false, hint: 'HTTPS защищает соединение, но не подтверждает честность сайта.' }
      ],
      safeAction: 'Безопасный шаг: закрой вкладку и зайди на сайт через закладку или вручную набранный официальный адрес.'
    }
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  let activeScenario = null;

  function renderScenario(key) {
    activeScenario = scenarios[key];
    if (!activeScenario) return;

    title.textContent = activeScenario.title;

    const sourceHtml = activeScenario.source.from
      ? `<div class="game-feedback"><p><strong>От:</strong> ${escapeHtml(activeScenario.source.from)}</p><p><strong>Тема:</strong> ${escapeHtml(activeScenario.source.subject)}</p><p>${escapeHtml(activeScenario.source.body)}</p></div>`
      : `<div class="game-feedback"><p><strong>URL:</strong> ${escapeHtml(activeScenario.source.url)}</p><p>${escapeHtml(activeScenario.source.details)}</p></div>`;

    content.innerHTML = `
      <section class="game-panel" id="practice-quiz">
        <p class="game-subtitle">${escapeHtml(activeScenario.intro)}</p>
        ${sourceHtml}
        <div class="game-links">
          ${activeScenario.checks
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
        <div class="game-feedback" id="practice-result" aria-live="polite"></div>
      </section>
    `;

    const checkBtn = document.getElementById('practice-check-btn');
    const result = document.getElementById('practice-result');

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
        result.innerHTML = `<p><strong>Отлично!</strong> Ты заметил(а) все риски.</p><p>${escapeHtml(activeScenario.safeAction)}</p>`;
      } else {
        result.innerHTML = `<p><strong>Результат:</strong> ${score} из ${items.length}. Подсказки:</p><ul>${hints
          .map((hint) => `<li>${escapeHtml(hint)}</li>`)
          .join('')}</ul><p>${escapeHtml(activeScenario.safeAction)}</p>`;
      }
    });
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
