const STORAGE_KEY = 'digital_trap_settings_v2'

const THREAT_LABELS = {
  sms: 'Фальшивые SMS',
  email: 'Опасные письма',
  social: 'Социнженерия',
  wifi: 'Публичный Wi‑Fi',
  usb: 'Неизвестные устройства',
  password: 'Слабые пароли',
  app: 'Фальшивые приложения',
  privacy: 'Личные данные',
  call: 'Звонки мошенников',
  takeover: 'Захват аккаунта',
}

const ACHIEVEMENTS = {
  noPhish: ['Не клюнул на фишинг', 'Проверял подозрительные сообщения через официальный канал.'],
  senderCheck: ['Проверил отправителя', 'Смотрел на домен и источник, а не на кнопку.'],
  wifiSafe: ['Осторожно с Wi‑Fi', 'Не логинился в важные сервисы в открытой сети.'],
  usbSafe: ['Не вставил флешку', 'Не подключал неизвестные носители.'],
  passStrong: ['Сильный пароль', 'Создал длинный и уникальный пароль.'],
  noCode: ['Код только твой', 'Никому не сообщил код из SMS.'],
  flawless: ['Чистый день', 'Прошёл день без критических ошибок.'],
}

const randomPool = {
  sender: ['Лена', 'Артём', 'Надя', 'Игорь', 'Миша'],
  delivery: ['FastBox', 'CityDrop', 'SkyParcel'],
  place: ['Urban Bean', 'Moon Latte', 'КофеПорт'],
}

