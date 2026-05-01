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

  const openModal = (gameType) => {
    const game = templates[gameType];
    if (!game) return;
    title.textContent = game.title;
    description.textContent = game.description;
    content.innerHTML = game.html;
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
    modal.style.position = "absolute";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.right = "0";
    modal.style.height = `${Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)}px`;
    dialog.style.position = "absolute";
    dialog.style.left = `${window.innerWidth / 2}px`;
    dialog.style.top = `${window.scrollY + (window.innerHeight / 2)}px`;
    dialog.style.transform = "translate(-50%, -50%)";
  };

  scenarioCard.addEventListener("click", () => openModal("scenario"));
  phishingCard.addEventListener("click", () => openModal("phishing"));
  scenarioCard.addEventListener("keydown", (event) => event.key === "Enter" && openModal("scenario"));
  phishingCard.addEventListener("keydown", (event) => event.key === "Enter" && openModal("phishing"));
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
