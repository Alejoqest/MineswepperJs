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
      const cell = createSpan(`c-${i}-${n}`);
      cell.dataset.row = i;
      cell.dataset.col = n;
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
        : game.hasExploded
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
      const hasWon = !game.hasExploded && game.hasFinished;
      const spanCell = getCell(r, c);
      spanCell.classList.toggle("flag", isFlaged || (hasWon && isMine));
      spanCell.classList.toggle(
        "open",
        game.hasFinished &&
          !isFlaged &&
          ((hasWon && !isMine) || (game.hasExploded && !isFlaged))
      );
      spanCell.classList.toggle(
        "miss",
        game.hasExploded && isFlaged && !isMine
      );
      spanCell.classList.add("end");
      if (!isFlaged) {
        !isMine && spanCell.classList.add(`count-${curCell.count}`);
        spanCell.innerText = `${
          !isMine
            ? curCell.count > 0
              ? curCell.count
              : cellContent.blank
            : game.hasExploded
            ? cellContent.bomb
            : cellContent.flag
        }`;
      }
    }
  }
};

const getCell = (row, col) => {
  return elements.cell(row, col);
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

const createSpan = (id) => {
  const span = document.createElement("span");
  span.id = id;
  return span;
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
  const div = document.querySelector("#warning-row");
  div.innerHTML = "";
  const warning = document.createElement("p");
  warning.innerText = value;
  div.append(warning);
};
