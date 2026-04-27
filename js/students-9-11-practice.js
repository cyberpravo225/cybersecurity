(function initStudents911Practice() {
  const labsContainer = document.getElementById('senior-labs-cards');
  const gamesContainer = document.getElementById('senior-games-cards');
  const overlay = document.getElementById('senior-practice-overlay');
  const modal = document.getElementById('senior-practice-modal');
  const titleNode = document.getElementById('senior-practice-title');
  const contentNode = document.getElementById('senior-practice-content');
  const closeBtn = document.getElementById('senior-practice-close-btn');
  const backBtn = document.getElementById('senior-practice-back-btn');

  if (!labsContainer || !gamesContainer || !overlay || !modal || !titleNode || !contentNode || !closeBtn || !backBtn) {
    return;
  }

  const cards = [
    {
      id: 'mail-forensics-lab',
      type: 'lab',
      icon: '📬',
      title: 'Лаба: Почтовая форензика',
      description: 'Разбор фишинга на уровне SOC.',
      level: 'Advanced',
      duration: '10 мин',
      challenge: {
        mode: 'multi',
        intro: 'Входящие учебного портала содержат 7 похожих писем. Ты на дежурстве в команде школьного SOC.',
        question: 'Какие признаки подтверждают, что это фишинговая кампания?',
        answers: [
          { text: 'Домен отправителя похож на школьный, но с подменой символов (rn ↔ m).', correct: true, explain: 'Подмена символов в домене — типовая техника маскировки.' },
          { text: 'Во всех письмах просят передать код 2FA в ответном письме.', correct: true, explain: 'Код 2FA никогда нельзя передавать, это признак захвата аккаунта.' },
          { text: 'Есть подпись с именем школьного администратора.', correct: false, explain: 'Подпись легко подделывается, сама по себе не доказывает подлинность.' },
          { text: 'Текст давит срочностью: «подтверди в течение 15 минут».', correct: true, explain: 'Манипуляция срочностью повышает шанс ошибки пользователя.' },
          { text: 'Письмо предлагает открыть портал через закладку школы.', correct: false, explain: 'Такой совет обычно повышает безопасность и не является индикатором фишинга.' }
        ],
        success: 'Отлично: ты выделил ключевые IOC и можешь оформить эскалацию в incident channel.'
      }
    },
    {
      id: 'site-verification-lab',
      type: 'lab',
      icon: '🌐',
      title: 'Лаба: Проверка сайта',
      description: 'OSINT-чек за 90 секунд.',
      level: 'Advanced',
      duration: '8 мин',
      challenge: {
        mode: 'multi',
        intro: 'Перед тобой «портал успеваемости», который обещает бонус за быстрый вход.',
        question: 'Какие факторы делают страницу небезопасной?',
        answers: [
          { text: 'URL содержит лишние слова verify-security-bonus и отличается от официального домена.', correct: true, explain: 'Добавочные слова в домене часто выдают подделку.' },
          { text: 'Форма требует логин, пароль, телефон и CVV «для идентификации».', correct: true, explain: 'Для школьного входа CVV и банковские реквизиты не нужны.' },
          { text: 'На странице есть HTTPS, поэтому можно вводить данные.', correct: false, explain: 'HTTPS защищает канал, но не доказывает честность сайта.' },
          { text: 'Сайт ограничивает время: «осталось 8 минут до блокировки».', correct: true, explain: 'Ложная срочность — классическая схема социальной инженерии.' },
          { text: 'Кнопка «Войти через школьную закладку» ведёт на официальный домен школы.', correct: false, explain: 'Официальный домен — это скорее признак безопасного пути входа.' }
        ],
        success: 'Верно: такой сайт нужно закрыть, зафиксировать и проверить событие через официальный канал.'
      }
    },
    {
      id: 'detective-pro-game',
      type: 'game',
      icon: '🕵️',
      title: 'Игра: Фишинг-детектив PRO',
      description: 'Найди атаку среди сообщений.',
      level: 'Pro',
      duration: '7 мин',
      challenge: {
        intro: 'Раунд «Смешанная атака»: злоумышленник комбинирует сообщения в разных каналах.',
        question: 'Какой сигнал требует немедленной эскалации?',
        answers: [
          { text: 'Письмо от учителя без ссылок, с просьбой проверить задание в дневнике.', correct: false, explain: 'Это выглядит как штатное сообщение.' },
          { text: 'Серия сообщений с просьбой выслать код 2FA и скриншот QR для входа.', correct: true, explain: 'Запрос кода и QR — прямой путь к угону аккаунта.' },
          { text: 'Нейтральное уведомление платформы о плановом обновлении через официальный кабинет.', correct: false, explain: 'Сервисная коммуникация без запроса данных обычно безопасна.' },
          { text: 'Сообщение от одноклассника «посмотри фото» с доменом известного сервиса.', correct: false, explain: 'Нужно проверять контекст, но по одному этому признаку эскалация не обязательна.' }
        ],
        success: 'Отличный детект: ты выделил критичный вектор атаки и сохранил фокус на рисках.'
      }
    },
    {
      id: 'school-shield-game',
      type: 'game',
      icon: '🛡️',
      title: 'Игра: Киберщит школы',
      description: 'Командное реагирование на инцидент.',
      level: 'Team',
      duration: '9 мин',
      challenge: {
        intro: 'Мониторинг показывает всплеск логинов и обращения к неизвестным доменам из одного сегмента сети.',
        question: 'Какая последовательность действий наиболее правильная?',
        answers: [
          { text: 'Игнорировать тревогу до конца учебной смены.', correct: false, explain: 'Промедление почти всегда увеличивает последствия.' },
          { text: 'Собрать телеметрию, сегментировать трафик, уведомить IR-команду и администратора.', correct: true, explain: 'Это зрелый подход: и защита, и сохранение данных расследования.' },
          { text: 'Полностью выключить сеть школы без фиксации фактов.', correct: false, explain: 'Резкая остановка без плана ломает расследование и учебный процесс.' },
          { text: 'Попросить пользователей «просто не открывать ссылки» и ничего больше не делать.', correct: false, explain: 'Только рекомендаций недостаточно при активной атаке.' }
        ],
        success: 'Сильное командное решение: это уже практика реального incident response.'
      }
    }
  ];

  const cardTemplate = (item) => `
    <article class="senior-card game" data-practice-id="${item.id}" role="button" tabindex="0" aria-haspopup="dialog">
      <div class="senior-card-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="senior-card-meta">
        <span class="senior-chip">${item.level || 'Core'}</span>
        <span class="senior-chip senior-chip-time">⏱ ${item.duration || '6 мин'}</span>
      </div>
    </article>
  `;

  labsContainer.innerHTML = cards.filter((item) => item.type === 'lab').map(cardTemplate).join('');
  gamesContainer.innerHTML = cards.filter((item) => item.type === 'game').map(cardTemplate).join('');

  const cardMap = new Map(cards.map((item) => [item.id, item]));
  const practiceCards = Array.from(document.querySelectorAll('[data-practice-id]'));
  let activeCard = null;

  const openModal = (cardId) => {
    const data = cardMap.get(cardId);
    if (!data) return;

    activeCard = data;
    titleNode.textContent = data.title;

    contentNode.innerHTML = `
      <div class="practice-layout">
        <p><strong>${data.challenge.intro}</strong></p>
        <p>${data.challenge.question}</p>
        <div class="practice-answers">
          ${data.challenge.answers
            .map((answer, index) => {
              if (data.challenge.mode === 'multi') {
                return `<label class="game-link-card"><input type="checkbox" data-answer-index="${index}"> ${answer.text}</label>`;
              }
              return `<button class="game-button" type="button" data-answer-index="${index}">${answer.text}</button>`;
            })
            .join('')}
        </div>
        ${
          data.challenge.mode === 'multi'
            ? '<button class="game-button" type="button" id="senior-practice-check">Проверить выбор</button>'
            : ''
        }
        <div class="practice-feedback" id="senior-practice-feedback" aria-live="polite"></div>
      </div>
    `;

    overlay.hidden = false;
    modal.hidden = false;
    overlay.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    activeCard = null;
    overlay.classList.remove('is-open');
    modal.classList.remove('is-open');
    overlay.hidden = true;
    modal.hidden = true;
    contentNode.innerHTML = '';
    document.body.classList.remove('no-scroll');
  };

  practiceCards.forEach((card) => {
    const activate = () => openModal(card.dataset.practiceId);
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  });

  contentNode.addEventListener('click', (event) => {
    if (event.target.id === 'senior-practice-check') {
      if (!activeCard || activeCard.challenge.mode !== 'multi') return;
      const feedback = document.getElementById('senior-practice-feedback');
      if (!feedback) return;

      const selectedIndexes = Array.from(contentNode.querySelectorAll('input[type="checkbox"][data-answer-index]:checked')).map((node) =>
        Number(node.dataset.answerIndex)
      );

      if (!selectedIndexes.length) {
        feedback.innerHTML = '<p>⚠️ Выбери хотя бы один пункт.</p>';
        return;
      }

      const explanations = selectedIndexes
        .map((index) => activeCard.challenge.answers[index])
        .filter(Boolean)
        .map((item) => `<li>${item.correct ? '✅' : '⚠️'} ${item.explain}</li>`)
        .join('');

      const allCorrect = selectedIndexes.every((index) => activeCard.challenge.answers[index] && activeCard.challenge.answers[index].correct);
      const status = allCorrect ? '✅ Отличный приоритет.' : '⚠️ Есть лишние или пропущенные пункты.';
      const finalTip = allCorrect ? `<p><strong>${activeCard.challenge.success}</strong></p>` : '';
      feedback.innerHTML = `<p>${status}</p><ul>${explanations}</ul>${finalTip}`;
      return;
    }

    const button = event.target.closest('[data-answer-index]');
    if (!button || !activeCard) return;

    const selected = Number(button.dataset.answerIndex);
    const choice = activeCard.challenge.answers[selected];
    const feedback = document.getElementById('senior-practice-feedback');

    if (!choice || !feedback) return;

    const status = choice.correct ? '✅ Верно.' : '⚠️ Неверно.';
    const finalTip = choice.correct ? `<p><strong>${activeCard.challenge.success}</strong></p>` : '';
    feedback.innerHTML = `<p>${status} ${choice.explain}</p>${finalTip}`;
  });

  closeBtn.addEventListener('click', closeModal);
  backBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
