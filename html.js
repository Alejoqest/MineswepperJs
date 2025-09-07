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
  //document.body.innerHTML = "";

  for (const panel of gamePanels) {
    const p = document.querySelector(`#${panel.id}`)
    p.value = panel.value;
    
  }
  //const game = document.createElement("div");
  //game.classList.add("game");

  //const gameStatus = createTop(gamePanels);
  //const gameBoard = document.createElement("div");
  //const gameBottom = createBottom(gameInputs);

  /*gameStatus.classList.add("status");
  gameBoard.classList.add("board");
  game.append(gameStatus, gameBoard);
  document.body.appendChild(game);
  createSettings(gameInputs);*/
  addEvents(callback, funNewGame, funPlayAgain);
};

const createTop = (gamePanels) => {
  const gameStatus = document.createElement("div");
  for (let i = 0; i < statusContainers.length; i++) {
    const div = createDivider(statusContainers[i].id);
    div.append(
      createInput(
        gamePanels[i].id,
        gamePanels[i].value,
        gamePanels[i].classes,
        gamePanels[i].inputType,
        gamePanels[i].disabled
      )
    );
    const append = [div];
    gameStatus.append(...append);
  }

  const facePanel = createDivider("face-container");
  const face = document.createElement("h1");
  face.classList.add("face");
  face.innerText = faces.normal;
  facePanel.append(face);
  gameStatus.append(facePanel);
  return gameStatus;
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
  cell.innerText = (curCell.flaged)? cellContent.flag : ``;
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

export const renderFace = (game) => {
  const faceStatus = document.querySelector("h1");
  faceStatus.innerText = game.hasFinished
    ? !game.hasExploted
      ? faces.win
      : faces.loss
    : faces.normal;
};

const createDivider = (id, classes = []) => {
  const div = document.createElement("div");
  div.id = id;
  div.classList.add(...classes);
  return div;
};

const createLabel = (content, iFor) => {
  const label = document.createElement("label");
  label.htmlFor = iFor;
  label.innerText = content;
  return label;
};

const createInput = (id, value, classes, type = "text", disabled = false) => {
  const input = document.createElement("input");
  input.disabled = disabled;
  input.type = type;
  input.classList.add(...classes);
  input.id = id;
  input.value = value;
  return input;
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

const createSettings = (gameInputs) => {
  const settings = createDivider("settings");
  let settingAppend = [];
  for (const inputRow of gameInputs) {
    const divider = createDivider(`${inputRow.id}`, inputRow.classes);
    for (const inputGame of inputRow.children) {
      let divAppend = [];
      const div = createDivider(`${inputGame.id}-divider`);
      const input = createInput(
        inputGame.id,
        inputGame.value,
        inputGame.classes,
        inputGame.inputType
      );
      input.min = 1;
      if (inputGame.label) {
        const labelText = inputGame.label;
        const label = createLabel(labelText, inputGame.id);
        const br = document.createElement("br");
        divAppend.push(label, br);
      }
      divAppend.push(input);
      div.append(...divAppend);
      divider.append(div);
    }
    settingAppend.push(divider);
  }
  settings.append(...settingAppend);
  document.body.append(settings);
};
