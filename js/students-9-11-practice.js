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
      title: 'Лаба: Почтовая форензика — разбери атаку',
      description: 'Как в «Разбери письмо», но на уровне SOC: анализируй подмену домена, pretext и риск компрометации аккаунта.',
      challenge: {
        mode: 'multi',
        intro: 'Входящие для учебного портала: найди признаки целевой фишинговой атаки.',
        question: 'Что говорит о реальной атаке и требует эскалации инцидента?',
        answers: [
          { text: 'Домен похож на официальный, но есть подмена символов (l ↔ I, rn ↔ m).', correct: true, explain: 'Подмена символов в домене — частая техника фишинга.' },
          { text: 'Письмо просит срочно ввести пароль и код 2FA в форме.', correct: true, explain: 'Запрос 2FA-кода = попытка немедленного захвата доступа.' },
          { text: 'Сообщение без ссылок, только напоминание о встрече кружка.', correct: false, explain: 'Информационное письмо без запроса данных не похоже на атаку.' },
          { text: 'В тексте угроза: «Аккаунт удалят через 30 минут».', correct: true, explain: 'Давление временем — ключевая манипуляция злоумышленников.' }
        ],
        success: 'Отлично. Ты собрал IOC, обосновал риск и можешь передавать кейс в реагирование.'
      }
    },
    {
      id: 'site-verification-lab',
      type: 'lab',
      icon: '🌐',
      title: 'Лаба: Проверка сайта за 90 секунд (OSINT mini)',
      description: 'Продвинутая версия «Проверь сайт»: домен, контекст, запросы персональных данных и логика страницы.',
      challenge: {
        mode: 'multi',
        intro: 'Перед тобой страница «школьной авторизации» с бонусом за вход.',
        question: 'Какие признаки указывают, что сайт нельзя использовать?',
        answers: [
          { text: 'URL содержит лишние слова login/bonus/help и не совпадает с официальным доменом.', correct: true, explain: 'Маскировка адреса под бренд — типичный red flag.' },
          { text: 'Форма требует пароль, телефон и CVV «для подтверждения личности».', correct: true, explain: 'Для входа CVV не нужен никогда — это критический индикатор мошенничества.' },
          { text: 'Есть HTTPS-замок, значит ресурс точно безопасен.', correct: false, explain: 'HTTPS не подтверждает добросовестность владельца сайта.' },
          { text: 'Сайт обещает приз только «до конца урока».', correct: true, explain: 'Срочность и награда — классическая приманка.' }
        ],
        success: 'Верно. Такой ресурс блокируем, фиксируем и проверяем через официальный канал.'
      }
    },
    {
      id: 'phishing-tabletop-lab',
      type: 'lab',
      icon: '🧪',
      title: 'Лаба: Tabletop «Один день фишинга в школе»',
      description: 'Собери правильный первый шаг реагирования для команды: быстро, без паники и с сохранением артефактов.',
      challenge: {
        mode: 'single',
        intro: 'Три учётки сообщили о странных входах после письма «Обновите дневник».',
        question: 'Какой шаг должен быть первым?',
        answers: [
          { text: 'Попросить всех удалить письма и не сообщать никому.', correct: false, explain: 'Так теряются данные и замедляется расследование.' },
          { text: 'Изолировать скомпрометированные учётки, завершить сессии, принудительно сменить пароли.', correct: true, explain: 'Сначала нужно остановить развитие инцидента.' },
          { text: 'Сразу запускать школьный хакатон по теме фишинга.', correct: false, explain: 'Обучение полезно, но не заменяет первичное реагирование.' }
        ],
        success: 'Точно. Затем собираем логи, уведомляем ответственных и обновляем playbook.'
      }
    },
    {
      id: 'detective-pro-game',
      type: 'game',
      icon: '🕵️',
      title: 'Игра: Фишинг-детектив PRO',
      description: 'Расширенная версия из 5–8 классов: от чатов до e-mail thread hijacking. Выбирай вердикт как аналитик.',
      challenge: {
        intro: 'Раунд: «чат класса + email + соцсеть». Определи самый опасный сигнал.',
        question: 'Какой сценарий требует немедленной эскалации?',
        answers: [
          { text: 'Одно письмо от учителя без ссылок и запроса пароля.', correct: false, explain: 'Признаков атаки недостаточно, это похоже на обычное сообщение.' },
          { text: 'Серия сообщений с просьбой выслать код 2FA и «подтвердить личность».', correct: true, explain: 'Запрос кода подтверждения — прямая попытка захвата учётки.' },
          { text: 'Уведомление о плановом обновлении школьной платформы через официальный кабинет.', correct: false, explain: 'Это нормальная сервисная активность.' }
        ],
        success: 'Отличный детект. Ты правильно выделил критический триггер атаки.'
      }
    },
    {
      id: 'school-shield-game',
      type: 'game',
      icon: '🛡️',
      title: 'Игра: Киберщит школы — командный режим',
      description: 'Эволюция «Киберщита»: ты капитан blue team. Выбери стратегию, которая снижает ущерб и сохраняет улики.',
      challenge: {
        intro: 'В сети школы всплеск подозрительных авторизаций и трафик к неизвестным доменам.',
        question: 'Какая последовательность действий наиболее зрелая?',
        answers: [
          { text: 'Игнорировать до конца дня, чтобы не мешать урокам.', correct: false, explain: 'Промедление увеличивает масштаб атаки.' },
          { text: 'Собрать телеметрию, ограничить сегмент, уведомить команду реагирования и администратора.', correct: true, explain: 'Так вы одновременно снижаете риск и сохраняете данные расследования.' },
          { text: 'Отключить всю сеть школы без анализа и коммуникации.', correct: false, explain: 'Радикальное отключение без плана может ухудшить ситуацию.' }
        ],
        success: 'Сильное решение. Это уже уровень реального командного incident response.'
      }
    },
    {
      id: 'threat-hunter-game',
      type: 'game',
      icon: '⚡',
      title: 'Игра: Threat Hunter Sprint',
      description: 'Найди аномалию среди нормального фона: логины, география входов и поведение устройств.',
      challenge: {
        intro: 'Ты на дежурстве. Нужно отличить ложную тревогу от целевой активности.',
        question: 'Какой набор событий самый подозрительный?',
        answers: [
          { text: 'Один вход ученика с опечаткой пароля и успешной попыткой через минуту.', correct: false, explain: 'Типичный бытовой сценарий пользователя.' },
          { text: '120 попыток входа к одной учётке + новые IP из разных регионов за 3 минуты.', correct: true, explain: 'Похоже на credential stuffing / автоматизированный подбор.' },
          { text: 'Ночной бэкап и обновление антивирусных сигнатур.', correct: false, explain: 'Это ожидаемые технические процессы.' }
        ],
        success: 'Верно. Это инцидент высокого приоритета: блокировка, анализ и уведомление команды.'
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
