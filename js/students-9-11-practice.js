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

  const ROUNDS_PER_CARD = 5;

  const cards = [
    {
      id: 'mail-forensics-lab',
      type: 'lab',
      icon: '📬',
      title: 'Лаба: Почтовая форензика',
      description: 'Разбор фишинга на уровне центра мониторинга.',
      level: 'Продвинуто',
      duration: '10 мин',
      bank: 'mail'
    },
    {
      id: 'site-verification-lab',
      type: 'lab',
      icon: '🌐',
      title: 'Лаба: Проверка сайта',
      description: 'Проверка источников за 90 секунд.',
      level: 'Продвинуто',
      duration: '8 мин',
      bank: 'site'
    },
    {
      id: 'detective-pro-game',
      type: 'game',
      icon: '🕵️',
      title: 'Игра: Фишинг-детектив Профи',
      description: 'Найди атаку среди сообщений.',
      level: 'Профи',
      duration: '7 мин',
      bank: 'detective'
    },
    {
      id: 'school-shield-game',
      type: 'game',
      icon: '🛡️',
      title: 'Игра: Киберщит школы',
      description: 'Командное реагирование на инцидент.',
      level: 'Команда',
      duration: '9 мин',
      bank: 'shield'
    }
  ];

  const makeSingleRound = (intro, question, answers, success) => ({
    mode: 'single',
    intro,
    question,
    answers,
    success
  });

  const makeMultiRound = (intro, question, answers, success) => ({
    mode: 'multi',
    intro,
    question,
    answers,
    success
  });

  const roundBanks = {
    mail: [
      makeMultiRound('Письмо: «Срочно подтвердите вход».', 'Что указывает на фишинг?', [
        { text: 'Просят код двухфакторной защиты.', correct: true, explain: 'Код подтверждения нельзя передавать.' },
        { text: 'Домен почти как у школы, но с лишними символами.', correct: true, explain: 'Поддельный домен — частый признак атаки.' },
        { text: 'Обычное расписание кружков без ссылок.', correct: false, explain: 'Такое письмо не выглядит опасным.' },
        { text: 'Фраза «время истекает через 10 минут».', correct: true, explain: 'Давление временем — манипуляция.' }
      ], 'Верно: ты выделил ключевые признаки атаки.'),
      makeSingleRound('Письмо от «службы поддержки».', 'Какое действие первое?', [
        { text: 'Сразу перейти по ссылке.', correct: false, explain: 'Это повышает риск компрометации.' },
        { text: 'Проверить адрес отправителя и домен ссылки.', correct: true, explain: 'Проверка адреса — базовый защитный шаг.' },
        { text: 'Переслать письмо всему классу.', correct: false, explain: 'Так можно распространить фишинг.' },
        { text: 'Отправить пароль в ответ.', correct: false, explain: 'Пароль нельзя отправлять по почте.' }
      ], 'Отлично: начинаем с верификации источника.'),
      makeSingleRound('Письмо о «выигрыше планшета».', 'Что наиболее подозрительно?', [
        { text: 'Просьба ввести данные карты для «получения приза».', correct: true, explain: 'Это типичный сценарий мошенничества.' },
        { text: 'Логотип компании в шапке письма.', correct: false, explain: 'Логотип можно легко подделать.' },
        { text: 'Подпись «С уважением».', correct: false, explain: 'Подпись не подтверждает подлинность.' },
        { text: 'Грамотный текст без ошибок.', correct: false, explain: 'Безошибочный текст не гарантирует безопасность.' }
      ], 'Верно: запрос платёжных данных — красный флаг.'),
      makeMultiRound('Серия писем за 5 минут.', 'Какие признаки говорят о целевой рассылке?', [
        { text: 'Одинаковые темы и срочные призывы.', correct: true, explain: 'Шаблонность и срочность характерны для кампании.' },
        { text: 'Одинаковая ссылка в каждом письме.', correct: true, explain: 'Единый вредоносный ресурс во всех письмах.' },
        { text: 'Письма приходят с официального школьного сервера.', correct: false, explain: 'Если сервер официальный — это не признак атаки само по себе.' },
        { text: 'Письма просят не говорить никому.', correct: true, explain: 'Изоляция жертвы — приём социальной инженерии.' }
      ], 'Точно: ты увидел паттерн фишинговой кампании.'),
      makeSingleRound('Письмо требует «обновить аккаунт».', 'Что делать?', [
        { text: 'Открыть сервис через закладку и проверить уведомления.', correct: true, explain: 'Переход через закладку безопаснее.' },
        { text: 'Ответить и попросить пароль у поддержки.', correct: false, explain: 'Пароль никому не сообщают.' },
        { text: 'Скачать вложение и запустить.', correct: false, explain: 'Вложения из сомнительных писем опасны.' },
        { text: 'Переслать письмо друзьям.', correct: false, explain: 'Это может увеличить число жертв.' }
      ], 'Отлично: выбран безопасный канал проверки.'),
      makeSingleRound('В письме ссылка с сокращателем.', 'Лучшее решение?', [
        { text: 'Открыть, если пришло от знакомого.', correct: false, explain: 'Аккаунт знакомого мог быть взломан.' },
        { text: 'Проверить ссылку через официальный источник сервиса.', correct: true, explain: 'Проверка источника снижает риск.' },
        { text: 'Отправить код из СМС в ответ.', correct: false, explain: 'Коды подтверждения нельзя передавать.' },
        { text: 'Игнорировать антивирусные предупреждения.', correct: false, explain: 'Предупреждения нужно учитывать.' }
      ], 'Верно: сначала проверяем источник.'),
      makeMultiRound('Письмо якобы от школьного администратора.', 'Какие детали подозрительны?', [
        { text: 'Просьба прислать пароль для «проверки».', correct: true, explain: 'Пароль никогда не запрашивают.' },
        { text: 'Обещание отключения аккаунта через 15 минут.', correct: true, explain: 'Давление сроками — манипуляция.' },
        { text: 'Наличие имени и фамилии администратора.', correct: false, explain: 'Имя легко подделать.' },
        { text: 'Ссылка ведёт на домен, не связанный со школой.', correct: true, explain: 'Несоответствие домена — риск.' }
      ], 'Отлично: ты выявил набор опасных признаков.'),
      makeSingleRound('Письмо про «необычный вход».', 'Как правильно проверить?', [
        { text: 'Войти через ссылку из письма.', correct: false, explain: 'Ссылка может быть фишинговой.' },
        { text: 'Зайти в сервис вручную и проверить сессии.', correct: true, explain: 'Проверка через официальный вход безопасна.' },
        { text: 'Сообщить код из уведомления.', correct: false, explain: 'Код не передают никому.' },
        { text: 'Отключить антивирус.', correct: false, explain: 'Это увеличит риск.' }
      ], 'Верно: контроль сессий через официальный вход — лучший шаг.'),
      makeSingleRound('Письмо от «онлайн-магазина».', 'Что критично?', [
        { text: 'Просьба подтвердить карту и защитный код.', correct: true, explain: 'Это попытка кражи платёжных данных.' },
        { text: 'Вежливое обращение по имени.', correct: false, explain: 'Это не показатель безопасности.' },
        { text: 'Наличие кнопки «Подробнее».', correct: false, explain: 'Кнопка сама по себе ничего не доказывает.' },
        { text: 'Использован синий цвет в дизайне.', correct: false, explain: 'Дизайн легко копируется.' }
      ], 'Точно: запрос данных карты недопустим.'),
      makeMultiRound('Подозрительное письмо в школьной почте.', 'Что делать сразу?', [
        { text: 'Не переходить по ссылкам.', correct: true, explain: 'Это снижает риск заражения.' },
        { text: 'Сообщить о письме ответственному взрослому/учителю.', correct: true, explain: 'Эскалация помогает защитить остальных.' },
        { text: 'Ввести пароль, чтобы «закрыть уведомление».', correct: false, explain: 'Так теряется доступ к аккаунту.' },
        { text: 'Удалить письмо после фиксации признаков.', correct: true, explain: 'Сначала фиксируем, затем очищаем почту.' }
      ], 'Отлично: безопасный алгоритм выполнен.'),
      makeSingleRound('Письмо «получи бонус за вход».', 'Главный риск?', [
        { text: 'Переход на поддельную страницу входа.', correct: true, explain: 'Это путь к краже данных.' },
        { text: 'Слишком яркий дизайн.', correct: false, explain: 'Цвета не определяют угрозу.' },
        { text: 'Длинный текст.', correct: false, explain: 'Длина письма не критерий безопасности.' },
        { text: 'Наличие вложения PDF.', correct: false, explain: 'PDF не всегда вредоносен сам по себе.' }
      ], 'Верно: ключевая угроза — фишинговый вход.'),
      makeSingleRound('Письмо с темой «Обновление дневника».', 'Лучший ответ?', [
        { text: 'Перейти только через официальную закладку.', correct: true, explain: 'Так исключается поддельная ссылка.' },
        { text: 'Отправить ответное письмо с паролем.', correct: false, explain: 'Пароль нельзя пересылать.' },
        { text: 'Скачать и открыть любое вложение.', correct: false, explain: 'Неизвестные вложения опасны.' },
        { text: 'Ничего не проверять.', correct: false, explain: 'Нужна проверка источника.' }
      ], 'Отлично: выбран безопасный путь входа.'),
      makeSingleRound('Письмо от «банка» ученику.', 'Что явно указывает на обман?', [
        { text: 'Просьба сообщить код из СМС и пароль.', correct: true, explain: 'Это прямой сценарий мошенничества.' },
        { text: 'Наличие подписи менеджера.', correct: false, explain: 'Подпись не гарантирует подлинность.' },
        { text: 'Тема письма в верхнем регистре.', correct: false, explain: 'Формат темы не главный критерий.' },
        { text: 'Короткий текст сообщения.', correct: false, explain: 'Короткий текст не равно атака.' }
      ], 'Верно: запрос кода и пароля — критический риск.')
    ],
    site: [
      makeSingleRound('Страница входа «для бонуса».', 'Что первое проверять?', [
        { text: 'Домен сайта и соответствие официальному адресу.', correct: true, explain: 'Проверка домена — базовый шаг.' },
        { text: 'Цвет кнопки входа.', correct: false, explain: 'Дизайн легко копируется.' },
        { text: 'Количество картинок.', correct: false, explain: 'Это не критерий безопасности.' },
        { text: 'Размер шрифта.', correct: false, explain: 'Шрифт не определяет подлинность.' }
      ], 'Верно: начинаем с проверки адреса.'),
      makeMultiRound('Сайт просит личные данные.', 'Какие требования недопустимы для входа?', [
        { text: 'Запрос защитного кода карты.', correct: true, explain: 'Это признак мошенничества.' },
        { text: 'Запрос пароля и кода подтверждения одновременно.', correct: true, explain: 'Так пытаются перехватить доступ.' },
        { text: 'Запрос логина.', correct: false, explain: 'Логин может быть нормальной частью входа.' },
        { text: 'Запрос фото паспорта для «быстрой проверки».', correct: true, explain: 'Для школьного входа это избыточно.' }
      ], 'Точно: выявлены ключевые недопустимые требования.'),
      makeSingleRound('Сайт похож на официальный.', 'Что решает?', [
        { text: 'Совпадение точного домена.', correct: true, explain: 'Подлинность адреса важнее внешнего вида.' },
        { text: 'Красивый логотип.', correct: false, explain: 'Логотип можно скопировать.' },
        { text: 'Наличие анимации.', correct: false, explain: 'Анимация не признак безопасности.' },
        { text: 'Срочный таймер на странице.', correct: false, explain: 'Таймер чаще является манипуляцией.' }
      ], 'Верно: домен — главный ориентир.'),
      makeSingleRound('Всплывающее окно «браузер заражён».', 'Как действовать?', [
        { text: 'Закрыть вкладку и не скачивать «лечащий» файл.', correct: true, explain: 'Это типичная вредоносная реклама.' },
        { text: 'Скачать предложенную программу.', correct: false, explain: 'Можно заразить устройство.' },
        { text: 'Отключить защиту браузера.', correct: false, explain: 'Это увеличит риск.' },
        { text: 'Отправить данные карты для «активации».', correct: false, explain: 'Это мошенничество.' }
      ], 'Отлично: выбран безопасный вариант.'),
      makeMultiRound('Проверка подозрительной страницы.', 'Какие индикаторы опасны?', [
        { text: 'Домен содержит случайные слова и символы.', correct: true, explain: 'Это частый признак подделки.' },
        { text: 'Страница обещает приз за мгновенный вход.', correct: true, explain: 'Лёгкая выгода часто используется как приманка.' },
        { text: 'На сайте есть раздел «Контакты».', correct: false, explain: 'Раздел можно подделать.' },
        { text: 'Форма требует слишком много персональных данных.', correct: true, explain: 'Избыточный сбор данных опасен.' }
      ], 'Верно: отмечены реальные признаки фишинга.'),
      makeSingleRound('Сайт копирует дневник школы.', 'Что важнее всего?', [
        { text: 'Переходить только через официальный портал/закладку.', correct: true, explain: 'Это снижает риск поддельных копий.' },
        { text: 'Проверять только дизайн страницы.', correct: false, explain: 'Дизайн легко скопировать.' },
        { text: 'Игнорировать адресную строку.', correct: false, explain: 'Это опасно.' },
        { text: 'Отключить защиту браузера.', correct: false, explain: 'Защиту отключать нельзя.' }
      ], 'Правильно: официальный путь входа — приоритет.'),
      makeSingleRound('На сайте просят код из СМС.', 'Как оценить?', [
        { text: 'Это критический риск, код вводить нельзя.', correct: true, explain: 'Код подтверждения — ключ к аккаунту.' },
        { text: 'Если сайт красивый, можно вводить.', correct: false, explain: 'Внешний вид не гарантирует безопасность.' },
        { text: 'Если знакомый прислал, можно вводить.', correct: false, explain: 'Аккаунт знакомого может быть взломан.' },
        { text: 'Если спешишь, можно не проверять.', correct: false, explain: 'Спешка увеличивает риск ошибки.' }
      ], 'Точно: код подтверждения нельзя вводить на сомнительных страницах.'),
      makeMultiRound('Сайт с акцией «только сейчас».', 'Какие шаги верные?', [
        { text: 'Проверить адрес сайта вручную.', correct: true, explain: 'Ручная проверка снижает риск.' },
        { text: 'Сравнить домен с официальным источником.', correct: true, explain: 'Совпадение домена критично.' },
        { text: 'Сразу вводить пароль ради скорости.', correct: false, explain: 'Это риск потерять аккаунт.' },
        { text: 'Не передавать коды и данные карты.', correct: true, explain: 'Это обязательное правило безопасности.' }
      ], 'Отлично: соблюдён безопасный алгоритм проверки.'),
      makeSingleRound('Сайт просит установить расширение.', 'Лучшее действие?', [
        { text: 'Отказаться и закрыть страницу.', correct: true, explain: 'Неизвестные расширения могут быть вредоносны.' },
        { text: 'Установить ради доступа.', correct: false, explain: 'Это может привести к утечке данных.' },
        { text: 'Отключить антивирус и установить.', correct: false, explain: 'Так риск ещё выше.' },
        { text: 'Передать ссылку всем друзьям.', correct: false, explain: 'Так можно распространить угрозу.' }
      ], 'Верно: неизвестные расширения устанавливать нельзя.'),
      makeSingleRound('Форма входа не открывается без номера карты.', 'Это значит?', [
        { text: 'Сайт поддельный или опасный.', correct: true, explain: 'Для входа в учебный сервис карта не нужна.' },
        { text: 'Так работает любой официальный портал.', correct: false, explain: 'Это неправда.' },
        { text: 'Нужно просто обновить страницу и ввести данные.', correct: false, explain: 'Данные вводить нельзя.' },
        { text: 'Это временный технический сбой.', correct: false, explain: 'Требование карты — не норма.' }
      ], 'Точно: требование карты для входа — признак обмана.'),
      makeMultiRound('Проверка домена школьного портала.', 'Какие признаки нормального сценария?', [
        { text: 'Точный официальный домен.', correct: true, explain: 'Это главный положительный признак.' },
        { text: 'Нет требований сообщить коды подтверждения.', correct: true, explain: 'Официальные сервисы не запрашивают такие коды в чате.' },
        { text: 'Есть таймер «введите пароль за 30 секунд».', correct: false, explain: 'Таймер чаще связан с манипуляцией.' },
        { text: 'Вход через сохранённую закладку.', correct: true, explain: 'Это безопасный путь.' }
      ], 'Отлично: ты корректно различил безопасные признаки.'),
      makeSingleRound('Сайт с «проверкой личности».', 'Что важно помнить?', [
        { text: 'Лишние запросы персональных данных — риск.', correct: true, explain: 'Собирают лишние данные для злоупотребления.' },
        { text: 'Если есть значок замка, всё безопасно.', correct: false, explain: 'Замок не гарантирует честность сайта.' },
        { text: 'Скриншот паспорта — обычная проверка.', correct: false, explain: 'Для школьных сервисов это ненормально.' },
        { text: 'Надо действовать быстро и не проверять.', correct: false, explain: 'Нужно именно проверять.' }
      ], 'Верно: избыточный сбор данных — ключевой риск.'),
      makeSingleRound('Ты сомневаешься в сайте.', 'Какой самый безопасный шаг?', [
        { text: 'Закрыть страницу и зайти через официальный адрес.', correct: true, explain: 'Лучший путь — официальный источник.' },
        { text: 'Ввести данные и посмотреть, что будет.', correct: false, explain: 'Это опасный эксперимент.' },
        { text: 'Отключить защиту браузера.', correct: false, explain: 'Так риск повышается.' },
        { text: 'Игнорировать сомнения.', correct: false, explain: 'Сомнения — сигнал к проверке.' }
      ], 'Отлично: при сомнениях всегда выбираем официальный путь.')
    ],
    detective: [
      makeSingleRound('Чат класса: «Пришли код, я из поддержки».', 'Твой вердикт?', [
        { text: 'Подозрительно: возможная атака.', correct: true, explain: 'Поддержка не просит коды подтверждения.' },
        { text: 'Нормально, можно отправить код.', correct: false, explain: 'Код нельзя передавать.' },
        { text: 'Надо отправить пароль тоже.', correct: false, explain: 'Пароль тоже передавать нельзя.' },
        { text: 'Игнорировать и переслать всем.', correct: false, explain: 'Пересылка может навредить другим.' }
      ], 'Верно: это попытка социальной инженерии.'),
      makeSingleRound('Личное сообщение: «Это ты на видео?»', 'Что делать?', [
        { text: 'Проверить у друга другим каналом и не открывать ссылку.', correct: true, explain: 'Аккаунт друга могли взломать.' },
        { text: 'Сразу открыть ссылку.', correct: false, explain: 'Ссылка может быть вредоносной.' },
        { text: 'Отправить код подтверждения.', correct: false, explain: 'Код нельзя сообщать.' },
        { text: 'Установить файл из ссылки.', correct: false, explain: 'Это может быть вредоносное ПО.' }
      ], 'Отлично: верификация контакта — правильный шаг.'),
      makeSingleRound('Письмо: «Ваш пароль изменён».', 'Правильное действие?', [
        { text: 'Проверить аккаунт через официальное приложение.', correct: true, explain: 'Проверка через официальный канал безопасна.' },
        { text: 'Ввести пароль по ссылке из письма.', correct: false, explain: 'Ссылка может вести на фишинг.' },
        { text: 'Отправить код в ответ.', correct: false, explain: 'Код передавать нельзя.' },
        { text: 'Игнорировать всё.', correct: false, explain: 'Нужно проверить безопасность аккаунта.' }
      ], 'Верно: контроль через официальный канал.'),
      makeSingleRound('Реклама: «ускоритель телефона APK».', 'Вердикт?', [
        { text: 'Подозрительно, не устанавливать.', correct: true, explain: 'Неизвестные APK часто опасны.' },
        { text: 'Можно установить ради скорости.', correct: false, explain: 'Высокий риск заражения.' },
        { text: 'Отключить защиту и установить.', correct: false, explain: 'Это ещё опаснее.' },
        { text: 'Передать ссылку другу.', correct: false, explain: 'Так можно распространить угрозу.' }
      ], 'Точно: APK из чата — красный флаг.'),
      makeSingleRound('Чат: «Срочно! Учётку удалят».', 'Что это?', [
        { text: 'Манипуляция срочностью.', correct: true, explain: 'Так злоумышленники давят на эмоции.' },
        { text: 'Нормальное уведомление поддержки.', correct: false, explain: 'Поддержка так обычно не действует.' },
        { text: 'Безопасная инструкция.', correct: false, explain: 'Запрос данных делает её небезопасной.' },
        { text: 'Обычный школьный опрос.', correct: false, explain: 'Это не опрос.' }
      ], 'Верно: срочность + запрос данных = риск.'),
      makeSingleRound('Соцсеть: «Подтверди личность кодом».', 'Твой выбор?', [
        { text: 'Не отправлять код, пожаловаться на аккаунт.', correct: true, explain: 'Это защищает тебя и других.' },
        { text: 'Отправить код для проверки.', correct: false, explain: 'Код передавать нельзя.' },
        { text: 'Отправить пароль сразу.', correct: false, explain: 'Пароль тоже нельзя передавать.' },
        { text: 'Игнорировать и не блокировать.', correct: false, explain: 'Жалоба полезна для других пользователей.' }
      ], 'Отлично: верное решение по безопасности.'),
      makeSingleRound('Письмо от кружка: «встреча в 16:00».', 'Оценка?', [
        { text: 'Похоже на нормальное уведомление.', correct: true, explain: 'Нет запроса паролей и кодов.' },
        { text: 'Точно фишинг.', correct: false, explain: 'Признаков атаки недостаточно.' },
        { text: 'Надо срочно удалить аккаунт.', correct: false, explain: 'Нет оснований для таких мер.' },
        { text: 'Нужно отправить личные данные.', correct: false, explain: 'Такого запроса нет.' }
      ], 'Верно: признаки угрозы отсутствуют.'),
      makeSingleRound('Браузер: «Срочно исправить вирус».', 'Твой ход?', [
        { text: 'Закрыть вкладку и проверить устройство штатной защитой.', correct: true, explain: 'Это безопасный вариант.' },
        { text: 'Установить рекламируемую программу.', correct: false, explain: 'Можно получить вредоносное ПО.' },
        { text: 'Оплатить «чистку» на сайте.', correct: false, explain: 'Типичная мошенническая схема.' },
        { text: 'Отключить браузерную защиту.', correct: false, explain: 'Это опасно.' }
      ], 'Отлично: выбран безопасный сценарий.'),
      makeSingleRound('Сообщение: «Приз за опрос банка».', 'Что настораживает?', [
        { text: 'Просьба ввести данные карты и защитный код.', correct: true, explain: 'Это критический признак мошенничества.' },
        { text: 'Короткий текст.', correct: false, explain: 'Длина текста не главное.' },
        { text: 'Эмодзи в сообщении.', correct: false, explain: 'Эмодзи не показатель угрозы.' },
        { text: 'Приветствие по имени.', correct: false, explain: 'Имя не гарантирует подлинность.' }
      ], 'Верно: запрос данных карты — недопустим.'),
      makeSingleRound('Письмо: «Скачайте новый клиент дневника».', 'Лучшее решение?', [
        { text: 'Скачивать только из официального источника школы.', correct: true, explain: 'Только официальный источник безопасен.' },
        { text: 'Скачать из письма сразу.', correct: false, explain: 'Это риск заражения.' },
        { text: 'Отключить антивирус и скачать.', correct: false, explain: 'Так риск выше.' },
        { text: 'Попросить друга скачать первым.', correct: false, explain: 'Это не делает файл безопасным.' }
      ], 'Точно: проверенный источник обязателен.'),
      makeSingleRound('Сообщение в чате: «Я админ, дай доступ».', 'Как правильно?', [
        { text: 'Проверить личность через официальный канал.', correct: true, explain: 'Это защищает от подмены личности.' },
        { text: 'Передать доступ, чтобы не спорить.', correct: false, explain: 'Так можно потерять аккаунт.' },
        { text: 'Передать код подтверждения.', correct: false, explain: 'Код передавать нельзя.' },
        { text: 'Передать резервную почту.', correct: false, explain: 'Личные данные нельзя отдавать.' }
      ], 'Отлично: верификация личности — правильный подход.'),
      makeSingleRound('Письмо с вложением «оценки.xlsm».', 'Что важно помнить?', [
        { text: 'Макросы в неизвестных файлах могут быть опасны.', correct: true, explain: 'Макросы часто используются для заражения.' },
        { text: 'Любой файл от незнакомца безопасен.', correct: false, explain: 'Это неверно.' },
        { text: 'Нужно всегда включать макросы.', correct: false, explain: 'Это опасно.' },
        { text: 'Антивирус не нужен.', correct: false, explain: 'Защита нужна всегда.' }
      ], 'Верно: с макросами нужна осторожность.')
    ],
    shield: [
      makeSingleRound('В сети всплеск подозрительных входов.', 'Первый шаг команды?', [
        { text: 'Ограничить доступ и зафиксировать события.', correct: true, explain: 'Сначала локализация и фиксация.' },
        { text: 'Игнорировать до конца дня.', correct: false, explain: 'Промедление увеличивает ущерб.' },
        { text: 'Удалить все журналы.', correct: false, explain: 'Это уничтожит улики.' },
        { text: 'Отключить всё без анализа.', correct: false, explain: 'Нужен управляемый план.' }
      ], 'Отлично: грамотное начало реагирования.'),
      makeSingleRound('Есть подозрение на взлом учётки.', 'Что делать первым?', [
        { text: 'Сбросить пароль и завершить активные сессии.', correct: true, explain: 'Это останавливает развитие атаки.' },
        { text: 'Подождать до завтра.', correct: false, explain: 'Риск усилится.' },
        { text: 'Сообщить пароль в чат.', correct: false, explain: 'Это недопустимо.' },
        { text: 'Отключить мониторинг.', correct: false, explain: 'Мониторинг нужен именно сейчас.' }
      ], 'Верно: локализация должна быть быстрой.'),
      makeSingleRound('Неизвестный трафик на внешние домены.', 'Лучший ответ?', [
        { text: 'Сегментировать сеть и ограничить подозрительный трафик.', correct: true, explain: 'Так уменьшается риск распространения.' },
        { text: 'Ничего не делать.', correct: false, explain: 'Атака может развиваться.' },
        { text: 'Удалить логи и перезагрузить всё.', correct: false, explain: 'Потеряются артефакты.' },
        { text: 'Открыть все порты для проверки.', correct: false, explain: 'Это опасно.' }
      ], 'Точно: сегментация — правильный шаг.'),
      makeMultiRound('Команда готовит план реагирования.', 'Что должно входить в базовый план?', [
        { text: 'Фиксация событий и времени.', correct: true, explain: 'Хронология важна для расследования.' },
        { text: 'Роли и контакты ответственных.', correct: true, explain: 'Командная координация обязательна.' },
        { text: 'Передача паролей в общий чат.', correct: false, explain: 'Это нарушение безопасности.' },
        { text: 'Порядок уведомления администрации.', correct: true, explain: 'Коммуникация должна быть регламентирована.' }
      ], 'Отлично: план реагирования собран корректно.'),
      makeSingleRound('Вирусное письмо открыл сотрудник.', 'Первое действие?', [
        { text: 'Изолировать устройство от сети.', correct: true, explain: 'Это ограничит распространение.' },
        { text: 'Продолжить работу как обычно.', correct: false, explain: 'Риск заражения всей сети.' },
        { text: 'Удалить антивирус.', correct: false, explain: 'Это ухудшит безопасность.' },
        { text: 'Отправить файл коллегам.', correct: false, explain: 'Так можно заразить других.' }
      ], 'Верно: изоляция устройства — приоритет.'),
      makeSingleRound('Подозрение на подбор пароля.', 'Как уменьшить риск?', [
        { text: 'Включить блокировку после неудачных попыток и MFA.', correct: true, explain: 'Это ограничивает автоматические атаки.' },
        { text: 'Отключить журнал входов.', correct: false, explain: 'Логи нужны для контроля.' },
        { text: 'Сделать пароль короче.', correct: false, explain: 'Это ослабит защиту.' },
        { text: 'Разрешить общий пароль для класса.', correct: false, explain: 'Это недопустимо.' }
      ], 'Отлично: меры выбраны правильно.'),
      makeSingleRound('После инцидента нужно улучшить защиту.', 'Что полезнее всего?', [
        { text: 'Разобрать кейс и обновить регламент.', correct: true, explain: 'Так команда учится и снижает будущий риск.' },
        { text: 'Удалить все записи инцидента.', correct: false, explain: 'Нельзя терять опыт и факты.' },
        { text: 'Игнорировать произошедшее.', correct: false, explain: 'Ошибки повторятся.' },
        { text: 'Отключить уведомления.', correct: false, explain: 'Это ухудшит детектирование.' }
      ], 'Верно: пост-анализ обязателен.'),
      makeMultiRound('В школе обновляют базовую политику.', 'Какие меры необходимы?', [
        { text: 'Уникальные пароли для сервисов.', correct: true, explain: 'Повторы повышают риск массового взлома.' },
        { text: 'Двухфакторная защита для критичных учёток.', correct: true, explain: 'Это снижает риск захвата аккаунтов.' },
        { text: 'Хранение паролей в общем файле.', correct: false, explain: 'Так делать нельзя.' },
        { text: 'Обучение персонала по фишингу.', correct: true, explain: 'Люди — важная часть защиты.' }
      ], 'Отлично: выбран сильный набор базовых мер.'),
      makeSingleRound('Утечка данных уже подтверждена.', 'Что важно сделать?', [
        { text: 'Сообщить ответственным и начать контролируемое реагирование.', correct: true, explain: 'Нужна официальная координация.' },
        { text: 'Скрыть инцидент и ничего не документировать.', correct: false, explain: 'Это усугубит последствия.' },
        { text: 'Удалить все логи.', correct: false, explain: 'Логи нужны для расследования.' },
        { text: 'Передать доступ посторонним «помощникам».', correct: false, explain: 'Это риск дополнительного ущерба.' }
      ], 'Верно: формальное реагирование обязательно.'),
      makeSingleRound('Новый сотрудник просит админ-доступ.', 'Лучший подход?', [
        { text: 'Выдать минимально необходимые права.', correct: true, explain: 'Принцип минимальных привилегий снижает риск.' },
        { text: 'Выдать полный доступ всем.', correct: false, explain: 'Это небезопасно.' },
        { text: 'Дать общий пароль команды.', correct: false, explain: 'Общие пароли недопустимы.' },
        { text: 'Отключить журналирование.', correct: false, explain: 'Журналы должны сохраняться.' }
      ], 'Точно: минимум прав — базовый принцип защиты.'),
      makeSingleRound('В системе аномальная активность ночью.', 'Как действовать?', [
        { text: 'Проверить логи, источник и масштаб событий.', correct: true, explain: 'Сначала анализ фактов.' },
        { text: 'Игнорировать, если утром всё работает.', correct: false, explain: 'Это может быть скрытая атака.' },
        { text: 'Отключить всю сеть без уведомления.', correct: false, explain: 'Нужен план и координация.' },
        { text: 'Удалить учётки случайно.', correct: false, explain: 'Нельзя действовать хаотично.' }
      ], 'Верно: анализ + контроль = грамотное реагирование.'),
      makeSingleRound('Команда завершила инцидент.', 'Следующий шаг?', [
        { text: 'Провести разбор и обновить меры защиты.', correct: true, explain: 'Это снижает риск повторения.' },
        { text: 'Ничего не менять.', correct: false, explain: 'Проблемы повторятся.' },
        { text: 'Удалить все отчёты.', correct: false, explain: 'Отчёты нужны для обучения.' },
        { text: 'Отключить уведомления безопасности.', correct: false, explain: 'Это ухудшит обнаружение.' }
      ], 'Отлично: работа над ошибками завершает цикл защиты.')
    ]
  };

  const totalBankSize = Object.values(roundBanks).reduce((sum, items) => sum + items.length, 0);
  if (totalBankSize < 50) {
    return;
  }

  const cardTemplate = (item) => `
    <article class="senior-card game" data-practice-id="${item.id}" role="button" tabindex="0" aria-haspopup="dialog">
      <div class="senior-card-icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="senior-card-meta">
        <span class="senior-chip">${item.level || 'База'}</span>
        <span class="senior-chip senior-chip-time">⏱ ${item.duration || '6 мин'}</span>
      </div>
    </article>
  `;

  labsContainer.innerHTML = cards.filter((item) => item.type === 'lab').map(cardTemplate).join('');
  gamesContainer.innerHTML = cards.filter((item) => item.type === 'game').map(cardTemplate).join('');

  const cardMap = new Map(cards.map((item) => [item.id, item]));
  const practiceCards = Array.from(document.querySelectorAll('[data-practice-id]'));
  let activeSession = null;

  const shuffle = (array) => {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const getRoundsForCard = (card) => {
    const bank = roundBanks[card.bank] || [];
    return shuffle(bank).slice(0, ROUNDS_PER_CARD);
  };

  const openModal = (cardId) => {
    const card = cardMap.get(cardId);
    if (!card) return;

    const rounds = getRoundsForCard(card);
    activeSession = {
      card,
      rounds,
      roundIndex: 0,
      score: 0,
      answered: false
    };

    titleNode.textContent = card.title;
    renderRound();

    overlay.hidden = false;
    modal.hidden = false;
    overlay.classList.add('is-open');
    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    activeSession = null;
    overlay.classList.remove('is-open');
    modal.classList.remove('is-open');
    overlay.hidden = true;
    modal.hidden = true;
    contentNode.innerHTML = '';
    document.body.classList.remove('no-scroll');
  };

  const renderRound = () => {
    if (!activeSession) return;
    const { rounds, roundIndex, score } = activeSession;
    const round = rounds[roundIndex];
    if (!round) return;

    const progressText = `Раунд ${roundIndex + 1} из ${ROUNDS_PER_CARD}`;

    contentNode.innerHTML = `
      <div class="practice-layout">
        <p><strong>${progressText}</strong> · Очки: ${score}</p>
        <p><strong>${round.intro}</strong></p>
        <p>${round.question}</p>
        <div class="practice-answers">
          ${round.answers
            .map((answer, index) => {
              if (round.mode === 'multi') {
                return `<label class="game-link-card"><input type="checkbox" data-answer-index="${index}"> ${answer.text}</label>`;
              }
              return `<button class="game-button" type="button" data-answer-index="${index}">${answer.text}</button>`;
            })
            .join('')}
        </div>
        ${round.mode === 'multi' ? '<button class="game-button" type="button" id="senior-practice-check">Проверить выбор</button>' : ''}
        <div class="practice-feedback" id="senior-practice-feedback" aria-live="polite"></div>
      </div>
    `;
  };

  const goToNextRound = () => {
    if (!activeSession) return;
    activeSession.roundIndex += 1;
    activeSession.answered = false;

    if (activeSession.roundIndex >= ROUNDS_PER_CARD) {
      const finalScore = activeSession.score;
      const maxScore = ROUNDS_PER_CARD;
      contentNode.innerHTML = `
        <div class="practice-layout">
          <p><strong>Серия завершена!</strong></p>
          <p>Результат: ${finalScore} / ${maxScore}</p>
          <button class="game-button" type="button" id="senior-practice-restart">Новая серия из 5 раундов</button>
        </div>
      `;
      return;
    }

    renderRound();
  };

  const appendNextButton = (feedbackNode) => {
    if (!activeSession || !feedbackNode) return;
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'game-button';
    nextBtn.id = 'senior-practice-next';
    nextBtn.textContent = activeSession.roundIndex === ROUNDS_PER_CARD - 1 ? 'Завершить серию' : 'Следующий раунд';
    feedbackNode.appendChild(nextBtn);
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
    if (!activeSession) return;

    if (event.target.id === 'senior-practice-restart') {
      const { card } = activeSession;
      activeSession = {
        card,
        rounds: getRoundsForCard(card),
        roundIndex: 0,
        score: 0,
        answered: false
      };
      renderRound();
      return;
    }

    if (event.target.id === 'senior-practice-next') {
      goToNextRound();
      return;
    }

    const round = activeSession.rounds[activeSession.roundIndex];
    if (!round || activeSession.answered) return;

    if (event.target.id === 'senior-practice-check') {
      if (round.mode !== 'multi') return;

      const feedback = document.getElementById('senior-practice-feedback');
      if (!feedback) return;

      const checkboxes = Array.from(contentNode.querySelectorAll('input[type="checkbox"][data-answer-index]'));
      const selectedIndexes = checkboxes.filter((node) => node.checked).map((node) => Number(node.dataset.answerIndex));

      if (!selectedIndexes.length) {
        feedback.innerHTML = '<p>⚠️ Выбери хотя бы один пункт.</p>';
        return;
      }

      checkboxes.forEach((input) => {
        const index = Number(input.dataset.answerIndex);
        const answer = round.answers[index];
        const option = input.closest('.game-link-card');
        if (!answer || !option) return;
        option.classList.remove('game-answer-correct', 'game-answer-wrong');
        if (answer.correct) {
          option.classList.add('game-answer-correct');
        } else if (input.checked) {
          option.classList.add('game-answer-wrong');
        }
      });

      const selectedSet = new Set(selectedIndexes);
      const correctIndexes = round.answers.map((answer, index) => (answer.correct ? index : -1)).filter((index) => index >= 0);
      const allCorrect =
        selectedIndexes.every((index) => round.answers[index] && round.answers[index].correct) &&
        correctIndexes.every((index) => selectedSet.has(index));

      const explanations = selectedIndexes
        .map((index) => round.answers[index])
        .filter(Boolean)
        .map((item) => `<li>${item.correct ? '✅' : '⚠️'} ${item.explain}</li>`)
        .join('');

      if (allCorrect) {
        activeSession.score += 1;
      }

      const status = allCorrect ? '✅ Раунд пройден.' : '⚠️ В этом раунде есть ошибки.';
      const successText = allCorrect ? `<p><strong>${round.success}</strong></p>` : '';
      feedback.innerHTML = `<p>${status}</p><ul>${explanations}</ul>${successText}`;

      activeSession.answered = true;
      appendNextButton(feedback);
      return;
    }

    const button = event.target.closest('button[data-answer-index]');
    if (!button || round.mode !== 'single') return;

    const selected = Number(button.dataset.answerIndex);
    const choice = round.answers[selected];
    const feedback = document.getElementById('senior-practice-feedback');

    if (!choice || !feedback) return;

    const answerButtons = Array.from(contentNode.querySelectorAll('button[data-answer-index]'));
    answerButtons.forEach((node) => node.classList.remove('game-answer-correct', 'game-answer-wrong'));

    if (choice.correct) {
      button.classList.add('game-answer-correct');
      activeSession.score += 1;
    } else {
      button.classList.add('game-answer-wrong');
      const correctIndex = round.answers.findIndex((item) => item.correct);
      const correctButton = answerButtons.find((node) => Number(node.dataset.answerIndex) === correctIndex);
      if (correctButton) {
        correctButton.classList.add('game-answer-correct');
      }
    }

    const status = choice.correct ? '✅ Верно.' : '⚠️ Неверно.';
    const successText = choice.correct ? `<p><strong>${round.success}</strong></p>` : '';
    feedback.innerHTML = `<p>${status} ${choice.explain}</p>${successText}`;

    activeSession.answered = true;
    appendNextButton(feedback);
  });

  closeBtn.addEventListener('click', closeModal);
  backBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
