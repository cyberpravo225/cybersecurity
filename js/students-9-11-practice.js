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
      id: 'asset-priority-lab',
      type: 'lab',
      icon: '🧪',
      title: 'Лаба: Приоритизация активов',
      description: 'Собери мини-модель угроз для школьного LMS: активы, риски и базовые контрмеры.',
      challenge: {
        mode: 'multi',
        intro: 'Отметь пункты, которые должны войти в верхний приоритет защиты.',
        question: 'Что нужно отнести к критичным активам и защитным действиям в первую очередь?',
        answers: [
          { text: 'База оценок и персональные данные учеников', correct: true, explain: 'Это ключевой актив с высоким риском утечки.' },
          { text: 'Включить MFA для учителей и администраторов', correct: true, explain: 'MFA снижает риск захвата учётных записей.' },
          { text: 'Цвет кнопки входа на сайте', correct: false, explain: 'Визуальные мелочи не влияют на приоритет защиты.' },
          { text: 'Логи входов и события изменения прав доступа', correct: true, explain: 'Логи нужны для детекта и расследований.' }
        ],
        success: 'Отлично. Мини-отчёт готов: критичные активы выделены, базовые меры определены.'
      }
    },
    {
      id: 'incident-timeline-lab',
      type: 'lab',
      icon: '📊',
      title: 'Лаба: Таймлайн инцидента',
      description: 'Восстанови правильную последовательность реагирования после фишинговой атаки.',
      challenge: {
        mode: 'single',
        intro: 'Сценарий: злоумышленник получил доступ к учётке сотрудника через поддельное письмо.',
        question: 'Какой шаг должен быть первым в правильном таймлайне реагирования?',
        answers: [
          { text: 'Сразу удалить логи и временные файлы', correct: false, explain: 'Это уничтожит важные артефакты расследования.' },
          { text: 'Изолировать учётку, завершить сессии и сменить пароль', correct: true, explain: 'Сначала нужно остановить развитие инцидента.' },
          { text: 'Провести презентацию для класса про фишинг', correct: false, explain: 'Обучение важно, но не является первым шагом реагирования.' }
        ],
        success: 'Верно. Далее фиксируем IOC, анализируем масштаб и обновляем регламент реагирования.'
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
