import * as CyberlyWords from './cyberly.js';

const ATTEMPTS = 6;
const MAX_HINTS = 2;
const KEY_ROWS = ['ЙЦУКЕНГШЩЗХЪ', 'ФЫВАПРОЛДЖЭ', 'ЯЧСМИТЬБЮ'];
const COLOR_PRIORITY = { absent: 1, present: 2, correct: 3 };

const wordCatalog = resolveWordCatalog(CyberlyWords);
const pools = wordCatalog.pools;
const labels = wordCatalog.labels;

const params = new URLSearchParams(window.location.search);
const selectedDifficulty = pools[params.get('difficulty')] ? params.get('difficulty') : wordCatalog.defaultDifficulty;
const mode = params.get('mode') === 'daily' ? params.get('mode') : 'random';
const pool = pools[selectedDifficulty].map(word => word.toLowerCase());
const answer = mode === 'daily' ? getDailyWord(pool, selectedDifficulty) : getSeededWord(pool);
const wordLength = answer.length;

const state = {
  row: 0,
  col: 0,
  guesses: Array.from({ length: ATTEMPTS }, () => Array(wordLength).fill('')),
  solved: false,
  keyboardStates: new Map(),
  hintedIndexes: new Set(),
  hintedRows: new Map(),
  hintUses: 0,
  isAnimating: false
};

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('game-message');
const result = document.getElementById('game-result');
const restartButton = document.getElementById('restart-button');
const backspaceButton = document.getElementById('backspace-button');
const submitButton = document.getElementById('submit-button');
const hintButton = document.getElementById('hint-button');
const difficultyLabel = document.getElementById('difficulty-label');
const wordLengthLabel = document.getElementById('word-length-label');
const gameModeLabel = document.getElementById('game-mode-label');
const gameDescription = document.getElementById('game-description');

if (!pool.length || !answer) {
  throw new Error(`Cyberly word pool is empty for difficulty "${selectedDifficulty}".`);
}

init();

function init() {
  board.style.setProperty('--columns', String(wordLength));
  difficultyLabel.textContent = labels[selectedDifficulty];
  wordLengthLabel.textContent = `${wordLength} букв`;
  gameModeLabel.textContent = mode === 'daily' ? 'Слово дня' : 'Свободная игра';
  gameDescription.textContent = mode === 'daily'
    ? 'Сегодня для тебя подготовлено одно общее слово дня. Попробуй угадать его за 6 попыток.'
    : selectedDifficulty === 'hardcore'
      ? 'Hardcore-режим: только зелёные и чёрные подсказки, без жёлтых совпадений.'
      : `Случайное слово из словаря «${labels[selectedDifficulty]}». Можно играть снова сколько угодно.`;

  renderBoard();
  renderKeyboard();
  attachEvents();
  updateHintButton();
  updateActiveRow();
  focusBoard();
}

function attachEvents() {
  document.addEventListener('keydown', handlePhysicalKeyboard);
  keyboard.addEventListener('click', handleKeyboardClick);
  keyboard.addEventListener('pointerdown', handleKeyboardPointerDown);
  keyboard.addEventListener('pointerup', handleKeyboardPointerUp);
  keyboard.addEventListener('pointercancel', handleKeyboardPointerUp);
  keyboard.addEventListener('pointerleave', handleKeyboardPointerUp);
  restartButton.addEventListener('click', restartGame);
  backspaceButton.addEventListener('click', deleteLetter);
  submitButton.addEventListener('click', submitGuess);
  hintButton?.addEventListener('click', revealHint);
}

function handlePhysicalKeyboard(event) {
  if (state.isAnimating) return;
  if (state.solved && event.key !== 'Enter') return;

  if (event.key === 'Backspace') {
    event.preventDefault();
    deleteLetter();
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    if (state.solved) {
      restartGame();
    } else {
      submitGuess();
    }
    return;
  }

  const letter = normalizeLetter(event.key);
  if (letter) addLetter(letter);
}

function handleKeyboardClick(event) {
  const button = event.target.closest('button[data-key]');
  if (!button || state.isAnimating) return;
  addLetter(button.dataset.key);
}

function handleKeyboardPointerDown(event) {
  const button = event.target.closest('button[data-key]');
  if (!button) return;
  button.classList.add('pressed');
}

function handleKeyboardPointerUp(event) {
  const button = event.target.closest('button[data-key]');
  if (!button) return;
  button.classList.remove('pressed');
}

