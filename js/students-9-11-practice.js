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
      id: 'threat-model',
      type: 'lab',
      icon: '🧪',
      title: 'Лаба: Threat Modeling школы',
      description: 'Определи активы, векторы атак и меры защиты для школьного облачного сервиса.',
      challenge: {
        intro: 'Выбери 3 критичных актива для модели угроз.',
        question: 'Что из списка является самым критичным активом школьного портала?',
        answers: [
          { text: 'Список тем оформления сайта', correct: false, explain: 'Тема оформления не критична для безопасности данных.' },
          { text: 'База оценок и персональных данных учеников', correct: true, explain: 'Это чувствительные данные с высоким риском ущерба.' },
          { text: 'Фоновая анимация главной страницы', correct: false, explain: 'Визуальные элементы не являются приоритетным активом.' }
        ],
        success: 'Отлично. Следующий шаг: добавь MFA для учителей и журнал аудита входов.'
      }
    },
    {
      id: 'forensics-report',
      type: 'lab',
      icon: '📊',
      title: 'Лаба: Пост-инцидент отчёт',
      description: 'Разбери таймлайн инцидента и выбери корректный план восстановления.',
      challenge: {
        intro: 'Сценарий: фишинговая ссылка привела к компрометации учётки администратора.',
        question: 'Какое действие должно быть первым в плане реагирования?',
        answers: [
          { text: 'Написать пост в соцсети о том, что всё под контролем', correct: false, explain: 'Публичные сообщения не решают инцидент технически.' },
          { text: 'Изолировать скомпрометированную учётку и завершить активные сессии', correct: true, explain: 'Сначала останавливают развитие атаки.' },
          { text: 'Удалить все логи, чтобы освободить место', correct: false, explain: 'Логи нужны для расследования и отчётности.' }
        ],
        success: 'Верно. После изоляции: ротация паролей, проверка IOC и обновление регламентов.'
      }
    },
    {
      id: 'soc-analyst',
      type: 'game',
      icon: '🕵️',
      title: 'Игра: SOC-аналитик за 5 минут',
      description: 'Определи, какое событие похоже на реальную атаку, а что — ложная тревога.',
      challenge: {
        intro: 'Раунд тревог: ты дежурный аналитик центра мониторинга.',
        question: 'Какой сигнал наиболее подозрительный?',
        answers: [
          { text: 'Один неудачный вход пользователя с опечаткой', correct: false, explain: 'Единичные ошибки входа — обычное явление.' },
          { text: '150 попыток входа за 2 минуты с разных IP к одной учётке', correct: true, explain: 'Это типичный brute-force / credential stuffing паттерн.' },
          { text: 'Плановое обновление антивирусных баз', correct: false, explain: 'Это легитимная фоновая активность.' }
        ],
        success: 'Точно. Эскалируй инцидент и включай временную блокировку источников.'
      }
    },
    {
      id: 'crypto-choice',
      type: 'game',
      icon: '🧠',
      title: 'Игра: Крипто-архитектор',
      description: 'Подбери подход шифрования и хранения ключей для школьного приложения.',
      challenge: {
        intro: 'Ты проектируешь защиту данных для электронного дневника.',
        question: 'Какой вариант наиболее корректный?',
        answers: [
          { text: 'Хранить пароли в открытом виде для удобства поддержки', correct: false, explain: 'Пароли должны храниться только в виде устойчивых хешей.' },
          { text: 'Использовать bcrypt/argon2 для паролей и TLS для передачи данных', correct: true, explain: 'Это базовый современный стандарт защиты.' },
          { text: 'Шифровать только фронтенд-код, а базу оставить без защиты', correct: false, explain: 'Основные риски часто сосредоточены на стороне данных.' }
        ],
        success: 'Супер. Ещё лучше: добавить ротацию ключей и разделение привилегий.'
      }
    },
    {
      id: 'blue-team',
      type: 'game',
      icon: '🛡️',
      title: 'Игра: Blue Team — защити сеть',
      description: 'Выбери правильную последовательность действий при сетевой атаке.',
      challenge: {
        intro: 'В сети школы замечен аномальный трафик на неизвестные домены.',
        question: 'Какая последовательность действий наиболее правильная?',
        answers: [
          { text: 'Игнорировать до конца учебной смены', correct: false, explain: 'Задержка увеличивает ущерб.' },
          { text: 'Сразу отключить все серверы без фиксации фактов', correct: false, explain: 'Без фиксации артефактов расследование усложняется.' },
          { text: 'Собрать телеметрию, ограничить сегмент сети, уведомить команду реагирования', correct: true, explain: 'Это взвешенный и профессиональный подход.' }
        ],
        success: 'Отличная реакция. Так работает зрелая стратегия blue team.'
      }
    }
  ];

  const cardTemplate = (item) => `
    <article class="senior-card game" data-practice-id="${item.id}" role="button" tabindex="0" aria-haspopup="dialog">
      <div class="senior-card-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
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
            .map(
              (answer, index) =>
                `<button class="game-button" type="button" data-answer-index="${index}">${answer.text}</button>`
            )
            .join('')}
        </div>
        <div class="practice-feedback" id="senior-practice-feedback" aria-live="polite"></div>
      </div>
    `;

    overlay.hidden = false;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    activeCard = null;
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
