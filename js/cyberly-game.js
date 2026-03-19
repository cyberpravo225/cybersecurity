import { easyWords, mediumWords, hardWords } from './cyberly.js';

const ATTEMPTS = 6;
const KEY_ROWS = ['ЙЦУКЕНГШЩЗХЪ', 'ФЫВАПРОЛДЖЭ', 'ЯЧСМИТЬБЮ'];
const COLOR_PRIORITY = { absent: 1, present: 2, correct: 3 };
const pools = { easy: easyWords, medium: mediumWords, hard: hardWords, hardcore: hardWords };
const labels = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный', hardcore: 'Hardcore' };

const params = new URLSearchParams(window.location.search);
const selectedDifficulty = pools[params.get('difficulty')] ? params.get('difficulty') : 'medium';
const mode = params.get('mode') === 'daily' ? 'daily' : 'random';
const pool = pools[selectedDifficulty].map(word => word.toLowerCase());
const answer = mode === 'daily' ? getDailyWord(pool, selectedDifficulty) : getRandomWord(pool);
const wordLength = answer.length;

const state = {
  row: 0,
  col: 0,
  guesses: Array.from({ length: ATTEMPTS }, () => Array(wordLength).fill('')),
  solved: false,
  keyboardStates: new Map(),
  hintedIndexes: new Set()
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
      : 'Случайное слово из словаря выбранной сложности. Можно играть снова сколько угодно.';

  renderBoard();
  renderKeyboard();
  attachEvents();
  focusBoard();
}

function attachEvents() {
  document.addEventListener('keydown', handlePhysicalKeyboard);
  keyboard.addEventListener('click', handleKeyboardClick);
  restartButton.addEventListener('click', restartGame);
  backspaceButton.addEventListener('click', deleteLetter);
  submitButton.addEventListener('click', submitGuess);
  hintButton?.addEventListener('click', revealHint);
}

function handlePhysicalKeyboard(event) {
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
  if (!button) return;
  addLetter(button.dataset.key);
}

function addLetter(letter) {
  if (state.solved || state.row >= ATTEMPTS || state.col >= wordLength) return;
  state.guesses[state.row][state.col] = letter;
  state.col += 1;
  updateBoardRow(state.row);
  clearMessage();
}

function deleteLetter() {
  if (state.solved || state.col <= 0) return;
  state.col -= 1;
  state.guesses[state.row][state.col] = '';
  updateBoardRow(state.row);
}

function submitGuess() {
  if (state.solved || state.row >= ATTEMPTS) return;
  const guess = state.guesses[state.row].join('').toLowerCase();

  if (!guess.trim()) {
    return setMessage('Сначала введите слово.');
  }

  if (guess.length !== wordLength || state.guesses[state.row].includes('')) {
    return setMessage(`Слово должно содержать ${wordLength} букв.`);
  }

  const evaluation = evaluateGuess(guess, answer, selectedDifficulty === 'hardcore');
  revealRow(state.row, evaluation);
  updateKeyboardStates(guess, evaluation);

  if (guess === answer) {
    state.solved = true;
    result.hidden = false;
    result.textContent = 'Победа! Отличная работа — слово угадано.';
    setMessage('Все буквы на месте. Нажмите «Играть снова», чтобы начать новый раунд.');
    return;
  }

  state.row += 1;
  state.col = 0;

  if (state.row === ATTEMPTS) {
    state.solved = true;
    result.hidden = false;
    result.textContent = `Попытки закончились. Правильное слово: ${answer.toUpperCase()}.`;
    setMessage('Раунд завершён. Можно сыграть ещё раз.');
    return;
  }

  setMessage(`Попытка ${state.row + 1} из ${ATTEMPTS}.`);
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

function updateBoardRow(row) {
  const rowLetters = state.guesses[row];
  const tiles = board.querySelectorAll(`.cyberly-tile[data-row="${row}"]`);
  tiles.forEach((tile, index) => {
    tile.textContent = rowLetters[index];
    tile.classList.toggle('filled', Boolean(rowLetters[index]));
  });
}

function revealRow(row, evaluation) {
  const tiles = board.querySelectorAll(`.cyberly-tile[data-row="${row}"]`);
  tiles.forEach((tile, index) => {
    tile.dataset.state = evaluation[index];
  });
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
  if (state.solved) {
    setMessage('Раунд уже завершён. Начните новую игру, чтобы снова использовать подсказку.');
    return;
  }

  const availableIndexes = [...answer].map((_, index) => index).filter(index => !isIndexRevealed(index));

  if (!availableIndexes.length) {
    setMessage('Все позиции уже открыты в ваших попытках. Подсказка больше не нужна.');
    return;
  }

  const index = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
  state.hintedIndexes.add(index);
  setMessage(`Подсказка: буква «${answer[index].toUpperCase()}» находится на позиции ${index + 1}.`);
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

function getRandomWord(words) {
  const seed = Number(params.get('seed')) || Date.now();
  return words[seed % words.length];
}

function getDailyWord(words, difficulty) {
  const base = new Date();
  const daySeed = Math.floor(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()) / 86400000);
  return words[(daySeed + difficulty.length) % words.length];
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
