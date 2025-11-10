import {
  closeSetting,
  editBoard,
  endBoard,
  getInputs,
  getRadioValue,
  renderBoard,
  renderFace,
  renderMineSwepper,
  setRemainingMines,
  setTimer,
  setWarning,
} from "./html.js";
import {
  gameInputs,
  gamePanels,
  gameValues,
  warnings,
} from "./htmlElements.js";

export const mineSwepper = () => {
  let board = [];
  let time = 0;
  let timer;
  const game = {
    numRow: 8,
    numCol: 8,
    numMines: 10,
    hasStarted: false,
    hasFinished: false,
    hasExploted: false,
  };
  let remainingMines = game.numMines;

  const setGame = () => {
    const val = getRadioValue();

    setWarning("");

    const inputs = getInputs();

    if (val != "custom") {
      const values = gameValues;
      inputs.inputRow = values[val].row;
      inputs.inputCol = values[val].column;
      inputs.inputMines = values[val].mines;
    }

    if (val == "custom") {
      if (!inputs.inputRow || !inputs.inputCol || !inputs.inputMines) {
        setWarning(warnings.void);
        return;
      }

      const total = inputs.inputCol * inputs.inputRow;

      if (inputs.inputMines > total) {
        setWarning(warnings.mines);
        return;
      }
    }

    closeSetting();

    game.numRow = inputs.inputRow;
    game.numCol = inputs.inputCol;
    game.numMines = inputs.inputMines;

    setupGame();
  };

  const renderGame = () => {
    const gP = gamePanels(getRemainingMines, getTime);
    const values = {
      row: game.numRow,
      col: game.numCol,
      mines: game.numMines,
    };
    const gI = gameInputs(values);
    renderMineSwepper(gP, gI, gameAction, setGame, setupGame);
  };

  const setupGame = () => {
    board = [];
    for (let i = 0; i < game.numRow; i++) {
      board[i] = [];
      for (let n = 0; n < game.numCol; n++) {
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
    remainingMines = game.numMines;
    renderFace(game);
    renderGame();
    renderBoard(board, game, cellAction, cellRevealed, cellFlaged);
  };

  const startGame = (curRow, curCol) => {
    game.hasStarted = true;
    timer = setInterval(updateTimer, 1000);
    for (let i = 0; i < game.numMines; i++) {
      let row;
      let col;
      do {
        row = Math.floor(Math.random() * game.numRow);
        col = Math.floor(Math.random() * game.numCol);
      } while ((row == curRow && col == curCol) || board[row][col].mine);
      board[row][col].mine = true;
    }
    for (let i = 0; i < game.numRow; i++) {
      for (let n = 0; n < game.numCol; n++) {
        if (!board[curRow][curCol].mine) {
          let count = 0;
          const spaces = getAroundSpaces(i, n);
          for (const s of spaces) {
            const nx = s[0];
            const ny = s[1];
            if (
              nx >= 0 &&
              nx < game.numRow &&
              ny >= 0 &&
              ny < game.numCol &&
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
      row > game.numRow ||
      col < 0 ||
      col > game.numCol ||
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
      editBoard(game, curSpace, { row, col });
      killTimer();
      endBoard(board, game);
      renderFace(game);
      return;
    }

    if (!game.hasFinished && curSpace.count === 0) {
      const spaces = getAroundSpaces(row, col);
      for (const space of spaces) {
        const nx = space[0];
        const ny = space[1];
        if (nx >= 0 && nx < game.numRow && ny >= 0 && ny < game.numCol) {
          cellRevealed(nx, ny);
        }
      }
    }

    if (!curSpace.mine) {
      checkState();
    }

    //renderBoard(board, game, cellAction, cellRevealed, cellFlaged);
    editBoard(game, curSpace, { row, col });
    renderFace(game);
  };

  const cellFlaged = (row, col) => {
    if (
      row < 0 ||
      row > game.numRow ||
      col < 0 ||
      col > game.numCol ||
      board[row][col].open ||
      game.hasFinished
    )
      return;
    const curSpace = board[row][col];
    curSpace.flaged = !curSpace.flaged;
    remainingMines = curSpace.flaged ? remainingMines - 1 : remainingMines + 1;
    updateMines();
    editBoard(game, curSpace, { row, col });
  };

  const checkState = () => {
    const totalAmount = game.numRow * game.numCol;
    let count = 0;
    for (const row of board) {
      for (const cell of row) {
        count = cell.open ? count + 1 : count;
      }
    }
    game.hasFinished = count == totalAmount - game.numMines;
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