function addLetter(letter) {
  if (state.solved || state.isAnimating || state.row >= ATTEMPTS) return;
  const nextCol = findNextEditableCol(state.row, state.col);
  if (nextCol === -1) return;
  state.guesses[state.row][nextCol] = letter;
  state.col = findNextEditableCol(state.row, nextCol + 1);
  if (state.col === -1) state.col = wordLength;
  updateBoardRow(state.row, { animateIndex: nextCol });
  updateActiveRow();
  clearMessage();
}

function deleteLetter() {
  if (state.solved || state.isAnimating) return;
  const previousCol = findPreviousEditableFilledCol(state.row, Math.min(state.col - 1, wordLength - 1));
  if (previousCol === -1) return;
  state.guesses[state.row][previousCol] = '';
  state.col = previousCol;
  updateBoardRow(state.row);
  updateActiveRow();
}

async function submitGuess() {
  if (state.solved || state.isAnimating || state.row >= ATTEMPTS) return;
  const guess = state.guesses[state.row].join('').toLowerCase();

  if (!guess.trim()) {
    shakeRow(state.row);
    return setMessage('Сначала введите слово.');
  }

  if (guess.length !== wordLength || state.guesses[state.row].includes('')) {
    shakeRow(state.row);
    return setMessage(`Слово должно содержать ${wordLength} букв.`);
  }

  const evaluation = evaluateGuess(guess, answer, selectedDifficulty === 'hardcore');
  state.isAnimating = true;
  await revealRow(state.row, evaluation);
  updateKeyboardStates(guess, evaluation);

  if (guess === answer) {
    state.solved = true;
    result.hidden = false;
    result.textContent = 'Победа! Отличная работа — слово угадано.';
    result.classList.add('success');
    setMessage('Все буквы на месте. Нажмите «Играть снова», чтобы начать новый раунд.');
    celebrateWin(state.row);
    state.isAnimating = false;
    updateHintButton();
    return;
  }

  state.row += 1;
  state.col = 0;

  if (getConsumedAttempts() >= ATTEMPTS) {
    state.solved = true;
    revealLoss(answer);
    setMessage('Раунд завершён. Попытки закончились.');
    state.isAnimating = false;
    updateHintButton();
    return;
  }

  state.isAnimating = false;
  updateActiveRow();
  setMessage(`Попытка ${getConsumedAttempts() + 1} из ${ATTEMPTS}.`);
  focusBoard();
}

function evaluateGuess(guess, target, hardcoreMode = false) {
  const result = Array(wordLength).fill('absent');

  [...guess].forEach((letter, index) => {
    if (target[index] === letter) {
      result[index] = 'correct';
    }
  });

  if (hardcoreMode) {
    return result;
  }

  const letterCounts = new Map();

  [...target].forEach((letter, index) => {
    if (guess[index] !== letter) {
      letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
    }
  });

  [...guess].forEach((letter, index) => {
    if (result[index] === 'correct') return;
    const count = letterCounts.get(letter) || 0;
    if (count > 0) {
      result[index] = 'present';
      letterCounts.set(letter, count - 1);
    }
  });

  return result;
}

function renderBoard() {
  board.innerHTML = '';
  for (let row = 0; row < ATTEMPTS; row += 1) {
    const rowEl = document.createElement('div');
    rowEl.className = 'cyberly-row';
    rowEl.dataset.row = String(row);

    for (let col = 0; col < wordLength; col += 1) {
      const cell = document.createElement('div');
      cell.className = 'cyberly-tile';
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      rowEl.appendChild(cell);
    }
    board.appendChild(rowEl);
  }
}

function updateBoardRow(row, options = {}) {
  const rowLetters = state.guesses[row];
  const tiles = board.querySelectorAll(`.cyberly-tile[data-row="${row}"]`);
  tiles.forEach((tile, index) => {
    const hasLetter = Boolean(rowLetters[index]);
    tile.textContent = rowLetters[index];
    tile.classList.toggle('filled', hasLetter);
    tile.classList.toggle('active', row === state.row && index === state.col && !state.solved && !state.isAnimating);
    tile.classList.toggle('hinted', isHintedCell(row, index));

    if (options.animateIndex === index && hasLetter) {
      tile.classList.remove('tile-pop');
      void tile.offsetWidth;
      tile.classList.add('tile-pop');
    }
  });
}

