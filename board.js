import {
  editBoard,
  endBoard,
  renderBoard,
  renderFace,
  renderMineSwepper,
  setRemainingMines,
  setTimer,
} from "./html.js";
import { gameInputs, gamePanels } from "./htmlElements.js";

export const mineSwepper = (numRow, numCol, numMines, game, SetGame) => {
  let board = [];
  let time = 0;
  let timer;
  let remainingMines = numMines;

  const renderGame = () => {
    const gP = gamePanels(getRemainingMines, getTime);
    const values = {
      row: numRow,
      col: numCol,
      mines: numMines,
    };
    const gI = gameInputs(values);
    renderMineSwepper(gP, gI, gameAction, SetGame, setupGame);
  };

  const setupGame = () => {
    for (let i = 0; i < numRow; i++) {
      board[i] = [];
      for (let n = 0; n < numCol; n++) {
        board[i][n] = {
          open: false,
          mine: false,
          flaged: false,
          count: 0,
        };
      }
    }
    time = 0;
    game.hasStarted = false;
    game.hasExploted = false;
    game.hasFinished = false;
    remainingMines = numMines;
    renderGame();
    renderBoard(board, game, cellAction, cellRevealed, cellFlaged);
  };

  const startGame = (curRow, curCol) => {
    game.hasStarted = true;
    timer = setInterval(updateTimer, 1000);
    for (let i = 0; i < numMines; i++) {
      let row;
      let col;
      do {
        row = Math.floor(Math.random() * numRow);
        col = Math.floor(Math.random() * numCol);
      } while ((row == curRow && col == curCol) || board[row][col].mine);
      board[row][col].mine = true;
    }
    for (let i = 0; i < numRow; i++) {
      for (let n = 0; n < numCol; n++) {
        if (!board[curRow][curCol].mine) {
          let count = 0;
          const spaces = getAroundSpaces(i, n);
          for (const s of spaces) {
            const nx = s[0];
            const ny = s[1];
            if (
              nx >= 0 &&
              nx < numRow &&
              ny >= 0 &&
              ny < numCol &&
              board[nx][ny].mine
            ) {
              count++;
            }
          }
          board[i][n].count = count;
        }
      }
    }
  };

  const getAroundSpaces = (x, y) => {
    const spaces = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];
    return spaces;
  };

  const cellRevealed = (row, col) => {
    if (
      row < 0 ||
      row > numRow ||
      col < 0 ||
      col > numCol ||
      board[row][col].open ||
      board[row][col].flaged ||
      game.hasFinished
    )
      return;
    const curSpace = board[row][col];
    curSpace.open = true;

    
    if (curSpace.mine) {
      game.hasFinished = true;
      game.hasExploted = true;
      editBoard(game, curSpace, {row, col});
      killTimer();
      endBoard(board, game);
      return;
    }

    if (!game.hasFinished && curSpace.count === 0) {
      const spaces = getAroundSpaces(row, col);
      for (const space of spaces) {
        const nx = space[0];
        const ny = space[1];
        if (nx >= 0 && nx < numRow && ny >= 0 && ny < numCol) {
          cellRevealed(nx, ny);
        }
      }
    }

    if (!curSpace.mine) {
      checkState();
    }

    //renderBoard(board, game, cellAction, cellRevealed, cellFlaged);
    editBoard(game, curSpace, {row, col});
    renderFace(game);
  };

  const cellFlaged = (row, col) => {
    if (
      row < 0 ||
      row > numRow ||
      col < 0 ||
      col > numCol ||
      board[row][col].open ||
      game.hasFinished
    )
      return;
    const curSpace = board[row][col];
    curSpace.flaged = !curSpace.flaged;
    remainingMines = curSpace.flaged ? remainingMines - 1 : remainingMines + 1;
    updateMines();
    editBoard(game, curSpace, {row, col})
  };

  const checkState = () => {
    const totalAmount = numRow * numCol;
    let count = 0;
    for (const row of board) {
      for (const cell of row) {
        count = cell.open ? count + 1 : count;
      }
    }
    game.hasFinished = count == totalAmount - numMines;
    game.hasFinished && killTimer();
    game.hasFinished && endBoard(board, game);
  };

  const cellAction = (event, row, col, fun) => {
    event.preventDefault();
    !game.hasStarted && startGame(row, col);
    fun(row, col);
  };

  const gameAction = (fun) => {
    killTimer();
    fun();
  };

  const getRemainingMines = () => {
    const length = remainingMines.toString().length;
    const value = `${
      length == 3
        ? `${remainingMines}`
        : length == 2
        ? `0${remainingMines}`
        : `00${remainingMines}`
    }`;
    return value;
  };

  const getTime = () => {
    const length = time.toString().length;
    const value = `${
      length == 3 ? `${time}` : length == 2 ? `0${time}` : `00${time}`
    }`;
    return value;
  };

  const killTimer = () => {
    clearInterval(timer);
  };

  const updateMines = () => {
    setRemainingMines(getRemainingMines());
  };

  const updateTimer = () => {
    time++;
    setTimer(getTime());
  };

  setupGame();
};
