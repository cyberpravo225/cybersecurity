(function () {
  const QUESTION_TYPES = ['domain', 'telegram', 'email', 'url'];

  const QUESTION_BANK = [
    { type: 'domain', prompt: 'secure-payments.com', answer: 'legit', explanation: 'Стандартный домен без подмены символов.', difficulty: 1, tags: ['payments'] },
    { type: 'domain', prompt: 'micr0soft-support.com', answer: 'fake', explanation: 'Подмена буквы o на цифру 0 — классический приём фишинга.', difficulty: 2, tags: ['typosquatting'] },
    { type: 'domain', prompt: 'gov-services.ru', answer: 'fake', explanation: 'Имитация гос-сайта с общим названием и без официальной структуры.', difficulty: 2, tags: ['gov'] },
    { type: 'domain', prompt: 'openai.com', answer: 'legit', explanation: 'Корректный официальный домен.', difficulty: 1, tags: ['brand'] },
    { type: 'domain', prompt: 'nalog.gov.by', answer: 'legit', explanation: 'Официальный домен в зоне .gov.by без лишних символов.', difficulty: 1, tags: ['belarus', 'gov'] },
    { type: 'domain', prompt: 'belarusbank.by', answer: 'legit', explanation: 'Нормальный банковский домен в национальной зоне .by.', difficulty: 1, tags: ['belarus', 'bank'] },
    { type: 'domain', prompt: 'belinvestbank.by', answer: 'legit', explanation: 'Корректный формат бренда без подмены и подозрительных приставок.', difficulty: 1, tags: ['belarus', 'bank'] },
    { type: 'domain', prompt: 'belarus-bank-verification.by', answer: 'fake', explanation: 'Слово verification и составное имя часто используют в фишинге.', difficulty: 2, tags: ['belarus', 'phishing'] },
    { type: 'domain', prompt: 'm-banking-belarus.by.secure-login.cc', answer: 'fake', explanation: 'Белорусский бренд вынесен в поддомен, реальный домен — secure-login.cc.', difficulty: 3, tags: ['belarus', 'subdomain-trick'] },
    { type: 'domain', prompt: 'minskservice.by', answer: 'legit', explanation: 'Аккуратный домен без визуальных уловок и лишних слов.', difficulty: 1, tags: ['belarus'] },
    { type: 'telegram', prompt: '@sber_official_news', answer: 'fake', explanation: 'Неофициальный ник с маркетинговым суффиксом и имитацией бренда.', difficulty: 2, tags: ['brand'] },
    { type: 'telegram', prompt: '@cybersec_school', answer: 'legit', explanation: 'Нейтральный учебный канал без признаков подмены.', difficulty: 1, tags: ['education'] },
    { type: 'telegram', prompt: '@teIegram_support', answer: 'fake', explanation: 'Использован похожий символ I вместо l.', difficulty: 3, tags: ['homoglyph'] },
    { type: 'telegram', prompt: '@by_cyber_help', answer: 'legit', explanation: 'Нейтральное имя канала без подмены символов и ложных суффиксов.', difficulty: 1, tags: ['belarus', 'education'] },
    { type: 'telegram', prompt: '@belarus_bank_support2026', answer: 'fake', explanation: 'Службы поддержки редко используют длинные никнеймы с годом.', difficulty: 2, tags: ['belarus', 'phishing'] },
    { type: 'telegram', prompt: '@m1nsk_official_pay', answer: 'fake', explanation: 'Подмена i на 1 в слове minsk — явный признак маскировки.', difficulty: 3, tags: ['belarus', 'homoglyph'] },
    { type: 'telegram', prompt: '@digital_school_belarus', answer: 'legit', explanation: 'Образовательное название выглядит последовательно и без подмен.', difficulty: 1, tags: ['belarus', 'education'] },
    { type: 'email', prompt: 'security@paypal.com', answer: 'legit', explanation: 'Корректный домен отправителя.', difficulty: 1, tags: ['email'] },
    { type: 'email', prompt: 'support@paypaI-alert.com', answer: 'fake', explanation: 'Подменён символ l/I и неофициальный домен.', difficulty: 3, tags: ['homoglyph'] },
    { type: 'email', prompt: 'alerts@bank-verification.cc', answer: 'fake', explanation: 'Подозрительный TLD и давление через слово verification.', difficulty: 2, tags: ['phishing'] },
    { type: 'email', prompt: 'notify@belarusbank.by', answer: 'legit', explanation: 'Обычный адрес в ожидаемом банковском домене .by.', difficulty: 1, tags: ['belarus', 'email'] },
    { type: 'email', prompt: 'security@minsk.gov.by', answer: 'legit', explanation: 'Правильная структура адреса в официальной доменной зоне .gov.by.', difficulty: 1, tags: ['belarus', 'gov'] },
    { type: 'email', prompt: 'support@belarusbank-by.com', answer: 'fake', explanation: 'Похожее имя, но домен не в зоне .by и содержит маскирующий дефис.', difficulty: 2, tags: ['belarus', 'phishing'] },
    { type: 'email', prompt: 'alert@belarusbаnk.by', answer: 'fake', explanation: 'В названии использован похожий символ а из другого алфавита.', difficulty: 3, tags: ['belarus', 'homoglyph'] },
    { type: 'url', prompt: 'https://login.microsoft.com.security-check.ru', answer: 'fake', explanation: 'Реальный бренд указан в поддомене, основной домен другой.', difficulty: 3, tags: ['subdomain-trick'] },
    { type: 'url', prompt: 'https://accounts.google.com/signin', answer: 'legit', explanation: 'Корректная структура официального сервиса Google.', difficulty: 1, tags: ['url'] },
    { type: 'url', prompt: 'http://appleid.apple.com.verify-now.net', answer: 'fake', explanation: 'Легитимный бренд в поддомене, но реальный домен verify-now.net.', difficulty: 3, tags: ['subdomain-trick'] },
    { type: 'url', prompt: 'https://docs.github.com/en', answer: 'legit', explanation: 'Официальная документация на github.com.', difficulty: 1, tags: ['url'] },
    { type: 'url', prompt: 'https://service.gov.by/payments', answer: 'legit', explanation: 'Домен в зоне .gov.by и чистый путь без лишних редиректов.', difficulty: 1, tags: ['belarus', 'gov', 'url'] },
    { type: 'url', prompt: 'https://banking.belarusbank.by/auth', answer: 'legit', explanation: 'Поддомен и корневой домен согласованы и выглядят ожидаемо.', difficulty: 1, tags: ['belarus', 'bank', 'url'] },
    { type: 'url', prompt: 'https://belarusbank.by.security-check.help/login', answer: 'fake', explanation: 'Бренд находится в поддомене, основной домен security-check.help.', difficulty: 3, tags: ['belarus', 'subdomain-trick'] },
    { type: 'url', prompt: 'https://minsk.gov.by.verify-safe.net/cabinet', answer: 'fake', explanation: 'Официальный домен только имитируется в поддомене verify-safe.net.', difficulty: 3, tags: ['belarus', 'subdomain-trick'] }
  ];

  function shuffle(list) {
    return [...list].sort(() => Math.random() - 0.5);
  }

  function buildQuestionSet(rounds, allowedTypes = QUESTION_TYPES) {
    const filtered = QUESTION_BANK.filter((q) => allowedTypes.includes(q.type));
    const pool = shuffle(filtered);
    if (pool.length >= rounds) return pool.slice(0, rounds).map((item, index) => ({ ...item, id: `${item.type}-${index}-${Date.now()}` }));

    const result = [];
    for (let i = 0; i < rounds; i += 1) {
      const item = pool[i % pool.length];
      result.push({ ...item, id: `${item.type}-${i}-${Date.now()}` });
    }
    return result;
  }

  function calculateRoundScore({ isCorrect, responseMs, streak, difficulty }) {
    if (!isCorrect) {
      const wrongPenalty = Math.max(40, 70 + difficulty * 15);
      return { delta: -wrongPenalty, speedBonus: 0, streakBonus: 0, difficultyBonus: 0 };
    }

    const base = 100;
    const normalizedMs = Math.max(250, responseMs || 2000);
    const speedBonus = Math.max(0, Math.round((8000 - Math.min(normalizedMs, 8000)) / 55));
    const streakBonus = Math.min(160, streak * 12);
    const difficultyBonus = difficulty * 26;
    return {
      delta: base + speedBonus + streakBonus + difficultyBonus,
      speedBonus,
      streakBonus,
      difficultyBonus
    };
  }

  function summarizeRun({ answers, totalScore, bestStreak }) {
    const total = answers.length || 1;
    const correct = answers.filter((a) => a.isCorrect).length;
    const wrong = total - correct;
    const accuracy = Number(((correct / total) * 100).toFixed(2));
    const avgResponseMs = Math.round(answers.reduce((sum, a) => sum + a.responseMs, 0) / total);

    return {
      score: totalScore,
      correctCount: correct,
      wrongCount: wrong,
      accuracy,
      avgResponseMs,
      bestStreak,
      mode: 'solo_competitive'
    };
  }

  window.DigitalBattleCore = {
    QUESTION_TYPES,
    QUESTION_BANK,
    buildQuestionSet,
    calculateRoundScore,
    summarizeRun
  };
})();
