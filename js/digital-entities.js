(function () {
  const QUESTION_TYPES = ['domain', 'telegram', 'email', 'url'];

  const QUESTION_BANK = [
    { type: 'domain', prompt: 'secure-payments.com', answer: 'legit', explanation: 'Стандартный домен без подмены символов.', difficulty: 1, tags: ['payments'] },
    { type: 'domain', prompt: 'micr0soft-support.com', answer: 'fake', explanation: 'Подмена буквы o на цифру 0 — классический приём фишинга.', difficulty: 2, tags: ['typosquatting'] },
    { type: 'domain', prompt: 'gov-services.ru', answer: 'fake', explanation: 'Имитация гос-сайта с общим названием и без официальной структуры.', difficulty: 2, tags: ['gov'] },
    { type: 'domain', prompt: 'openai.com', answer: 'legit', explanation: 'Корректный официальный домен.', difficulty: 1, tags: ['brand'] },
    { type: 'telegram', prompt: '@sber_official_news', answer: 'fake', explanation: 'Неофициальный ник с маркетинговым суффиксом и имитацией бренда.', difficulty: 2, tags: ['brand'] },
    { type: 'telegram', prompt: '@cybersec_school', answer: 'legit', explanation: 'Нейтральный учебный канал без признаков подмены.', difficulty: 1, tags: ['education'] },
    { type: 'telegram', prompt: '@teIegram_support', answer: 'fake', explanation: 'Использован похожий символ I вместо l.', difficulty: 3, tags: ['homoglyph'] },
    { type: 'email', prompt: 'security@paypal.com', answer: 'legit', explanation: 'Корректный домен отправителя.', difficulty: 1, tags: ['email'] },
    { type: 'email', prompt: 'support@paypaI-alert.com', answer: 'fake', explanation: 'Подменён символ l/I и неофициальный домен.', difficulty: 3, tags: ['homoglyph'] },
    { type: 'email', prompt: 'alerts@bank-verification.cc', answer: 'fake', explanation: 'Подозрительный TLD и давление через слово verification.', difficulty: 2, tags: ['phishing'] },
    { type: 'url', prompt: 'https://login.microsoft.com.security-check.ru', answer: 'fake', explanation: 'Реальный бренд указан в поддомене, основной домен другой.', difficulty: 3, tags: ['subdomain-trick'] },
    { type: 'url', prompt: 'https://accounts.google.com/signin', answer: 'legit', explanation: 'Корректная структура официального сервиса Google.', difficulty: 1, tags: ['url'] },
    { type: 'url', prompt: 'http://appleid.apple.com.verify-now.net', answer: 'fake', explanation: 'Легитимный бренд в поддомене, но реальный домен verify-now.net.', difficulty: 3, tags: ['subdomain-trick'] },
    { type: 'url', prompt: 'https://docs.github.com/en', answer: 'legit', explanation: 'Официальная документация на github.com.', difficulty: 1, tags: ['url'] }
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