const SCENES = [
  {
    id: 'intro_sms', chapter: 'Утро', ui: 'sms', threat: 'sms',
    title: 'Сонное SMS о доставке',
    text: 'Телефон вибрирует: «Посылка из {delivery} не доставлена. Подтвердите адрес».',
    hint: 'Если сообщение торопит — не кликай сразу, проверь через официальное приложение.',
    choices: [
      ['Открыть ссылку и заполнить форму', 'high', { security: -2, xp: 3, focus: -1, risk: 2, wrong: 'sms' }, 'Спешка — главный крючок фишинга.'],
      ['Открыть приложение доставки и проверить статус', 'low', { security: 1, xp: 12, focus: 1, risk: -1, ach: 'noPhish' }, 'Проверка в официальном приложении — безопасная привычка.'],
      ['Игнорировать и отметить как спам', 'low', { security: 1, xp: 10, focus: 1, risk: -1, ach: 'senderCheck' }, 'Отлично: ты не дал сообщению шанс.'],
    ],
  },
  {
    id: 'email_lock', chapter: 'Телефон', ui: 'email', threat: 'email',
    title: 'Письмо: «Аккаунт будет заблокирован»',
    text: 'В inbox письмо с яркой кнопкой «СРОЧНО восстановить доступ».',
    hint: 'Смотри сначала адрес отправителя и домен.',
    choices: [
      ['Нажать кнопку и ввести пароль', 'high', { security: -2, xp: 3, focus: -1, risk: 2, wrong: 'email' }, 'Поддельное письмо часто выглядит почти как настоящее.'],
      ['Проверить домен и войти на сайт вручную', 'low', { security: 1, xp: 12, focus: 1, risk: -1, ach: 'senderCheck' }, 'Правильно: входить лучше через свой путь, а не кнопку из письма.'],
      ['Переслать другу и ждать ответ', 'medium', { security: 0, xp: 6, focus: 0, risk: 0 }, 'Сомневаться нормально, но лучше проверять через официальный канал.'],
    ],
  },
  {
    id: 'friend_hack', chapter: 'Дорога', ui: 'chat', threat: 'social',
    title: 'Сообщение от друга {sender}',
    text: '«Срочно одолжи денег, позже объясню».',
    hint: 'Срочная просьба в чате — повод проверить через звонок.',
    choices: [
      ['Сразу отправить деньги', 'high', { security: -2, xp: 4, focus: -1, risk: 2, wrong: 'social' }, 'Взломанный аккаунт друга часто использует доверие.'],
      ['Позвонить другу и уточнить', 'low', { security: 2, xp: 14, focus: 1, risk: -1, ach: 'noCode' }, 'Идеально: ты проверил через другой канал.'],
      ['Спросить ваш кодовый вопрос', 'low', { security: 1, xp: 10, focus: 1, risk: -1 }, 'Кодовый вопрос отлично отсеивает мошенника.'],
    ],
  },
  {
    id: 'sms_code', chapter: 'Кафе', ui: 'call', threat: 'social',
    title: 'Звонок из «поддержки»',
    text: 'Оператор просит продиктовать код из SMS «для подтверждения личности».',
    hint: 'Код из SMS нельзя сообщать никому.',
    choices: [
      ['Продиктовать код', 'critical', { security: -3, xp: 1, focus: -1, risk: 3, wrong: 'social' }, 'Код подтверждения — прямой ключ к аккаунту.'],
      ['Отказаться и завершить звонок', 'low', { security: 2, xp: 13, focus: 1, risk: -1, ach: 'noCode' }, 'Отличный рефлекс.'],
      ['Попросить номер заявки и перезвонить через сайт', 'low', { security: 1, xp: 10, focus: 1, risk: -1 }, 'Ты сохранил контроль разговора.'],
    ],
  },
  {
    id: 'wifi', chapter: 'Работа/учёба', ui: 'app', threat: 'wifi',
    title: 'Открытая сеть в {place}',
    text: 'Wi‑Fi без пароля, нужно зайти в почту и банк.',
    hint: 'Для важных входов используй мобильный интернет.',
    choices: [
      ['Подключиться и войти в банк', 'high', { security: -2, xp: 2, focus: -1, risk: 2, wrong: 'wifi' }, 'Открытая сеть повышает риск перехвата сессий.'],
      ['Использовать мобильный интернет', 'low', { security: 2, xp: 11, focus: 1, risk: -1, ach: 'wifiSafe' }, 'Безопасный вариант для чувствительных действий.'],
      ['В Wi‑Fi только читать новости, без входов', 'medium', { security: 1, xp: 8, focus: 0, risk: 0 }, 'Допустимо, если не вводить логины и коды.'],
    ],
  },
  {
    id: 'usb', chapter: 'Сообщения', ui: 'system', threat: 'usb',
    title: 'Найденная флешка «Зарплаты_2026»',
    text: 'Флешка лежит у входа. Любопытство очень сильное.',
    hint: 'Неизвестные носители не подключай в рабочие/личные устройства.',
    choices: [
      ['Вставить в рабочий ноутбук', 'critical', { security: -3, xp: 1, focus: -1, risk: 3, wrong: 'usb' }, 'Неизвестный носитель может запустить вредный скрипт.'],
      ['Передать флешку IT-админу', 'low', { security: 2, xp: 12, focus: 1, risk: -1, ach: 'usbSafe' }, 'Правильная безопасная эскалация.'],
      ['Не трогать и предупредить коллег', 'low', { security: 1, xp: 9, focus: 1, risk: -1 }, 'Тоже хороший выбор.'],
    ],
  },
  {
    id: 'password', chapter: 'Соцсети', ui: 'app', threat: 'password',
    title: 'Новый аккаунт просит пароль',
    text: 'Ты торопишься и хочешь поставить что-то простое «на время».',
    hint: 'Надёжный пароль — длинный и уникальный.',
    choices: [
      ['Поставить 12345678 и использовать везде', 'high', { security: -2, xp: 3, focus: -1, risk: 2, wrong: 'password' }, 'Слабый и повторяемый пароль — частая причина взлома.'],
      ['Создать длинный уникальный пароль', 'low', { security: 2, xp: 13, focus: 1, risk: -1, ach: 'passStrong' }, 'Лучшее решение.'],
      ['Использовать длинную фразу + символы', 'low', { security: 1, xp: 10, focus: 1, risk: -1 }, 'Хороший практичный подход.'],
    ],
  },
  {
    id: 'fake_app', chapter: 'Вечер', ui: 'app', threat: 'app',
    title: 'Ссылка на APK «премиум бесплатно»',
    text: 'В чате прислали приложение «без рекламы и подписки».',
    hint: 'Скачивай приложения из официальных магазинов.',
    choices: [
      ['Скачать APK с ссылки', 'high', { security: -2, xp: 2, focus: -1, risk: 2, wrong: 'app' }, 'Неофициальные APK часто маскируют вредоносные функции.'],
      ['Проверить издателя в официальном магазине', 'low', { security: 2, xp: 10, focus: 1, risk: -1 }, 'Правильно: сначала источник и издатель.'],
      ['Отказаться и оставить официальную версию', 'low', { security: 1, xp: 9, focus: 1, risk: -1 }, 'Безопасность важнее сомнительной «выгоды».'],
    ],
  },
  {
    id: 'privacy', chapter: 'Вечер', ui: 'social', threat: 'privacy',
    title: 'Пост «Уехал из дома до понедельника»',
    text: 'Хочется выложить фото билета и геометку прямо сейчас.',
    hint: 'Личные данные лучше публиковать с задержкой и без лишних деталей.',
    choices: [
      ['Опубликовать всё: гео, билет, номер рейса', 'high', { security: -2, xp: 3, focus: -1, risk: 2, wrong: 'privacy' }, 'Слишком много деталей помогает злоумышленнику собрать профиль.'],
      ['Ограничить аудиторию и убрать детали', 'low', { security: 1, xp: 9, focus: 1, risk: -1 }, 'Ты сохранил приватность и смысл поста.'],
      ['Запостить фото после возвращения', 'low', { security: 2, xp: 10, focus: 1, risk: -1 }, 'Очень безопасный вариант.'],
    ],
  },
  {
    id: 'bank_call', chapter: 'Поздний вечер', ui: 'call', threat: 'call',
    title: '«Служба безопасности банка»',
    text: 'Голос уверенный: «Нужны данные карты для отмены операции».',
    hint: 'Заверши звонок и перезвони по номеру с карты.',
    choices: [
      ['Сообщить данные карты', 'critical', { security: -3, xp: 1, focus: -1, risk: 3, wrong: 'call' }, 'Настоящий банк не просит такие данные по телефону.'],
      ['Завершить звонок и перезвонить сам', 'low', { security: 2, xp: 13, focus: 1, risk: -1 }, 'Ты выбрал официальный канал.'],
      ['Сказать «перезвоню позже» и ничего не сообщать', 'low', { security: 1, xp: 9, focus: 1, risk: -1 }, 'Даже пауза защищает тебя.'],
    ],
  },
  {
    id: 'final', chapter: 'Финал', ui: 'system', threat: 'takeover',
    title: 'Попытка захвата аккаунта',
    text: 'Сразу три уведомления о входе с нового устройства.',
    hint: 'Смена пароля, выход из сессий, 2FA — сразу.',
    choices: [
      ['Игнорировать до завтра', 'critical', { security: -3, xp: 1, focus: -1, risk: 3, wrong: 'takeover' }, 'Промедление увеличивает ущерб.'],
      ['Срочно сменить пароль + 2FA + выйти из сессий', 'low', { security: 3, xp: 15, focus: 1, risk: -2, ach: 'flawless' }, 'Отличный финальный ответ на атаку.'],
      ['Сменить только пароль', 'medium', { security: 1, xp: 8, focus: 0, risk: 0 }, 'Полезно, но без 2FA защита неполная.'],
    ],
  },
]