async function revealRow(row, evaluation) {
  const tiles = [...board.querySelectorAll(`.cyberly-tile[data-row="${row}"]`)];

  for (const [index, tile] of tiles.entries()) {
    tile.style.setProperty('--flip-delay', `${index * 150}ms`);
    tile.classList.remove('flip');
    void tile.offsetWidth;
    tile.classList.add('flip');
    await wait(150);
    tile.dataset.state = evaluation[index];
  }

  await wait(450);
  tiles.forEach(tile => tile.classList.remove('active'));
}

function renderKeyboard() {
  keyboard.innerHTML = '';
  KEY_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'cyberly-keyboard-row';
    [...row].forEach(letter => rowEl.appendChild(createKey(letter, letter)));
    keyboard.appendChild(rowEl);
  });
}

function createKey(key, label, wide = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `cyberly-key ${wide ? 'wide' : ''}`.trim();
  button.dataset.key = key;
  button.textContent = label;
  return button;
}

function revealHint() {
  hintButton?.classList.remove('hint-pop');
  void hintButton?.offsetWidth;
  hintButton?.classList.add('hint-pop');

  if (state.solved) {
    setMessage('Раунд уже завершён. Начните новую игру, чтобы снова использовать подсказку.');
    return;
  }

  if (state.isAnimating) {
    setMessage('Дождитесь завершения текущей анимации.');
    return;
  }

  if (state.hintUses >= MAX_HINTS) {
    setMessage('Лимит подсказок исчерпан.');
    updateHintButton();
    return;
  }

  if (getConsumedAttempts() >= ATTEMPTS - 1) {
    setMessage('Подсказка недоступна: не осталось попыток для штрафа.');
    return;
  }

  const availableIndexes = [...answer].map((_, index) => index).filter(index => !isIndexRevealed(index));

  if (!availableIndexes.length) {
    setMessage('Все позиции уже открыты в ваших попытках. Подсказка больше не нужна.');
    return;
  }

  const index = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  state.hintedIndexes.add(index);
  state.hintUses += 1;
  lockHintedCell(state.row, index);
  state.guesses[state.row][index] = answer[index].toUpperCase();
  state.col = findNextEditableCol(state.row, 0);
  if (state.col === -1) state.col = wordLength;
  updateBoardRow(state.row, { animateIndex: index });
  pulseHintedTile(state.row, index);
  updateActiveRow();
  updateHintButton();
  setMessage(`Подсказка ${state.hintUses}/${MAX_HINTS}: буква «${answer[index].toUpperCase()}» открыта на позиции ${index + 1}. Списана 1 попытка без пропуска строки.`);
}

function pulseHintedTile(row, index) {
  const tile = board.querySelector(`.cyberly-tile[data-row="${row}"][data-col="${index}"]`);
  if (!tile) return;
  tile.classList.remove('hint-reveal');
  void tile.offsetWidth;
  tile.classList.add('hint-reveal');
}

function isIndexRevealed(index) {
  if (state.hintedIndexes.has(index)) return true;

  for (let row = 0; row < state.row; row += 1) {
    const guess = state.guesses[row].join('').toLowerCase();
    if (guess[index] === answer[index]) {
      return true;
    }
  }

  return false;
}

function updateKeyboardStates(guess, evaluation) {
  [...guess.toUpperCase()].forEach((letter, index) => {
    const nextState = evaluation[index];
    const currentState = state.keyboardStates.get(letter);
    if (!currentState || COLOR_PRIORITY[nextState] > COLOR_PRIORITY[currentState]) {
      state.keyboardStates.set(letter, nextState);
    }
  });

  keyboard.querySelectorAll('.cyberly-key[data-key]').forEach(button => {
    const stateName = state.keyboardStates.get(button.dataset.key);
    if (stateName) {
      button.dataset.state = stateName;
    }
  });
}

function findNextEditableCol(row, startIndex) {
  const lockedIndexes = state.hintedRows.get(row) || new Set();
  for (let index = startIndex; index < wordLength; index += 1) {
    if (lockedIndexes.has(index)) continue;
    if (!state.guesses[row][index]) return index;
  }
  return -1;
}

function findPreviousEditableFilledCol(row, startIndex) {
  const lockedIndexes = state.hintedRows.get(row) || new Set();
  for (let index = startIndex; index >= 0; index -= 1) {
    if (lockedIndexes.has(index)) continue;
    if (state.guesses[row][index]) return index;
  }
  return -1;
}

