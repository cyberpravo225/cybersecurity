(function () {
  const page = document.body?.dataset?.page;
  if (page !== 'seniors') return;

  const modalData = {
    callChecklist: {
      title: 'Чек-лист «Подозрительный звонок»',
      type: 'checklist',
      steps: [
        'Сохраняю спокойствие и не принимаю решений в спешке.',
        'Уточняю имя, должность и организацию звонящего.',
        'Задаю проверочный вопрос: откуда у вас мои данные и с какой целью звонок?',
        'Не называю коды из SMS, CVV, PIN, пароли и паспортные данные.',
        'Если речь о банке или госслужбе — завершаю звонок и перезваниваю по официальному номеру с карты/сайта.',
        'Проверяю информацию у родственников, если звонок «от имени близкого».',
        'Фиксирую красные флаги: давление, срочность, угрозы, просьба перевести деньги.'
      ]
    },
    phoneSetup: {
      title: 'Настройки телефона за 10 минут',
      type: 'progress',
      steps: [
        { title: 'Включите PIN-код', hint: 'Используйте 6+ цифр, не дату рождения.' },
        { title: 'Проверьте блокировку экрана', hint: 'Автоблокировка: 30–60 секунд.' },
        { title: 'Скройте уведомления на экране блокировки', hint: 'Не показывать коды и личные сообщения.' },
        { title: 'Ограничьте быстрый доступ', hint: 'Отключите доступ к кошельку/смс без разблокировки.' },
        { title: 'Включите фильтр спама и осторожность к ссылкам', hint: 'Не открывайте ссылки из подозрительных SMS.' }
      ]
    },
    safeChat: {
      title: 'Безопасное общение',
      type: 'scenario',
      scenarios: [
        { q: 'Пишет незнакомый контакт: «Здравствуйте, срочно подтвердите свои данные».', a: ['Игнорирую и блокирую, если запрос подозрительный.', 'Отправляю ФИО и дату рождения.', 'Прошу прислать фото паспорта отправителя.'], ok: 0, e: 'Незнакомцу нельзя передавать личные данные.' },
        { q: 'В чате просят прислать код из SMS «для проверки аккаунта».', a: ['Передаю код, если собеседник вежливый.', 'Не передаю код никому — это ключ к входу.', 'Отправляю только последние 2 цифры.'], ok: 1, e: 'Код из SMS всегда секретный, даже для «поддержки».' },
        { q: '«Друг» прислал ссылку: «Проголосуй срочно».', a: ['Перехожу сразу — это же друг.', 'Сначала уточняю у друга другим способом, потом решаю.', 'Отправляю ссылку дальше всем знакомым.'], ok: 1, e: 'Аккаунт друга мог быть взломан, проверка обязательна.' },
        { q: 'Сообщение: «Срочно переведи деньги, потом объясню».', a: ['Перевожу небольшую сумму.', 'Проверяю звонком человеку лично и только потом решаю.', 'Отправляю фото карты для подтверждения.'], ok: 1, e: 'Срочность — типичный приём мошенников.' }
      ]
    },
    fraudQuiz: {
      title: 'Викторина о мошенниках',
      type: 'quiz',
      questions: [
        { q: 'Что делать, если звонящий представился банком и просит код из SMS?', a: ['Назвать код для проверки', 'Сбросить звонок и перезвонить по официальному номеру', 'Назвать только часть кода'], ok: 1, exp: 'Банк не запрашивает коды из SMS по телефону.' },
        { q: 'Какой признак чаще всего у фишинговой ссылки?', a: ['Официальный короткий домен банка', 'Ошибка в адресе и странные символы', 'Ссылка пришла утром'], ok: 1, exp: 'Поддельные адреса часто отличаются 1–2 символами.' },
        { q: 'Можно ли сообщать код подтверждения из SMS сотруднику поддержки?', a: ['Да, если он назвал ваше имя', 'Нет, никогда', 'Да, если звонок с городского номера'], ok: 1, exp: 'Код подтверждения — только для вас.' },
        { q: 'Что делать при «срочной» просьбе назвать паспортные данные?', a: ['Сообщить, если пугают блокировкой', 'Проверить источник и ничего не сообщать до подтверждения', 'Сообщить только серию'], ok: 1, exp: 'Личные данные нельзя раскрывать неподтверждённым собеседникам.' },
        { q: 'Как распознать поддельную техподдержку?', a: ['Торопят установить программу удалённого доступа', 'Предлагают обратиться в офис', 'Отправляют инструкцию с официального сайта'], ok: 0, exp: 'Мошенники часто требуют удалённый доступ к устройству.' },
        { q: 'Что безопаснее при подозрительном сообщении от родственника?', a: ['Сразу отправить деньги', 'Проверить через личный звонок или видео', 'Попросить номер карты ещё раз'], ok: 1, exp: 'Сначала проверьте, действительно ли пишет родственник.' }
      ]
    }
  };

  class SeniorModalApp {
    constructor() {
      this.lastTrigger = null;
      this.bindCards();
      this.buildModalShell();
    }

    bindCards() {
      const map = [
        ['Чек-лист «Подозрительный звонок»', 'callChecklist'],
        ['Настройки телефона за 10 минут', 'phoneSetup'],
        ['Безопасное общение', 'safeChat'],
        ['Викторина о мошенниках', 'fraudQuiz']
      ];

      map.forEach(([title, id]) => {
        const cardTitle = [...document.querySelectorAll('.senior-card h3')].find((el) => el.textContent.trim() === title);
        const card = cardTitle?.closest('.senior-card');
        if (!card) return;
        card.dataset.modalId = id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.addEventListener('click', (e) => {
          if (card.tagName === 'A') e.preventDefault();
          this.open(id, card);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.open(id, card);
          }
        });
      });
    }

    buildModalShell() {
      const wrapper = document.createElement('div');
      wrapper.className = 'senior-modal-overlay';
      wrapper.innerHTML = `<section class="senior-modal" role="dialog" aria-modal="true" aria-labelledby="seniorModalTitle" tabindex="-1">
        <button class="senior-modal-close" type="button" aria-label="Закрыть окно">✕</button>
        <div class="senior-modal-content"></div>
      </section>`;
      document.body.appendChild(wrapper);
      this.overlay = wrapper;
      this.modal = wrapper.querySelector('.senior-modal');
      this.content = wrapper.querySelector('.senior-modal-content');
      wrapper.addEventListener('click', (e) => { if (e.target === wrapper) this.close(); });
      wrapper.querySelector('.senior-modal-close').addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.overlay.classList.contains('is-open')) this.close();
      });
    }

    open(id, trigger) {
      const config = modalData[id];
      if (!config) return;
      this.lastTrigger = trigger;
      this.render(config);
      this.overlay.classList.add('is-open');
      document.body.classList.add('modal-open');
      setTimeout(() => this.modal.focus(), 0);
    }

    close() {
      this.overlay.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      this.content.innerHTML = '';
      this.lastTrigger?.focus();
    }

    render(config) {
      if (config.type === 'checklist') return this.renderChecklist(config);
      if (config.type === 'progress') return this.renderProgress(config);
      if (config.type === 'scenario') return this.renderScenario(config);
      if (config.type === 'quiz') return this.renderQuiz(config);
    }

    renderChecklist(config) {
      this.content.innerHTML = `<h2 id="seniorModalTitle">${config.title}</h2>
      <p class="modal-hint">Отмечайте шаги, которые вы действительно выполнили.</p>
      <form class="modal-list">${config.steps.map((s, i) => `<label><input type="checkbox" data-step="${i}"> <span>${s}</span></label>`).join('')}</form>
      <button type="button" class="modal-btn" data-action="check">Проверить себя</button>
      <p class="modal-result" aria-live="polite"></p>`;
      this.content.querySelector('[data-action="check"]').addEventListener('click', () => {
        const total = config.steps.length;
        const checked = this.content.querySelectorAll('input[type="checkbox"]:checked').length;
        this.content.querySelector('.modal-result').textContent = checked === total
          ? '✅ Вы знаете, как действовать безопасно.'
          : '⚠️ Повторите шаги ещё раз и отметьте важные пункты.';
      });
    }

    renderProgress(config) {
      let done = 0;
      this.content.innerHTML = `<h2 id="seniorModalTitle">${config.title}</h2><div class="modal-progress"><div class="modal-progress-bar"></div></div>
      <div class="modal-grid">${config.steps.map((s, i) => `<article class="step-card" data-i="${i}"><h3>${i + 1}. ${s.title}</h3><p>${s.hint}</p><button class="modal-btn small" type="button">Я настроил</button></article>`).join('')}</div><p class="modal-result" aria-live="polite"></p>`;
      const bar = this.content.querySelector('.modal-progress-bar');
      const cards = [...this.content.querySelectorAll('.step-card')];
      cards.forEach((card) => {
        card.querySelector('button').addEventListener('click', () => {
          if (card.classList.contains('done')) return;
          card.classList.add('done');
          done += 1;
          bar.style.width = `${(done / config.steps.length) * 100}%`;
          if (done === config.steps.length) this.content.querySelector('.modal-result').textContent = '🎉 Готово! Базовая защита телефона настроена.';
        });
      });
    }

    renderScenario(config) { this.renderQAFlow(config.title, config.scenarios, false); }
    renderQuiz(config) { this.renderQAFlow(config.title, config.questions, true); }

    renderQAFlow(title, items, isQuiz) {
      let index = 0, score = 0;
      const draw = () => {
        if (index >= items.length) {
          this.content.innerHTML = `<h2 id="seniorModalTitle">${title}</h2><p class="modal-result final">Ваш результат: ${score} из ${items.length}.</p>`;
          return;
        }
        const item = items[index];
        this.content.innerHTML = `<h2 id="seniorModalTitle">${title}</h2><p class="counter">${index + 1} / ${items.length} · Верно: ${score}</p>
        <div class="modal-progress"><div class="modal-progress-bar" style="width:${(index / items.length) * 100}%"></div></div>
        <article class="qa-card"><h3>${item.q}</h3><div class="answers">${item.a.map((a, i) => `<button type="button" class="answer-btn" data-i="${i}">${a}</button>`).join('')}</div><p class="modal-result" aria-live="polite"></p><button class="modal-btn small next" type="button" hidden>Далее</button></article>`;
        const result = this.content.querySelector('.modal-result');
        this.content.querySelectorAll('.answer-btn').forEach((btn) => btn.addEventListener('click', () => {
          const pick = Number(btn.dataset.i);
          const ok = pick === item.ok;
          if (ok) score += 1;
          this.content.querySelectorAll('.answer-btn').forEach((b, i) => {
            b.disabled = true;
            if (i === item.ok) b.classList.add('is-correct');
            if (i === pick && !ok) b.classList.add('is-wrong');
          });
          result.textContent = `${ok ? '✅ Правильно.' : '❌ Неправильно.'} ${isQuiz ? item.exp : item.e}`;
          this.content.querySelector('.next').hidden = false;
        }));
        this.content.querySelector('.next').addEventListener('click', () => { index += 1; draw(); });
      };
      draw();
    }
  }

  new SeniorModalApp();
})();