const uiLabels = {
  sms: 'SMS', email: 'Email', chat: 'Мессенджер', call: 'Звонок', app: 'Приложение', social: 'Соцсеть', system: 'Система',
}

const state = {
  screen: 'intro',
  sceneIndex: 0,
  difficulty: 'normal',
  help: true,
  stats: { security: 4, xp: 0, focus: 3, risk: 0, safe: 0, danger: 0 },
  mistakes: Object.fromEntries(Object.keys(THREAT_LABELS).map((k) => [k, 0])),
  achievements: new Set(),
  lastResult: null,
  names: {},
  sound: { muted: false, volume: 0.55 },
}

const el = {
  hud: document.getElementById('hud'),
  screen: document.getElementById('screen'),
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    state.sound.muted = !!saved.muted
    if (typeof saved.volume === 'number') state.sound.volume = saved.volume
  } catch {}
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.sound))
}

function beep(freq = 600, dur = 0.12, type = 'sine') {
  if (state.sound.muted) return
  try {
    const ctx = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)())
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.value = Math.min(0.12, state.sound.volume * 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  } catch {}
}

function animateFlash(type) {
  document.body.classList.remove('flash-danger', 'flash-success')
  document.body.classList.add(type === 'danger' ? 'flash-danger' : 'flash-success')
  setTimeout(() => document.body.classList.remove('flash-danger', 'flash-success'), 280)
}

