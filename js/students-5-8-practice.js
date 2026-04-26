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

  const detectiveRounds = [
    {
      context: 'Сообщение в школьном чате',
      message: 'Я из техподдержки дневника. Срочно пришли код из SMS, иначе тебе заблокируют вход.',
      risk: 'danger',
      reason: [
        'Настоящая поддержка не просит коды подтверждения.',
        'Есть давление временем: «срочно, иначе блокировка».',
        'Запрос кода — попытка перехватить доступ к аккаунту.'
      ],
      safeMove: 'Игнорировать сообщение, сделать скрин и сообщить учителю/родителю.'
    },
    {
      context: 'Письмо от онлайн-игры',
      message: 'Новая акция уже в профиле. Проверь её через приложение в разделе «События».',
      risk: 'safe',
      reason: [
        'Нет требования отправить пароль или код.',
        'Предлагают открыть раздел внутри официального приложения.',
        'Нет запугивания и нереалистичных обещаний.'
      ],
      safeMove: 'Проверить акцию только в официальном приложении.'
    },
    {
      context: 'Сайт для голосования за конкурс',
      message: 'URL: htps://school-vote-prize.com/login. Форма требует логин, пароль и номер карты «для верификации».',
      risk: 'danger',
      reason: [
        'Подозрительный адрес и ошибка в протоколе (htps).',
        'Запрос банковских данных для «голосования» неадекватен.',
        'Сайт маскируется под школьную активность.'
      ],
      safeMove: 'Не вводить данные, закрыть вкладку и проверить конкурс через официальный канал школы.'
    },
    {
      context: 'Сообщение от друга в мессенджере',
      message: 'Смотри, это я на видео! https://video-share.example/funny — ссылка выглядит короткой и непонятной.',
      risk: 'danger',
      reason: [
        'Необычное поведение друга и типичная приманка «это ты на видео».',
        'Ссылка непонятная и не связана с известным сервисом.',
        'Взломанные аккаунты часто рассылают такие сообщения.'
      ],
      safeMove: 'Спросить друга другим способом и не открывать ссылку до подтверждения.'
    },
    {
      context: 'Уведомление от школьной платформы',
      message: 'Новый материал доступен в твоём кабинете. Открой платформу через свою закладку.',
      risk: 'safe',
      reason: [
        'Сообщение нейтральное, без запроса данных.',
        'Совет перейти через закладку — признак безопасного сценария.',
        'Нет сомнительных бонусов или угроз.'
      ],
      safeMove: 'Открыть кабинет через привычную закладку и проверить, есть ли материал.'
    },
    {
      context: 'Личное сообщение в соцсети',
      message: 'Привет! Я из службы безопасности. Подтверди личность: отправь дату рождения и код из SMS.',
      risk: 'danger',
      reason: [
        'Личные данные и код запрашивают в личке — это небезопасно.',
        'Официальная поддержка обычно работает через встроенные формы сервиса.',
        'Просьба о коде подтверждения — прямой риск взлома.'
      ],
      safeMove: 'Не отвечать, пожаловаться на аккаунт и включить двухфакторную защиту.'
    },
    {
      context: 'Письмо от школьного кружка',
      message: 'Напоминаем: встреча в 16:00. Программа на сайте школы в разделе «Кружки».',
      risk: 'safe',
      reason: [
        'Нет запроса логина, пароля или кода.',
        'Информация соответствует обычному формату объявлений.',
        'Переход предлагается через официальный сайт школы.'
      ],
      safeMove: 'Проверить раздел кружков через официальный портал школы.'
    },
    {
      context: 'Реклама в мессенджере',
      message: 'Скачай «ускоритель телефона», чтобы игра не лагала. Ссылка на APK в чате.',
      risk: 'danger',
      reason: [
        'Установка APK из неизвестного источника опасна.',
        'Обещание «суперускорения» — типичная приманка.',
        'Нет подтверждения, кто отправил файл и что внутри.'
      ],
      safeMove: 'Не скачивать APK, удалять сообщение и проверять устройство только через официальные магазины.'
    },
    {
      context: 'Сообщение от сервиса музыки',
      message: 'Ваш пароль недавно изменён. Если это были вы — ничего делать не нужно.',
      risk: 'safe',
      reason: [
        'Информационное уведомление без требований отправить данные.',
        'Нет внешних подозрительных ссылок и срочного давления.',
        'Предлагается только проверить настройки аккаунта.'
      ],
      safeMove: 'Если изменение не ваше, зайти через приложение и сменить пароль.'
    },
    {
      context: 'Окно в браузере',
      message: 'Ваш браузер заражён! Нажмите «Исправить сейчас», чтобы установить защиту.',
      risk: 'danger',
      reason: [
        'Пугающее всплывающее окно с давлением времени.',
        'Предложение установить неизвестную программу из рекламы.',
        'Фейковые «антивирусные» окна часто ведут на вредоносные сайты.'
      ],
      safeMove: 'Закрыть вкладку, не нажимать баннер и проверить устройство штатным антивирусом.'
    },
    {
      context: 'Письмо от библиотеки',
      message: 'Книга готова к выдаче. Заберите её до пятницы, номер заказа в личном кабинете.',
      risk: 'safe',
      reason: [
        'Тема сообщения ожидаема и логична.',
        'Нет просьб о паролях и кодах.',
        'Данные предлагается смотреть в личном кабинете.'
      ],
      safeMove: 'Проверить заказ, войдя в кабинет через сохранённую закладку.'
    },
    {
      context: 'Псевдо-опрос',
      message: 'Пройди опрос от банка и получи 3000 ₽. Для перевода награды введи номер карты и CVV.',
      risk: 'danger',
      reason: [
        'Запрос CVV — критически опасный признак.',
        'Слишком выгодная награда за простое действие.',
        'Банк не просит такие данные в случайных опросах.'
      ],
      safeMove: 'Игнорировать сообщение, не вводить банковские данные и сообщить взрослому.'
    }
  ];

  const shieldCases = [
    {
      incident: 'Однокласснику пришло письмо «Вы выиграли планшет, введите пароль от почты для получения».',
      options: [
        { label: 'Быстро ввести пароль, чтобы не потерять приз.', effect: -2, tip: 'Пароль нельзя вводить ради «приза». Это ловушка.' },
        { label: 'Проверить отправителя, обсудить с учителем и удалить письмо.', effect: 3, tip: 'Отлично: проверка + обращение к взрослому = безопасно.' },
        { label: 'Переслать всем друзьям: вдруг это правда.', effect: -1, tip: 'Так можно распространить фишинг на других.' }
      ]
    },
    {
      incident: 'В чате класса неизвестный просит «скинуть фото пропуска школы для проверки списков».',
      options: [
        { label: 'Отправить фото, чтобы не было проблем со входом.', effect: -2, tip: 'Документы и пропуска нельзя отправлять незнакомым.' },
        { label: 'Отказаться, уточнить информацию у классного руководителя.', effect: 3, tip: 'Правильный путь: проверка через официальный канал.' },
        { label: 'Замазать имя, но отправить фото.', effect: -1, tip: 'Даже частично скрытый документ может быть опасен.' }
      ]
    },
    {
      incident: 'Друг установил «читы» из случайного сайта, и теперь компьютер просит срочно заплатить за разблокировку.',
      options: [
        { label: 'Заплатить, чтобы всё быстро заработало.', effect: -2, tip: 'Платёж мошенникам не гарантирует восстановление.' },
        { label: 'Отключить интернет, сообщить взрослому и проверить устройство антивирусом.', effect: 3, tip: 'Это грамотный антикризисный план.' },
        { label: 'Игнорировать окно и продолжать играть.', effect: -1, tip: 'Проблема обычно становится хуже без действий.' }
      ]
    },
    {
      incident: 'Тебе прислали «домашку в архиве», но файл называется home_task.exe.',
      options: [
        { label: 'Открыть файл — вдруг это просто формат.', effect: -2, tip: '.exe — исполняемый файл, это опасно.' },
        { label: 'Не открывать, попросить прислать файл в привычном формате (pdf/docx).', effect: 3, tip: 'Супер: безопасная проверка перед открытием.' },
        { label: 'Отправить файл другому, пусть он проверит первым.', effect: -1, tip: 'Так риск переносится на другого человека.' }
      ]
    },
    {
      incident: 'На смартфоне появилось приложение, которое ты не устанавливал(а), и оно просит доступ к контактам и SMS.',
      options: [
        { label: 'Разрешить доступ: вдруг без этого телефон сломается.', effect: -2, tip: 'Неизвестным приложениям нельзя давать чувствительные разрешения.' },
        { label: 'Удалить приложение, проверить список установок и сообщить взрослому.', effect: 3, tip: 'Это правильная реакция на подозрительное ПО.' },
        { label: 'Оставить приложение, но не открывать его.', effect: -1, tip: 'Даже в фоне приложение может собирать данные.' }
      ]
    },
    {
      incident: 'В игровом чате предлагают «прокачать аккаунт», если сообщить логин и одноразовый код.',
      options: [
        { label: 'Отправить данные, если у человека много подписчиков.', effect: -2, tip: 'Популярность не подтверждает честность.' },
        { label: 'Отказаться, включить 2FA и сменить пароль при малейшем сомнении.', effect: 3, tip: 'Так ты защищаешь аккаунт заранее.' },
        { label: 'Отправить только логин, без кода.', effect: -1, tip: 'Даже логин может помочь злоумышленнику.' }
      ]
    },
    {
      incident: 'Одноклассник просит скинуть фото банковской карты родителей «для оплаты экскурсии».',
      options: [
        { label: 'Сфотографировать карту с обеих сторон и отправить.', effect: -2, tip: 'Это критическое нарушение безопасности.' },
        { label: 'Не отправлять карту и уточнить оплату через учителя/родителей.', effect: 3, tip: 'Финансовые вопросы решаются только через взрослых и официальные каналы.' },
        { label: 'Отправить только номер карты без CVV.', effect: -1, tip: 'Даже частичные платёжные данные нельзя передавать в чатах.' }
      ]
    },
    {
      incident: 'Ты подключился(ась) к бесплатному Wi‑Fi в кафе, а сайт соцсети сразу просит заново ввести пароль.',
      options: [
        { label: 'Ввести пароль прямо сейчас, чтобы не терять время.', effect: -2, tip: 'Публичные сети могут подменять страницы входа.' },
        { label: 'Отключить Wi‑Fi и войти позже через мобильный интернет/домашнюю сеть.', effect: 3, tip: 'Это безопасный подход для защиты аккаунта.' },
        { label: 'Ввести только логин, пароль потом.', effect: -1, tip: 'Лучше вообще не вводить данные в подозрительной сети.' }
      ]
    },
    {
      incident: 'В классе распространили QR-код «с ответами на контрольную», ведущий на неизвестный сайт.',
      options: [
        { label: 'Сразу сканировать: шанс нельзя упускать.', effect: -2, tip: 'QR-коды тоже могут вести на фишинговые страницы.' },
        { label: 'Не открывать, проверить источник и предупредить одноклассников о риске.', effect: 3, tip: 'Ты защищаешь не только себя, но и других.' },
        { label: 'Сканировать на старом телефоне — если что, не жалко.', effect: -1, tip: 'Даже старое устройство может утечь личные данные.' }
      ]
    },
    {
      incident: 'Видеосервис показывает письмо: «Оплатите подписку сейчас, иначе аккаунт удалят через 10 минут».',
      options: [
        { label: 'Быстро оплатить по ссылке из письма.', effect: -2, tip: 'Оплата по ссылкам из пугающих писем часто небезопасна.' },
        { label: 'Зайти в аккаунт вручную через приложение и проверить статус подписки.', effect: 3, tip: 'Отличная проверка через официальный канал.' },
        { label: 'Переслать письмо друзьям, чтобы спросить, что делать.', effect: -1, tip: 'Так ты можешь распространить фишинговую ссылку.' }
      ]
    },
    {
      incident: 'Тебе предлагают установить «мод для дневника», который якобы автоматически исправляет оценки.',
      options: [
        { label: 'Установить — звучит полезно.', effect: -2, tip: 'Неофициальные «моды» для учебных сервисов опасны и могут красть данные.' },
        { label: 'Отказаться и сообщить о рассылке классному руководителю.', effect: 3, tip: 'Правильный шаг: пресечь риск для всего класса.' },
        { label: 'Скачать файл, но не запускать.', effect: -1, tip: 'Само скачивание уже может быть небезопасным.' }
      ]
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
    },
    detective: {
      title: 'Фишинг-детектив: чат и сайты',
      intro: '5 быстрых раундов. Твоя цель — собрать серию правильных решений и не дать себя запутать.',
      safeAction: 'Лучший детектив всегда проверяет источник, не спешит и не делится кодами/паролями.'
    },
    shield: {
      title: 'Киберщит школы',
      intro: 'Симулятор командной защиты: выбирай действия в инцидентах и набирай уровень киберщита.',
      safeAction: 'Сильная команда: проверяет факты, не делится приватными данными и сразу сообщает о рисках.'
    }
  };

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
  let activeScenario = null;
  let heightAnimTimer = null;
  let heightAnimFrameA = null;
  let heightAnimFrameB = null;

  function animateModalContentHeight(previousHeight) {
    const startHeight = typeof previousHeight === 'number' ? previousHeight : content.getBoundingClientRect().height;
    const endHeight = content.scrollHeight;

    if (Math.abs(startHeight - endHeight) < 2) return;

    clearTimeout(heightAnimTimer);
    if (heightAnimFrameA) cancelAnimationFrame(heightAnimFrameA);
    if (heightAnimFrameB) cancelAnimationFrame(heightAnimFrameB);

    content.style.willChange = 'height';
    content.style.overflow = 'hidden';
    content.style.transition = 'none';
    content.style.height = `${startHeight}px`;

    heightAnimFrameA = requestAnimationFrame(() => {
      heightAnimFrameB = requestAnimationFrame(() => {
        content.style.transition = 'height .34s cubic-bezier(.22,.61,.36,1)';
        content.style.height = `${endHeight}px`;
      });
    });

    heightAnimTimer = setTimeout(() => {
      content.style.transition = '';
      content.style.height = '';
      content.style.overflow = '';
      content.style.willChange = '';
    }, 380);
  }

  function renderWithHeightAnimation(renderFn) {
    const before = content.getBoundingClientRect().height;
    renderFn();
    animateModalContentHeight(before);
  }

  function showResultBlock(resultElement, html) {
    if (!resultElement) return;

    resultElement.classList.remove('is-visible');
    requestAnimationFrame(() => {
      resultElement.innerHTML = html;
      requestAnimationFrame(() => {
        resultElement.classList.add('is-visible');
        animateModalContentHeight();
      });
    });
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

  function renderDetectiveGame() {
    const rounds = shuffle(detectiveRounds).slice(0, 6);
    let roundIndex = 0;
    let score = 0;
    let streak = 0;

    const renderRound = () => {
      const current = rounds[roundIndex];
      renderWithHeightAnimation(() => {
        content.innerHTML = `
        <section class="game-panel">
          <p class="game-score">Раунд ${roundIndex + 1} / ${rounds.length} · Очки: ${score} · Серия: ${streak}</p>
          <p class="game-subtitle">${escapeHtml(scenarios.detective.intro)}</p>
          <div class="game-feedback">
            <p><strong>Сцена:</strong> ${escapeHtml(current.context)}</p>
            <p>${escapeHtml(current.message)}</p>
          </div>

          <div class="mail-decision-grid">
            <button type="button" class="game-button game-button-secondary" data-detective="danger">🚨 Это подозрительно</button>
            <button type="button" class="game-button game-button-secondary" data-detective="safe">✅ Похоже на нормальное</button>
          </div>

          <button type="button" class="game-button" id="detective-check-btn">Проверить решение</button>
          <div class="game-feedback" id="detective-result" aria-live="polite"></div>
        </section>
      `;
      });

      const choiceButtons = Array.from(content.querySelectorAll('[data-detective]'));
      const checkBtn = content.querySelector('#detective-check-btn');
      const result = content.querySelector('#detective-result');

      choiceButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          choiceButtons.forEach((item) => item.classList.remove('is-picked'));
          btn.classList.add('is-picked');
        });
      });

      checkBtn?.addEventListener('click', () => {
        const picked = content.querySelector('[data-detective].is-picked');
        if (!picked) {
          showResultBlock(result, '<p><strong>Сделай выбор:</strong> отметь, это безопасно или подозрительно.</p>');
          return;
        }

        const isCorrect = picked.dataset.detective === current.risk;
        score += isCorrect ? 2 : 0;
        streak = isCorrect ? streak + 1 : 0;

        choiceButtons.forEach((button) => {
          const correct = button.dataset.detective === current.risk;
          button.disabled = true;
          button.classList.add(correct ? 'game-answer-correct' : 'game-answer-wrong');
        });
        checkBtn.disabled = true;

        const reasons = current.reason.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
        const badge = isCorrect ? '🛡️ Верно!' : '🔎 Почти! Разберём внимательно.';

        showResultBlock(
          result,
          `<p><strong>${badge}</strong> ${isCorrect ? 'Плюс 2 очка к рейтингу детектива.' : 'В этом раунде очков нет.'}</p><ul>${reasons}</ul><p><strong>Безопасный ход:</strong> ${escapeHtml(current.safeMove)}</p>`
        );

        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'game-button';

        if (roundIndex + 1 < rounds.length) {
          nextBtn.textContent = 'Следующий раунд';
          nextBtn.addEventListener('click', () => {
            roundIndex += 1;
            renderRound();
          });
        } else {
          const maxScore = rounds.length * 2;
          const rank = score >= 8 ? 'Эксперт кибер-детектива' : score >= 5 ? 'Уверенный аналитик' : 'Новичок-разведчик';
          nextBtn.textContent = 'Сыграть снова';
          nextBtn.addEventListener('click', renderDetectiveGame);
          if (result) {
            result.innerHTML += `<p><strong>Итог:</strong> ${score} из ${maxScore}. Твой ранг: ${escapeHtml(rank)}.</p><p>${escapeHtml(scenarios.detective.safeAction)}</p>`;
            result.classList.add('is-visible');
          }
        }

        result?.insertAdjacentElement('afterend', nextBtn);
      });
    };

    renderRound();
  }

  function renderShieldGame() {
    const rounds = shuffle(shieldCases).slice(0, 5);
    let roundIndex = 0;
    let shieldLevel = 50;

    const renderRound = () => {
      const current = rounds[roundIndex];

      renderWithHeightAnimation(() => {
        content.innerHTML = `
        <section class="game-panel">
          <p class="game-score">Ситуация ${roundIndex + 1} / ${rounds.length}</p>
          <p class="game-subtitle">${escapeHtml(scenarios.shield.intro)}</p>
          <div class="game-feedback">
            <p><strong>Уровень киберщита:</strong> ${shieldLevel}%</p>
            <p>${escapeHtml(current.incident)}</p>
          </div>

          <div class="game-links">
            ${current.options
              .map(
                (option, idx) => `<button type="button" class="game-button game-button-secondary" data-shield="${option.effect}" data-shield-tip="${escapeHtml(option.tip)}">${idx + 1}. ${escapeHtml(option.label)}</button>`
              )
              .join('')}
          </div>

          <div class="game-feedback" id="shield-result" aria-live="polite"></div>
        </section>
      `;
      });

      const buttons = Array.from(content.querySelectorAll('[data-shield]'));
      const result = content.querySelector('#shield-result');
      let selected = null;

      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          if (selected) return;
          selected = button;

          const effect = Number(button.dataset.shield || 0);
          shieldLevel = Math.max(0, Math.min(100, shieldLevel + effect * 8));

          buttons.forEach((item) => {
            item.disabled = true;
            const value = Number(item.dataset.shield || 0);
            item.classList.add(value > 0 ? 'game-answer-correct' : 'game-answer-wrong');
          });

          const tip = button.dataset.shieldTip || '';
          const impact = effect > 0 ? 'Щит усилился ✅' : 'Щит просел ⚠️';
          showResultBlock(result, `<p><strong>${impact}</strong> Текущий уровень: ${shieldLevel}%.</p><p>${escapeHtml(tip)}</p>`);

          const nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.className = 'game-button';

          if (roundIndex + 1 < rounds.length) {
            nextBtn.textContent = 'Следующая ситуация';
            nextBtn.addEventListener('click', () => {
              roundIndex += 1;
              renderRound();
            });
          } else {
            const ending =
              shieldLevel >= 75
                ? 'Команда защищена отлично. Ты умеешь принимать зрелые решения в рисковых ситуациях.'
                : shieldLevel >= 50
                  ? 'Хороший результат. Ещё немного практики — и киберщит станет железным.'
                  : 'Щит просел. Повтори тренажёр и обрати внимание на проверку источников и данных.';
            nextBtn.textContent = 'Пройти тренажёр снова';
            nextBtn.addEventListener('click', renderShieldGame);
            if (result) {
              result.innerHTML += `<p><strong>Финал:</strong> ${shieldLevel}%.</p><p>${escapeHtml(ending)}</p><p>${escapeHtml(scenarios.shield.safeAction)}</p>`;
              result.classList.add('is-visible');
            }
          }

          result?.insertAdjacentElement('afterend', nextBtn);
        });
      });
    };

    renderRound();
  }

  function renderScenario(key) {
    activeScenario = scenarios[key];
    if (!activeScenario) return;

    title.textContent = activeScenario.title;

    if (key === 'mail') {
      renderMailGame();
      return;
    }

    if (key === 'site') {
      renderSiteGame();
      return;
    }

    if (key === 'detective') {
      renderDetectiveGame();
      return;
    }

    renderShieldGame();
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
