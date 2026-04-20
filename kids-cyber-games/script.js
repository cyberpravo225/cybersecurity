// Кибер-игры: логика двух независимых тренажёров.
(function () {
  const tips = [
    "Проверяй домен внимательно: даже одна лишняя буква может быть ловушкой.",
    "Сильный пароль должен быть длинным и разнообразным.",
    "Не используй одинаковые символы и простые слова в пароле."
  ];

  const dailyTip = document.getElementById("daily-tip");
  dailyTip.textContent = tips[Math.floor(Math.random() * tips.length)];

  // -------------------------
  // Переключение игр
  // -------------------------
  const tabs = document.querySelectorAll(".game-tab");
  const panels = {
    links: document.getElementById("game-links"),
    password: document.getElementById("game-password")
  };

  function switchGame(game) {
    if (window.location.hash !== `#${game}`) {
      history.replaceState(null, "", `#${game}`);
    }
    tabs.forEach((tab) => {
      const isActive = tab.dataset.game === game;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle("active", key === game);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchGame(tab.dataset.game));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switchGame(tab.dataset.game);
      }
    });
  });

  // -------------------------
  // Игра 1: Безопасная ссылка
  // -------------------------
  const rounds = [
    {
      level: "Простой",
      explanation: "Безопасная ссылка использует HTTPS и понятный официальный домен без лишних символов.",
      options: [
        { url: "https://kids-shop.edu", hint: "веб-магазин", safe: true, reason: "Официальный учебный домен и HTTPS." },
        { url: "http://kids-shop.edu", hint: "веб-магазин", safe: false, reason: "Нет HTTPS: данные могут передаваться небезопасно." },
        { url: "https://klds-shop.edu", hint: "веб-магазин", safe: false, reason: "Опечатка в домене (klds вместо kids)." },
        { url: "https://kids-shop.edu.verify-login.example", hint: "веб-магазин", safe: false, reason: "Подозрительный длинный поддомен." }
      ]
    },
    {
      level: "Средний",
      explanation: "Оценивай домен целиком: важно, что находится перед первой косой чертой после https://.",
      options: [
        { url: "https://school-bank.edu", hint: "банк", safe: true, reason: "Читаемый домен школы, HTTPS и без лишних символов." },
        { url: "https://school-bank.edu.secure-check.example", hint: "банк", safe: false, reason: "Похожий, но настоящий домен другой: secure-check.example." },
        { url: "https://school-barnk.edu", hint: "банк", safe: false, reason: "Подмена букв: barnk вместо bank." },
        { url: "https://school-bank.edu/login?token=%%%%%%%", hint: "банк", safe: false, reason: "Странные параметры в ссылке." },
        { url: "http://192.168.45.77/login", hint: "банк", safe: false, reason: "Используется IP вместо нормального домена и нет HTTPS." }
      ]
    },
    {
      level: "Сложный",
      explanation: "На сложном уровне обращай внимание на подмену символов и лишние дефисы в доменном имени.",
      options: [
        { url: "https://safe-delivery.org", hint: "доставка", safe: true, reason: "Нормальный домен, HTTPS и логичное имя." },
        { url: "https://safe--delivery.org", hint: "доставка", safe: false, reason: "Лишний дефис — частый признак имитации." },
        { url: "https://safe-deliverv.org", hint: "доставка", safe: false, reason: "Подмена буквы y на v в конце домена." },
        { url: "https://safe-delivery.org.account-update.example", hint: "доставка", safe: false, reason: "Вид похожий, но основной домен другой." },
        { url: "https://safe-delivery.org/free/prize/click/now/very/long/path", hint: "доставка", safe: false, reason: "Избыточно длинный путь, похожий на приманку." },
        { url: "http://safe-delivery.org", hint: "доставка", safe: false, reason: "HTTP вместо HTTPS." }
      ]
    }
  ];

  const linksState = { correct: 0, total: 0, currentRound: null, solvedRounds: 0 };
  const linksOptions = document.getElementById("links-options");
  const linksResult = document.getElementById("links-result");
  const linksScore = document.getElementById("links-score");
  const difficultyLabel = document.getElementById("difficulty-label");
  const startLinksBtn = document.getElementById("start-links");
  const nextRoundBtn = document.getElementById("next-round");

  function shuffled(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function renderLinksRound() {
    const round = rounds[Math.floor(Math.random() * rounds.length)];
    linksState.currentRound = round;
    difficultyLabel.textContent = `Уровень: ${round.level}`;
    linksOptions.innerHTML = "";

    shuffled(round.options).forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "link-option";
      button.type = "button";
      button.innerHTML = `<strong>${option.url}</strong><small>${option.hint}</small>`;
      button.setAttribute("aria-label", `Вариант ${index + 1}: ${option.url}. ${option.hint}`);
      button.addEventListener("click", () => checkLinkChoice(button, option));
      linksOptions.appendChild(button);
    });

    linksResult.className = "result";
    linksResult.textContent = "Выбери ссылку, которая выглядит безопасной.";
    nextRoundBtn.disabled = true;
  }

  function checkLinkChoice(clickedBtn, selectedOption) {
    const allButtons = [...linksOptions.querySelectorAll(".link-option")];
    const safeOption = linksState.currentRound.options.find((o) => o.safe);

    linksState.total += 1;
    if (selectedOption.safe) linksState.correct += 1;

    allButtons.forEach((btn) => {
      const matchesSafe = btn.querySelector("strong").textContent === safeOption.url;
      if (matchesSafe) btn.classList.add("correct");
      btn.disabled = true;
    });

    if (!selectedOption.safe) clickedBtn.classList.add("incorrect");

    const verdict = selectedOption.safe
      ? `Это безопасная ссылка. ${safeOption.reason}`
      : `Подозрительно: ${selectedOption.reason} Безопаснее выбрать: ${safeOption.url}.`;

    linksResult.className = `result ${selectedOption.safe ? "success" : "error"}`;
    linksResult.textContent = `${verdict} ${linksState.currentRound.explanation}`;

    linksScore.textContent = `Правильных ответов: ${linksState.correct} из ${linksState.total}`;
    linksState.solvedRounds += 1;
    if (linksState.solvedRounds >= 3 && linksState.correct >= 2) {
      linksResult.textContent += " 🎉 Отлично! Ты получаешь бейдж «Охотник за безопасными ссылками».";
    }
    nextRoundBtn.disabled = false;
  }

  startLinksBtn.addEventListener("click", () => {
    linksState.correct = 0;
    linksState.total = 0;
    linksState.solvedRounds = 0;
    linksScore.textContent = "Правильных ответов: 0 из 0";
    renderLinksRound();
  });

  nextRoundBtn.addEventListener("click", renderLinksRound);

  // -------------------------
  // Игра 2: Сильный пароль
  // -------------------------
  const passwordPool = document.getElementById("password-pool");
  const passwordOutput = document.getElementById("password-output");
  const passwordResult = document.getElementById("password-result");
  const passwordScore = document.getElementById("password-score");
  const meterFill = document.getElementById("meter-fill");
  const strengthText = document.getElementById("strength-text");
  const criteriaList = document.getElementById("criteria-list");

  const checkBtn = document.getElementById("check-password");
  const clearBtn = document.getElementById("clear-password");
  const generateBtn = document.getElementById("generate-password");
  const copyBtn = document.getElementById("copy-password");

  let passSuccessCount = 0;

  const tokenSet = ["Sun", "Mango", "River", "Cyber", "Fox", "Tree", "A9", "Q7", "#", "!", "%", "*", "Sky", "Nova", "Lime", "Z3", "@"];
  const bannedPatterns = ["password", "qwerty", "123456", "admin", "letmein"];

  function renderTokens() {
    passwordPool.innerHTML = "";
    shuffled(tokenSet).forEach((token) => {
      const btn = document.createElement("button");
      btn.className = "token";
      btn.type = "button";
      btn.textContent = token;
      btn.setAttribute("aria-label", `Добавить сегмент ${token}`);
      btn.addEventListener("click", () => {
        passwordOutput.value += token;
      });
      passwordPool.appendChild(btn);
    });
  }

  function evaluatePassword(password) {
    const checks = {
      minLength: password.length >= 12,
      upper: /[A-ZА-Я]/.test(password),
      lower: /[a-zа-я]/.test(password),
      digit: /\d/.test(password),
      symbol: /[^A-Za-zА-Яа-я0-9]/.test(password),
      noBannedWords: !bannedPatterns.some((word) => password.toLowerCase().includes(word)),
      noSequence: !/(0123|1234|2345|abcd|qwer|aaaa|1111)/i.test(password),
      noRepeatedChunk: !/(.{2,4})\1{2,}/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    let level = "Слабый";
    if (score >= 7) level = "Очень сильный";
    else if (score >= 6) level = "Сильный";
    else if (score >= 4) level = "Средний";

    return { checks, score, level };
  }

  function renderCriteria(checks) {
    const labels = {
      minLength: "Минимум 12 символов",
      upper: "Есть заглавные буквы",
      lower: "Есть строчные буквы",
      digit: "Есть цифры",
      symbol: "Есть спецсимволы",
      noBannedWords: "Нет очевидных слов (password, qwerty и т.д.)",
      noSequence: "Нет простых последовательностей",
      noRepeatedChunk: "Нет повторяющихся шаблонов"
    };

    criteriaList.innerHTML = "";
    Object.entries(labels).forEach(([key, label]) => {
      const li = document.createElement("li");
      const ok = checks[key];
      li.className = ok ? "ok" : "bad";
      li.textContent = `${ok ? "✅" : "❌"} ${label}`;
      criteriaList.appendChild(li);
    });
  }

  checkBtn.addEventListener("click", () => {
    const password = passwordOutput.value;
    const { checks, score, level } = evaluatePassword(password);
    const percent = Math.round((score / 8) * 100);

    meterFill.style.width = `${percent}%`;
    strengthText.textContent = `Оценка: ${level} (${percent}%)`;
    renderCriteria(checks);

    const strongEnough = level === "Сильный" || level === "Очень сильный";
    if (strongEnough) {
      passSuccessCount += 1;
      passwordScore.textContent = `Успешных проверок: ${passSuccessCount}`;
      passwordResult.className = "result success";
      passwordResult.textContent = "Отлично! Пароль надёжный. Используй уникальные пароли для разных сервисов.";
      if (passSuccessCount >= 3) {
        passwordResult.textContent += " 🏅 Бейдж: «Мастер сильных паролей»!";
      }
    } else {
      passwordResult.className = "result error";
      passwordResult.textContent = "Пароль пока слабый. Добавь длину, символы и убери простые шаблоны.";
    }
  });

  clearBtn.addEventListener("click", () => {
    passwordOutput.value = "";
    meterFill.style.width = "0%";
    strengthText.textContent = "Оценка: —";
    criteriaList.innerHTML = "";
    passwordResult.className = "result";
    passwordResult.textContent = "Поле очищено. Собери новый пароль.";
  });

  generateBtn.addEventListener("click", () => {
    const parts = shuffled(tokenSet).slice(0, 5);
    if (!parts.some((item) => /[^A-Za-zА-Яа-я0-9]/.test(item))) parts.push("!");
    if (!parts.some((item) => /\d/.test(item))) parts.push("9");
    passwordOutput.value = shuffled(parts).join("");
    passwordResult.className = "result";
    passwordResult.textContent = "Сгенерирован учебный пример. Проверь его кнопкой «Проверить пароль».";
  });

  copyBtn.addEventListener("click", async () => {
    if (!passwordOutput.value) {
      passwordResult.className = "result error";
      passwordResult.textContent = "Сначала собери или сгенерируй пароль.";
      return;
    }

    try {
      await navigator.clipboard.writeText(passwordOutput.value);
      passwordResult.className = "result success";
      passwordResult.textContent = "Пароль скопирован в буфер обмена.";
    } catch (error) {
      passwordResult.className = "result error";
      passwordResult.textContent = "Не удалось скопировать автоматически. Скопируй пароль вручную.";
    }
  });

  // Инициализация
  renderTokens();
  const initial = window.location.hash === "#password" ? "password" : "links";
  switchGame(initial);
})();
