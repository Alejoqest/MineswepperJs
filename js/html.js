import { cellContent, elements } from "./htmlElements.js";

export const setInputs = (row, col, mines) => {
  elements.rowInput.value = row;
  elements.colInput.value = col;
  elements.mineInput.value = mines;
};

export const renderBoard = (board) => {
  const numRow = board.length;
  const numCol = board[0].length;
  const gameBoard = elements.board;
  gameBoard.innerHTML = "";
  for (let i = 0; i < numRow; i++) {
    const row = createDivider(`row-${i}`, ["row"]);
    for (let n = 0; n < numCol; n++) {
      const cell = createCell(i, n);
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
};

export const editBoard = (game, curCell, row, col) => {
  const cell = elements.cell(row, col);
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
        : game.hasExploded
        ? cellContent.bomb
        : cellContent.flag
    }`;
  }
  cell.classList.add(`count-${curCell.count}`);
};

export const endBoard = (board, game) => {
  const hasWon = !game.hasExploded && game.hasFinished;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      const span = elements.cell(row, col);
      span.classList.toggle("flag", cell.flaged || (hasWon && cell.mine));
      span.classList.toggle("miss", cell.flaged && !cell.mine);
      span.classList.toggle(
        "open",
        cell.open || (game.hasExploded && cell.mine && !cell.flaged)
      );
      if (!cell.flaged && !cell.open) {
        span.innerText = `${
          !cell.mine
            ? cellContent.blank
            : game.hasExploded && cell.mine
            ? cellContent.bomb
            : cellContent.flag
        }`;
      }
    }
  }
};

export const openSetting = () => {
  elements.modal.classList.add("active");
};

export const closeSetting = () => {
  elements.modal.classList.remove("active");
};

export const renderFace = (status) => {
  elements.faceStatus.innerHTML = status;
};

const createDivider = (id, classes = []) => {
  const div = document.createElement("div");
  div.id = id;
  div.classList.add(...classes);
  return div;
};

const createCell = (row, col) => {
  const cell = document.createElement("span");
  cell.id = `c-${row}-${col}`;
  cell.dataset.row = row;
  cell.dataset.col = col;
  return cell;
};

export const getInputs = () => {
  return {
    inputRow: elements.rowInput.value,
    inputCol: elements.colInput.value,
    inputMines: elements.mineInput.value,
  };
};

export const getRadioValue = () => {
  let selectedValue;
  for (const radio of elements.newGameRadios) {
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }
  return selectedValue;
};

export const setTimer = (time) => {
  elements.timerDisplay.value = time;
};

export const setRemainingMines = (remainingMines) => {
  elements.mineDisplay.value = remainingMines;
};

export const setWarning = (value) => {
  elements.warning.innerText = value;
};