function lockHintedCell(row, index) {
  if (!state.hintedRows.has(row)) {
    state.hintedRows.set(row, new Set());
  }
  state.hintedRows.get(row).add(index);
}

function isHintedCell(row, index) {
  return state.hintedRows.get(row)?.has(index) || false;
}

function getConsumedAttempts() {
  return state.row + state.hintUses;
}

function shakeRow(row) {
  const rowEl = board.querySelector(`.cyberly-row[data-row="${row}"]`);
  if (!rowEl) return;
  rowEl.classList.remove('shake');
  void rowEl.offsetWidth;
  rowEl.classList.add('shake');
}

function celebrateWin(row) {
  const tiles = board.querySelectorAll(`.cyberly-tile[data-row="${row}"]`);
  tiles.forEach((tile, index) => {
    tile.style.setProperty('--win-delay', `${index * 90}ms`);
    tile.classList.add('win-bounce');
  });
  board.classList.add('is-win');
}

function revealLoss(correctWord) {
  board.classList.add('is-loss');
  result.hidden = false;
  result.classList.remove('success');
  result.classList.add('loss-reveal');
  result.innerHTML = `Правильное слово: <strong>${correctWord.toUpperCase()}</strong>.`;
}

function updateActiveRow() {
  board.querySelectorAll('.cyberly-row').forEach((rowEl, index) => {
    rowEl.classList.toggle('current', index === state.row && !state.solved);
    updateBoardRow(index);
  });
}

function updateHintButton() {
  if (!hintButton) return;
  const remaining = Math.max(MAX_HINTS - state.hintUses, 0);
  hintButton.disabled = state.solved || state.hintUses >= MAX_HINTS;
  hintButton.textContent = remaining > 0 ? `💡 Подсказка (${remaining})` : '💡 Подсказка недоступна';
}

function restartGame() {
  const url = new URL(window.location.href);
  if (mode === 'random') {
    url.searchParams.set('seed', String(Date.now()));
  }
  window.location.href = url.toString();
}

function normalizeLetter(value) {
  if (!value) return '';
  const normalized = value.toUpperCase().replace('Ё', 'Е');
  return /^[А-Я]$/.test(normalized) ? normalized : '';
}

function getSeededWord(words) {
  const seed = Number(params.get('seed')) || Date.now();
  return words[seed % words.length];
}

function getDailyWord(words, difficulty) {
  const base = new Date();
  const daySeed = Math.floor(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()) / 86400000);
  return words[(daySeed + difficulty.length) % words.length];
}

function resolveWordCatalog(wordsModule) {
  const poolsConfig = [
    { key: 'easy', label: '3–4 буквы', sources: ['easyWords', 'shortWords', 'words34'] },
    { key: 'medium', label: '5–6 букв', sources: ['mediumWords', 'midWords', 'words56'] },
    { key: 'hard', label: '7+ букв', sources: ['hardWords', 'longWords', 'words7plus'] },
    { key: 'hardcore', label: 'Hardcore', sources: ['hardcoreWords', 'hardWords', 'longWords', 'words7plus'] }
  ];

  const pools = Object.fromEntries(
    poolsConfig
      .map(({ key, sources }) => [key, getFirstArray(wordsModule, sources)])
      .filter(([, value]) => Array.isArray(value) && value.length)
  );

  if (!pools.hardcore && pools.hard) {
    pools.hardcore = pools.hard;
  }

  const labels = Object.fromEntries(
    poolsConfig
      .filter(({ key }) => pools[key])
      .map(({ key, label }) => [key, label])
  );

  const defaultDifficulty = pools.medium ? 'medium' : Object.keys(pools)[0];

  if (!defaultDifficulty) {
    throw new Error('Cyberly word lists are missing or empty.');
  }

  return { pools, labels, defaultDifficulty };
}

function getFirstArray(wordsModule, keys) {
  for (const key of keys) {
    if (Array.isArray(wordsModule[key]) && wordsModule[key].length) {
      return wordsModule[key];
    }
  }
  return null;
}

function setMessage(text) {
  message.textContent = text;
}

function clearMessage() {
  if (!result.hidden) return;
  message.textContent = 'Введите слово с клавиатуры или нажимайте экранные клавиши.';
}

function focusBoard() {
  document.body.focus?.();
}

function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}
