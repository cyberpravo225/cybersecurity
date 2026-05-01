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


  function alignCardBeforeOpen(cardEl) {
    if (!cardEl) return;
    cardEl.scrollIntoView({ block: 'end', inline: 'center', behavior: 'auto' });
  }

  function openModal(event) {
    alignCardBeforeOpen(openCardEl);
    modalEl.hidden = false;
    centerDialogInViewport();
  }

  function closeModal() {
    modalEl.hidden = true;
  }

  function centerDialogInViewport() {
    if (!dialogEl) return;
    dialogEl.style.position = 'fixed';
    dialogEl.style.left = '50%';
    dialogEl.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 72px)';
    dialogEl.style.transform = 'translateX(-50%)';
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
(function () {
  const card = document.getElementById('teacher-case-game');
  if (!card) return;

  const modal = document.getElementById('teacher-case-modal');
  const overlay = document.getElementById('teacher-case-overlay');
  const closeBtn = document.getElementById('teacher-case-close');
  const meta = document.getElementById('teacher-case-meta');
  const nameEl = document.getElementById('teacher-case-name');
  const descEl = document.getElementById('teacher-case-description');
  const goalsEl = document.getElementById('teacher-case-goals');
  const constraintsEl = document.getElementById('teacher-case-constraints');
  const rubricEl = document.getElementById('teacher-case-rubric');
  const prevBtn = document.getElementById('teacher-case-prev');
  const nextBtn = document.getElementById('teacher-case-next');
  const randomBtn = document.getElementById('teacher-case-random');
  const dialog = modal?.querySelector('.teacher-case-dialog');

  const themes = ['Фишинг','Приватность','Пароли','Соцсети','Устройства','Wi‑Fi','ИИ и безопасность','Кибербуллинг'];
  const levels = ['Базовый','Средний','Продвинутый'];
  const grades = ['5–6 класс','7–8 класс','9–11 класс'];

  const rubricTemplate = [
    {name:'Анализ рисков', points:[0,2,4,5], hint:'Выявлены угрозы, уязвимости и возможные последствия.'},
    {name:'План защиты', points:[0,2,4,5], hint:'Предложены меры: профилактика, обнаружение, реакция.'},
    {name:'Аргументация', points:[0,2,4,5], hint:'Команда объясняет, почему решения реалистичны и эффективны.'},
    {name:'Командная работа', points:[0,2,4,5], hint:'Роли распределены, есть единая логика и синхронизация.'},
    {name:'Презентация решения', points:[0,2,4,5], hint:'Структурная защита проекта, понятные выводы и рекомендации.'}
  ];

  const cases = Array.from({ length: 40 }, (_, i) => {
    const theme = themes[i % themes.length];
    const level = levels[i % levels.length];
    const grade = grades[i % grades.length];
    const number = i + 1;
    return {
      id: number,
      title: `Кейс #${number}: ${theme} в школьной среде`,
      level,
      grade,
      scenario: `В школе произошла ситуация по теме «${theme}». Команда киберволонтёров должна расследовать инцидент и подготовить проект защиты для ${grade}.`,
      goals: [
        `Определить 3–5 ключевых рисков по теме «${theme}».`,
        'Подготовить алгоритм действий для ученика, учителя и родителя.',
        'Составить мини-памятку профилактики и чек-лист самопроверки.'
      ],
      constraints: [
        `Сложность: ${level}.`,
        'Время работы команды: 25 минут + 5 минут защита.',
        'Нельзя использовать персональные данные реальных учеников.'
      ],
      rubric: rubricTemplate
    };
  });

  let index = 0;

  function drawList(el, items) {
    el.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
  }

  function renderRubric(rubric) {
    rubricEl.innerHTML = `
      <h5>Рубрика проверки (максимум 25 баллов)</h5>
      ${rubric.map((row) => `
        <article class="teacher-case-rubric-item">
          <p><strong>${row.name}</strong></p>
          <p>Баллы: ${row.points.join(' / ')}</p>
          <p>${row.hint}</p>
        </article>
      `).join('')}
    `;
  }

  function renderCase() {
    const item = cases[index];
    meta.textContent = `Кейс ${index + 1} из ${cases.length} · ${item.grade} · ${item.level}`;
    nameEl.textContent = item.title;
    descEl.textContent = item.scenario;
    drawList(goalsEl, item.goals);
    drawList(constraintsEl, item.constraints);
    renderRubric(item.rubric);
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === cases.length - 1;
  }


  function alignCardBeforeOpen(cardEl) {
    if (!cardEl) return;
    cardEl.scrollIntoView({ block: 'end', inline: 'center', behavior: 'auto' });
  }

  function openModal() {
    alignCardBeforeOpen(card);
    modal.hidden = false;
    centerDialogInViewport();
    renderCase();
  }
  function closeModal() { modal.hidden = true; }

  function centerDialogInViewport() {
    if (!dialog) return;
    dialog.style.position = 'fixed';
    dialog.style.left = '50%';
    dialog.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 72px)';
    dialog.style.transform = 'translateX(-50%)';
  }

  card.addEventListener('click', openModal);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal();
    }
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
  window.addEventListener('resize', () => {
    if (!modal.hidden) centerDialogInViewport();
  });
  window.addEventListener('scroll', () => {
    if (!modal.hidden) centerDialogInViewport();
  }, { passive: true });


  prevBtn.addEventListener('click', () => {
    if (index > 0) index -= 1;
    renderCase();
  });
  nextBtn.addEventListener('click', () => {
    if (index < cases.length - 1) index += 1;
    renderCase();
  });
  randomBtn.addEventListener('click', () => {
    index = Math.floor(Math.random() * cases.length);
    renderCase();
  });
})();
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("teacher-game-modal");
  const overlay = document.getElementById("teacher-game-overlay");
  const closeBtn = document.getElementById("teacher-game-close");
  const title = document.getElementById("teacher-game-title");
  const description = document.getElementById("teacher-game-description");
  const content = document.getElementById("teacher-game-content");
  const scenarioCard = document.getElementById("teachers-game-scenario");
  const phishingCard = document.getElementById("teachers-game-phishing");
  const dialog = modal.querySelector(".teacher-game-dialog");

  if (!modal || !overlay || !closeBtn || !title || !description || !content || !scenarioCard || !phishingCard) return;

  const templates = {
    scenario: {
      title: "Игра сценариев: «Что делать в первые 10 минут?»",
      description: "Дайте командам по 3 минуты на шаг. После обсуждения каждая команда защищает план реагирования.",
      html: `
        <ol>
          <li><strong>Ситуация:</strong> ученик получил письмо с «оценками» и открыл вложение.</li>
          <li><strong>Задание 1:</strong> назовите 3 первых действия учителя и администратора.</li>
          <li><strong>Задание 2:</strong> определите, какую информацию и кому сообщить.</li>
          <li><strong>Задание 3:</strong> составьте мини-чеклист профилактики на будущее.</li>
        </ol>
      `
    },
    phishing: {
      title: "Детектив фишинга: «Найди 5 признаков»",
      description: "Покажите задание на экране и попросите учеников объяснить каждый найденный признак риска.",
      html: `
        <ul>
          <li>Подозрительный адрес отправителя и несовпадение домена.</li>
          <li>Срочность и давление: «срочно подтвердите аккаунт».</li>
          <li>Ошибки в тексте и неестественные формулировки.</li>
          <li>Ссылка с маскировкой (текст ссылки ≠ реальный адрес).</li>
          <li>Запрос личных данных или пароля в письме.</li>
        </ul>
      `
    }
  };


  const alignCardBeforeOpen = (cardEl) => {
    if (!cardEl) return;
    cardEl.scrollIntoView({ block: "end", inline: "center", behavior: "auto" });
  };

  const openModal = (gameType, sourceCard) => {
    const game = templates[gameType];
    if (!game) return;
    title.textContent = game.title;
    description.textContent = game.description;
    content.innerHTML = game.html;
    alignCardBeforeOpen(sourceCard);
    modal.hidden = false;
    centerDialogInViewport();
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  };

  const centerDialogInViewport = () => {
    if (!dialog) return;
    dialog.style.position = "fixed";
    dialog.style.left = "50%";
    dialog.style.bottom = "calc(env(safe-area-inset-bottom, 0px) + 72px)";
    dialog.style.transform = "translateX(-50%)";
  };

  scenarioCard.addEventListener("click", () => openModal("scenario", scenarioCard));
  phishingCard.addEventListener("click", () => openModal("phishing", phishingCard));
  scenarioCard.addEventListener("keydown", (event) => event.key === "Enter" && openModal("scenario", scenarioCard));
  phishingCard.addEventListener("keydown", (event) => event.key === "Enter" && openModal("phishing", phishingCard));
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
  window.addEventListener("resize", () => {
    if (!modal.hidden) centerDialogInViewport();
  });
  window.addEventListener("scroll", () => {
    if (!modal.hidden) centerDialogInViewport();
  }, { passive: true });
});
