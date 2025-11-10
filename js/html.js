import {
  cellContent,
  faces,
  gameInputs,
  statusContainers,
} from "./htmlElements.js";

export const renderMineSwepper = (
  gamePanels,
  gameInputs,
  callback,
  funNewGame,
  funPlayAgain
) => {
  for (const panel of gamePanels) {
    const p = document.querySelector(`#${panel.id}`);
    p.value = panel.value;
  }

  for (const input of gameInputs[0].children) {
    const i = document.querySelector(`#${input.id}`);
    i.value = input.value;
  }

  addEvents(callback, funNewGame, funPlayAgain);
};

export const addEvents = (callback, funNewGame, funPlayAgain) => {
  const btnGame = document.querySelector("#newGame");
  btnGame.addEventListener("click", () => {
    callback(funNewGame);
  });
  const faceGame = document.querySelector("#face-container h1");
  faceGame.addEventListener("click", () => {
    callback(funPlayAgain);
  });
  const modalOpen = document.querySelector("#btn-open");
  modalOpen.addEventListener("click", openSetting);
  const modalClose = document.querySelector("#btn-close");
  modalClose.addEventListener("click", closeSetting);
};

export const renderBoard = (
  board,
  game,
  cellAction,
  cellRevealed,
  cellFlaged
) => {
  const numRow = board.length;
  const numCol = board[0].length;
  const gameBoard = document.querySelector(".board");
  gameBoard.innerHTML = "";
  for (let i = 0; i < numRow; i++) {
    const row = createDivider(`row-${i}`, ["row"]);
    for (let n = 0; n < numCol; n++) {
      const cell = createSpan(`c-${i}-${n}`);
      cell.addEventListener("click", (e) => {
        cellAction(e, i, n, cellRevealed);
      });
      cell.addEventListener("contextmenu", (e) => {
        cellAction(e, i, n, cellFlaged);
      });
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
};

export const editBoard = (game, curCell, position) => {
  const cell = getCell(position.row, position.col);
  cell.classList.toggle("flag", curCell.flaged);
  cell.classList.toggle("open", curCell.open);
  cell.innerText = curCell.flaged ? cellContent.flag : ``;
  if (curCell.flaged) cell.classList.remove("open");
  if (curCell.open) {
    cell.classList.toggle("bomb", curCell.mine);
    cell.innerText = `${
      curCell.flaged
        ? cellContent.flag
        : !curCell.mine
        ? curCell.count > 0
          ? curCell.count
          : cellContent.blank
        : game.hasExploted
        ? cellContent.bomb
        : cellContent.flag
    }`;
  }
  cell.classList.add(`count-${curCell.count}`);
};

export const endBoard = (board, game) => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const curCell = board[r][c];
      const isFlaged = curCell.flaged;
      const isMine = curCell.mine;
      const hasWon = !game.hasExploted && game.hasFinished;
      const spanCell = getCell(r, c);
      spanCell.classList.toggle("flag", isFlaged || (hasWon && isMine));
      spanCell.classList.toggle(
        "open",
        game.hasFinished &&
          !isFlaged &&
          ((hasWon && !isMine) || (game.hasExploted && !isFlaged))
      );
      spanCell.classList.toggle(
        "miss",
        game.hasExploted && isFlaged && !isMine
      );
      spanCell.classList.add("end");
      if (!isFlaged) {
        !isMine && spanCell.classList.add(`count-${curCell.count}`);
        spanCell.innerText = `${
          !isMine
            ? curCell.count > 0
              ? curCell.count
              : cellContent.blank
            : game.hasExploted
            ? cellContent.bomb
            : cellContent.flag
        }`;
      }
    }
  }
};

const getCell = (row, col) => {
  const id = `#c-${row}-${col}`;
  return document.querySelector(id);
};

const getSettings = () => {
  return document.querySelector("#modal");
};

const openSetting = () => {
  const settings = getSettings();
  settings.classList.add("active");
};

export const closeSetting = () => {
  const settings = getSettings();
  settings.classList.remove("active");
};

export const renderFace = (game) => {
  const faceStatus = document.querySelector("h1");
  faceStatus.innerHTML = faces.click;
  setTimeout(() => {
    faceStatus.innerText = game.hasFinished
      ? !game.hasExploted
        ? faces.win
        : faces.loss
      : faces.normal;
  }, 150);
};

const createDivider = (id, classes = []) => {
  const div = document.createElement("div");
  div.id = id;
  div.classList.add(...classes);
  return div;
};

const createSpan = (id) => {
  const span = document.createElement("span");
  span.id = id;
  return span;
};

export const getInputs = () => {
  const inputRow = document.querySelector("#row").value;
  const inputCol = document.querySelector("#col").value;
  const inputMines = document.querySelector("#numMines").value;
  return {
    inputRow,
    inputCol,
    inputMines,
  };
};

export const getRadioValue = () => {
  const radios = document.getElementsByName("set-game");
  let selectedValue;

  for (const radio of radios) {
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }

  return selectedValue;
};

export const setTimer = (time) => {
  const timer = document.querySelector("#time");
  timer.value = time;
};

export const setRemainingMines = (remainingMines) => {
  const mines = document.querySelector("#mines");
  mines.value = remainingMines;
};

export const setWarning = (value) => {
  const div = document.querySelector("#warning-row");
  div.innerHTML = "";
  const warning = document.createElement("p");
  warning.innerText = value;
  div.append(warning);
};
