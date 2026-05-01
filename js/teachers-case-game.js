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

  function openModal() {
    modal.hidden = false;
    renderCase();
  }
  function closeModal() { modal.hidden = true; }

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
