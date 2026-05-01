(function () {
  const root = document.getElementById('teacher-survey-game');
  if (!root) return;

  const questionEl = document.getElementById('survey-question');
  const modalEl = document.getElementById('survey-modal');
  const openCardEl = document.getElementById('teacher-survey-game');
  const closeBtn = document.getElementById('survey-close');
  const overlayEl = document.getElementById('survey-overlay');
  const optionsEl = document.getElementById('survey-options');
  const progressEl = document.getElementById('survey-progress');
  const nextBtn = document.getElementById('survey-next');
  const restartBtn = document.getElementById('survey-restart');
  const showAnswersBtn = document.getElementById('survey-show-answers');
  const reviewEl = document.getElementById('survey-review');
  const resultEl = document.getElementById('survey-result');
  const hintEl = document.getElementById('survey-hint');
  const dialogEl = modalEl?.querySelector('.teacher-survey-dialog');

  const bank = [
    {q:'Ученик получил письмо «Срочно подтвердите пароль». Что делать первым шагом?', a:[['Перейти по ссылке и проверить',0,'phishing'],['Проверить отправителя и адрес ссылки',2,'phishing'],['Ответить письмом и уточнить',0,'communication'],['Переслать другу для совета',1,'communication']]},
    {q:'Что лучше всего описывает надёжный пароль?', a:[['qwerty2026',0,'passwords'],['12+ символов, фразы, разные регистры и символы',2,'passwords'],['Один пароль на все сервисы, чтобы не забыть',0,'passwords'],['Только цифры, но длинный',1,'passwords']]},
    {q:'Какой сценарий безопаснее при подключении к Wi‑Fi в кафе?', a:[['Подключиться к любой сети без пароля',0,'network'],['Использовать VPN и отключить автоподключение',2,'network'],['Передать телефон другу как точку доступа без пароля',0,'network'],['Открыть только мессенджер — значит безопасно',1,'network']]},
    {q:'Что делает двухфакторная аутентификация?', a:[['Ускоряет интернет',0,'auth'],['Добавляет второй шаг проверки личности',2,'auth'],['Хранит все пароли в браузере',0,'auth'],['Удаляет вирусы автоматически',0,'malware']]},
    {q:'Что важнее при проверке новости?', a:[['Эмоциональный заголовок',0,'critical'],['Источник, дата, подтверждения в других медиа',2,'critical'],['Количество лайков',0,'critical'],['Если прислал знакомый — значит правда',0,'critical']]},
    {q:'Файл .exe от незнакомца лучше открыть...', a:[['Сразу, вдруг это важный материал',0,'malware'],['Только после проверки антивирусом/песочницей',2,'malware'],['На телефоне безопасно в любом случае',0,'malware'],['Переименовать — и можно запускать',0,'malware']]},
    {q:'Если аккаунт взломали, последовательность действий:', a:[['Сначала написать пост о взломе',0,'incident'],['Сменить пароль, завершить сессии, включить 2FA',2,'incident'],['Подождать — возможно само восстановится',0,'incident'],['Удалить приложение и забыть',0,'incident']]},
    {q:'Что такое цифровой след?', a:[['Только фото в соцсетях',0,'privacy'],['Любые данные и действия, оставляемые онлайн',2,'privacy'],['Следы курсора на экране',0,'privacy'],['История браузера за один день',1,'privacy']]},
    {q:'Какой пример социальной инженерии?', a:[['Бэкап файлов на диск',0,'backup'],['Звонок «из банка» с просьбой назвать код',2,'social'],['Обновление ОС',0,'updates'],['Сканирование антивирусом',0,'malware']]},
    {q:'Что лучше для хранения школьных проектов?', a:[['Один файл на рабочем столе',0,'backup'],['Версионирование + облако + локальная копия',2,'backup'],['Только флешка без копий',0,'backup'],['Отправить себе в чат и удалить оригинал',1,'backup']]},
    {q:'Почему нужно обновлять ПО?', a:[['Чтобы изменить иконки',0,'updates'],['Обновления закрывают уязвимости и ошибки',2,'updates'],['Это нужно только разработчикам',0,'updates'],['После обновления вирусов больше',0,'updates']]},
    {q:'Ученику предложили установить «чит» для игры. Верное решение:', a:[['Установить: это просто мод',0,'ethics'],['Отказаться: риск вредоноса и блокировки аккаунта',2,'ethics'],['Установить на школьный ПК, чтобы проверить',0,'ethics'],['Попросить друга установить первым',1,'ethics']]},
    {q:'Как лучше обсудить в классе подозрительную ссылку?', a:[['Публично открыть её на проекторе',0,'pedagogy'],['Разобрать признаки без открытия: домен, контекст, цель',2,'pedagogy'],['Игнорировать тему',0,'pedagogy'],['Переслать всем для тренировки',0,'pedagogy']]},
    {q:'Что повышает устойчивость класса к фишингу?', a:[['Один урок в году без практики',0,'pedagogy'],['Короткие регулярные тренировки и разбор ошибок',2,'pedagogy'],['Запрет интернета',0,'pedagogy'],['Только теория терминов',1,'pedagogy']]},
    {q:'Минимальный набор для безопасной школьной учетной записи:', a:[['Легкий пароль и открытый профиль',0,'auth'],['Сильный пароль, 2FA, резервная почта',2,'auth'],['Одинаковый пароль с другом',0,'auth'],['Отключенные уведомления о входе',0,'auth']]}
  ];

  const endings = [
    {min:0,max:5,title:'Стартовый уровень',tempo:'медленный',level:'базовый',plan:'Начните с терминов, демонстраций и практики «найди риск».'},
    {min:6,max:10,title:'Ниже базового',tempo:'медленный + повтор',level:'базовый',plan:'Добавьте больше примеров из повседневной жизни и карточки-подсказки.'},
    {min:11,max:15,title:'Базовый рабочий уровень',tempo:'средний',level:'базовый+',plan:'Можно переходить к мини-кейсам и парным обсуждениям.'},
    {min:16,max:20,title:'Уверенный уровень',tempo:'средний+',level:'средний',plan:'Давайте задания на аргументацию и анализ источников.'},
    {min:21,max:24,title:'Продвинутый старт',tempo:'быстрый',level:'средний+',plan:'Подойдут кейсы с несколькими векторами атак и защит.'},
    {min:25,max:28,title:'Экспертный потенциал',tempo:'быстрый+',level:'продвинутый',plan:'Переходите к ролевым моделированиям инцидента.'},
    {min:29,max:30,title:'Лидер группы',tempo:'проектный',level:'продвинутый+',plan:'Можно назначить наставником в командных задачах.'}
  ];

  const adviceByTag = {
    phishing:'Фокус урока: фишинг и проверка контекста ссылки.',
    passwords:'Фокус урока: политика паролей, менеджеры паролей.',
    network:'Фокус урока: публичные сети, VPN, безопасные настройки.',
    auth:'Фокус урока: 2FA и защита учётных записей.',
    critical:'Фокус урока: медиаграмотность и верификация информации.',
    malware:'Фокус урока: безопасный запуск файлов и сканирование.',
    incident:'Фокус урока: алгоритм реагирования на инцидент.',
    privacy:'Фокус урока: приватность и цифровой след.',
    social:'Фокус урока: социальная инженерия и манипуляции.',
    backup:'Фокус урока: резервное копирование и версии.',
    updates:'Фокус урока: обновления и уязвимости.',
    ethics:'Фокус урока: цифровая этика и ответственность.',
    pedagogy:'Фокус урока: командный разбор угроз и повторение.'
  };

  let selected = [];
  let idx = 0;
  let total = 0;
  let weaknesses = {};
  let reviewVisible = false;
  modalEl.hidden = true;
  showAnswersBtn.hidden = true;

  function openModal(event) {
    modalEl.hidden = false;
    centerDialogInViewport();
  }

  function closeModal() {
    modalEl.hidden = true;
  }

  function centerDialogInViewport() {
    if (!dialogEl) return;
    modalEl.style.position = 'absolute';
    modalEl.style.top = '0';
    modalEl.style.left = '0';
    modalEl.style.right = '0';
    modalEl.style.height = `${Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)}px`;
    dialogEl.style.left = `${window.innerWidth / 2}px`;
    dialogEl.style.top = `${window.scrollY + (window.innerHeight / 2)}px`;
  }

  openCardEl.addEventListener('click', openModal);
  openCardEl.addEventListener('keydown', (keyboardEvent) => {
    if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault();
      openModal();
    }
  });
  closeBtn.addEventListener('click', closeModal);
  overlayEl.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalEl.hidden) closeModal();
  });
  window.addEventListener('resize', () => {
    if (!modalEl.hidden) centerDialogInViewport();
  });
  window.addEventListener('scroll', () => {
    if (!modalEl.hidden) centerDialogInViewport();
  }, { passive: true });

  function render() {
    const current = bank[idx];
    questionEl.textContent = current.q;
    progressEl.textContent = `Вопрос ${idx + 1} из ${bank.length}`;
    optionsEl.innerHTML = '';
    nextBtn.disabled = selected[idx] === undefined;
    showAnswersBtn.hidden = true;

    current.a.forEach((option, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'teacher-survey-option' + (selected[idx] === i ? ' active' : '');
      btn.textContent = option[0];
      btn.addEventListener('click', () => {
        selected[idx] = i;
        render();
      });
      optionsEl.appendChild(btn);
    });

    hintEl.textContent = selected[idx] === undefined
      ? 'Выберите вариант ответа, чтобы продолжить.'
      : 'Ответ выбран. Нажмите «Далее».';
  }

  function calculate() {
    total = 0;
    weaknesses = {};
    bank.forEach((item, qIdx) => {
      const answerIdx = selected[qIdx];
      const answer = item.a[answerIdx];
      if (!answer) return;
      total += answer[1];
      if (answer[1] < 2) {
        weaknesses[answer[2]] = (weaknesses[answer[2]] || 0) + 1;
      }
    });
  }

  function showResult() {
    calculate();
    const ending = endings.find((e) => total >= e.min && total <= e.max) || endings[0];
    const sortedWeak = Object.entries(weaknesses).sort((a, b) => b[1] - a[1]).slice(0, 3);

    let focus = 'Сильных дефицитов не обнаружено — можно идти по расширенному сценарию.';
    if (sortedWeak.length) {
      focus = sortedWeak
        .map(([tag]) => adviceByTag[tag])
        .filter(Boolean)
        .join(' ');
    }

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <h5>Итог: ${ending.title}</h5>
      <p><strong>Баллы:</strong> ${total} / 30</p>
      <p><strong>Рекомендуемый темп:</strong> ${ending.tempo}</p>
      <p><strong>Уровень сложности:</strong> ${ending.level}</p>
      <p><strong>Методический план:</strong> ${ending.plan}</p>
      <p><strong>Приоритеты диагностики:</strong> ${focus}</p>
      <p><strong>Распределение готовности:</strong> базовая защита, критическое мышление, реакция на инциденты и цифровая этика.</p>
      <p><strong>Формат следующего шага:</strong> 10 минут разогрева + 20 минут практики + 10 минут обсуждения типичных ошибок.</p>
      <p><em>Ознакомьтесь с итогом — кнопка разбора ответов станет доступна через пару секунд.</em></p>
    `;
    showAnswersBtn.hidden = true;
    setTimeout(() => {
      if (!resultEl.hidden) showAnswersBtn.hidden = false;
    }, 2200);

    questionEl.textContent = 'Диагностика завершена ✅';
    optionsEl.innerHTML = '';
    nextBtn.disabled = true;
    progressEl.textContent = 'Готово';
    hintEl.textContent = 'Нажмите «Начать заново», чтобы провести опрос для другой группы.';
  }

  function renderAnswersReview() {
    const items = bank.map((item, i) => {
      const chosen = item.a[selected[i]];
      const best = item.a.find((ans) => ans[1] === 2);
      const isCorrect = chosen && chosen[1] === 2;
      return `<div class="teacher-survey-review-item">
        <p><strong>${i + 1}. ${item.q}</strong></p>
        <p>Ваш ответ: ${chosen ? chosen[0] : '—'} ${isCorrect ? '✅' : '❌'}</p>
        <p>Рекомендуемый ответ: ${best ? best[0] : '—'}</p>
      </div>`;
    }).join('');
    reviewEl.innerHTML = `<h5>Разбор ответов</h5>${items}`;
  }

  showAnswersBtn.addEventListener('click', () => {
    reviewVisible = !reviewVisible;
    if (reviewVisible) {
      renderAnswersReview();
      reviewEl.hidden = false;
      showAnswersBtn.textContent = 'Скрыть ответы';
    } else {
      reviewEl.hidden = true;
      showAnswersBtn.textContent = 'Посмотреть ответы';
    }
  });

  nextBtn.addEventListener('click', () => {
    if (selected[idx] === undefined) return;
    if (idx < bank.length - 1) {
      idx += 1;
      render();
    } else {
      showResult();
    }
  });

  restartBtn.addEventListener('click', () => {
    selected = [];
    idx = 0;
    total = 0;
    weaknesses = {};
    resultEl.hidden = true;
    resultEl.innerHTML = '';
    reviewVisible = false;
    reviewEl.hidden = true;
    reviewEl.innerHTML = '';
    showAnswersBtn.hidden = true;
    showAnswersBtn.textContent = 'Посмотреть ответы';
    render();
  });

  render();
})();