function rng(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function hydrateText(text) {
  return text
    .replace('{sender}', state.names.sender)
    .replace('{delivery}', state.names.delivery)
    .replace('{place}', state.names.place)
}

function sceneByIndex(i) {
  const src = SCENES[i]
  return { ...src, title: hydrateText(src.title), text: hydrateText(src.text) }
}

function applyDifficulty(delta) {
  const copy = { ...delta }
  if (state.difficulty === 'easy') copy.security = Math.round((copy.security || 0) * 0.75)
  if (state.difficulty === 'hard') copy.security = Math.round((copy.security || 0) * 1.2)
  return copy
}

function scoreEnding() {
  const s = state.stats
  const score = s.security * 24 + s.xp + s.safe * 10 - s.danger * 14 - s.risk * 4
  if (score < 70) return ['Плохая', 'День выдался тяжёлым. Но теперь ты знаешь, где риски.']
  if (score < 125) return ['Средняя', 'Ты справился частично. Отличный шанс перепройти и улучшить результат.']
  if (score < 175) return ['Хорошая', 'Очень достойно: ты заметил почти все ловушки.']
  return ['Идеальная', 'Кибер-ловушки обошли тебя стороной. Спокойно, умно, безопасно.']
}

function buildHUD() {
  const s = state.stats
  const progress = Math.round((state.sceneIndex / SCENES.length) * 100)
  el.hud.innerHTML = `
    ${meter('Защита', s.security, 5, 'var(--success)')}
    ${meter('XP', s.xp, 180, 'linear-gradient(90deg,var(--indigo),var(--purple))')}
    ${meter('Внимательность', s.focus, 5, 'var(--accent)')}
    ${meter('Риск', s.risk, 35, 'var(--danger)')}
    <div class="meter meter-full">
      <b>Глава: ${state.sceneIndex < SCENES.length ? sceneByIndex(state.sceneIndex).chapter : 'Финал'} · Прогресс ${progress}%</b>
      <div class="track"><div class="fill" style="width:${progress}%;background:linear-gradient(90deg,var(--accent),var(--purple))"></div></div>
    </div>
    <div class="hud-actions">
      <button class="tiny" id="toggle-sound">${state.sound.muted ? '🔇' : '🔊'} Звук</button>
      <input id="volume" type="range" min="0" max="1" step="0.05" value="${state.sound.volume}" />
    </div>
  `
  document.getElementById('toggle-sound').onclick = () => {
    state.sound.muted = !state.sound.muted
    saveSettings()
    beep(700, 0.05)
    render()
  }
  document.getElementById('volume').oninput = (e) => {
    state.sound.volume = Number(e.target.value)
    saveSettings()
  }
}

function meter(label, value, max, color) {
  const width = Math.max(0, Math.min(100, (value / max) * 100))
  return `<div class="meter"><b>${label}: ${value}/${max}</b><div class="track"><div class="fill" style="width:${width}%;background:${color}"></div></div></div>`
}

function introScreen() {
  el.screen.innerHTML = `
    <div class="intro-fade">
      <p class="tinycaps">06:42 • новый день начинается</p>
      <h1 class="title">Один день: цифровая ловушка</h1>
      <p class="muted">Короткая сюжетная игра: 10–12 минут, жизненные ситуации, полезные привычки без сложного жаргона.</p>
      <div class="btns">
        <button class="btn-primary" id="go-start">Продолжить</button>
        <a class="btn btn-secondary" href="../index.html">← На главную</a>
      </div>
    </div>
  `
  beep(210, 0.4, 'triangle')
  document.getElementById('go-start').onclick = () => {
    state.screen = 'start'
    beep(420, 0.15)
    render()
  }
}

function startScreen() {
  el.screen.innerHTML = `
    <h1 class="title">Один день: цифровая ловушка</h1>
    <p class="muted">Твоя цель: пройти день, не отдав контроль мошенникам.</p>
    <div class="glass card-inline">
      <h3>Как играть</h3>
      <ul>
        <li>На каждом этапе выбери действие.</li>
        <li>Следи за шкалами в HUD: защита, XP, внимательность и риск.</li>
        <li>После каждого выбора — короткий разбор, почему это безопасно/опасно.</li>
      </ul>
      <div class="settings-grid">
        <label>Сложность
          <select id="difficulty">
            <option value="easy" ${state.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
            <option value="normal" ${state.difficulty === 'normal' ? 'selected' : ''}>Normal</option>
            <option value="hard" ${state.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
          </select>
        </label>
        <label class="check"><input id="help" type="checkbox" ${state.help ? 'checked' : ''}/> Режим помощи</label>
      </div>
      <div class="btns">
        <button class="btn-primary" id="start-game">Начать игру</button>
      </div>
    </div>
  `
  document.getElementById('start-game').onclick = () => {
    state.difficulty = document.getElementById('difficulty').value
    state.help = document.getElementById('help').checked
    state.screen = 'game'
    beep(500, 0.12)
    render()
  }
}

function sceneScreen() {
  const scene = sceneByIndex(state.sceneIndex)
  el.screen.innerHTML = `
    <div class="scene-head"><span class="badge">${scene.chapter} · ${uiLabels[scene.ui]}</span></div>
    <h2>${scene.title}</h2>
    <p>${scene.text}</p>
    ${state.help ? `<p class="hint"><b>Подсказка:</b> ${scene.hint}</p>` : ''}
    <div class="choices">
      ${scene.choices.map((c, i) => `<button class="choice" data-i="${i}">${c[0]}</button>`).join('')}
    </div>
  `

  if (scene.ui === 'sms') beep(900, 0.08, 'square')
  else if (scene.ui === 'email') beep(530, 0.08, 'triangle')
  else if (scene.ui === 'call') beep(380, 0.18, 'sine')
  else beep(450, 0.05)

  el.screen.querySelectorAll('.choice').forEach((btn) => {
    btn.onclick = () => onChoice(scene, Number(btn.dataset.i), btn)
  })
}

function onChoice(scene, idx, btn) {
  const [label, risk, delta, explain] = scene.choices[idx]
  const tuned = applyDifficulty(delta)
  const s = state.stats

  s.security = Math.max(0, Math.min(5, s.security + (tuned.security || 0)))
  s.xp = Math.max(0, s.xp + (tuned.xp || 0))
  s.focus = Math.max(0, Math.min(5, s.focus + (tuned.focus || 0)))
  s.risk = Math.max(0, s.risk + (tuned.risk || 0))

  if (risk === 'low') s.safe += 1
  if (risk === 'high' || risk === 'critical') s.danger += 1

  if (delta.wrong) state.mistakes[delta.wrong] += 1
  if (delta.ach) state.achievements.add(delta.ach)

  const repeat = delta.wrong && state.mistakes[delta.wrong] > 1

  state.lastResult = { scene, label, risk, explain, repeat }
  state.screen = 'result'

  if (risk === 'low') {
    animateFlash('success')
    beep(760, 0.1, 'triangle')
  } else {
    btn.classList.add('shake')
    animateFlash('danger')
    beep(190, 0.14, 'sawtooth')
  }
  render()
}

function resultScreen() {
  const r = state.lastResult
  const safe = r.risk === 'low'
  el.screen.innerHTML = `
    <span class="badge">Результат сцены</span>
    <div class="result ${safe ? 'success' : 'danger'}">
      <p><b>${safe ? 'Удачное решение' : 'Рискованное решение'}</b>: ${r.label}</p>
      <p>${r.explain}</p>
      <p class="muted">Тип угрозы: ${THREAT_LABELS[r.scene.threat]}</p>
      ${r.repeat ? '<p class="warn">Повторная ошибка: именно этот тип угрозы у тебя уже встречался.</p>' : ''}
    </div>
    <div class="btns"><button class="btn-primary" id="next">Дальше</button></div>
  `
  document.getElementById('next').onclick = () => {
    state.sceneIndex += 1
    if (state.sceneIndex >= SCENES.length || state.stats.security <= 0) state.screen = 'final'
    else state.screen = 'game'
    beep(510, 0.08)
    render()
  }
}

function finalScreen() {
  const [rate, text] = scoreEnding()
  if (state.stats.danger === 0) state.achievements.add('flawless')

  const topMistakes = Object.entries(state.mistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  const achievements = Object.entries(ACHIEVEMENTS)
    .map(([id, [title, desc]]) => `<li class="${state.achievements.has(id) ? 'ach-on' : 'ach-off'}"><b>${title}</b><br/><span>${desc}</span></li>`)
    .join('')

  el.screen.innerHTML = `
    <h2 class="title">${rate} концовка</h2>
    <p>${text}</p>
    <div class="stats-grid">
      <div class="glass"><b>Правильных решений</b><span>${state.stats.safe}</span></div>
      <div class="glass"><b>Опасных решений</b><span>${state.stats.danger}</span></div>
      <div class="glass"><b>Итоговый XP</b><span>${state.stats.xp}</span></div>
    </div>
    <h3>Достижения</h3>
    <ul class="ach-list">${achievements}</ul>
    <h3>Где ошибался чаще всего</h3>
    <ul>${topMistakes.map(([k, v]) => `<li>${THREAT_LABELS[k]}: ${v}</li>`).join('')}</ul>
    <div class="btns">
      <button class="btn-primary" id="restart">Сыграть ещё раз</button>
      <a class="btn btn-secondary" href="../index.html">На главную</a>
    </div>
  `
  document.getElementById('restart').onclick = restart
  beep(660, 0.12, 'triangle')
}

function restart() {
  state.sceneIndex = 0
  state.stats = { security: 4, xp: 0, focus: 3, risk: 0, safe: 0, danger: 0 }
  state.mistakes = Object.fromEntries(Object.keys(THREAT_LABELS).map((k) => [k, 0]))
  state.achievements = new Set()
  state.lastResult = null
  state.screen = 'start'
  state.names = {
    sender: rng(randomPool.sender),
    delivery: rng(randomPool.delivery),
    place: rng(randomPool.place),
  }
  render()
}

function render() {
  buildHUD()
  if (state.screen === 'intro') introScreen()
  else if (state.screen === 'start') startScreen()
  else if (state.screen === 'game') sceneScreen()
  else if (state.screen === 'result') resultScreen()
  else finalScreen()
}

loadSettings()
restart()
state.screen = 'intro'
render()
