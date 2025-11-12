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

export class MineSwepper {
  constructor( rows, cols, mines ) {
    this.numRows = rows;
    this.numCols = cols;
    this.numMines = mines;
    this.board = [];
    this.time = 0;
    this.timer = null;
    this.remainingMines = mines;
    this.hasStarted = false;
    this.hasFinished = false;
    this.hasExploded = false;
  }

  renderGame = () => {
    const gP = gamePanels(this.getRemainingMines, this.getTime);
    const values = {
      row: this.numRows,
      col: this.numCols,
      mines: this.numMines,
    };
    const gI = gameInputs(values);
    renderMineSwepper(gP, gI, this.gameAction, this.setGame, this.setupGame);
  };

  setupGame = () => {
    this.board = [];
    for (let i = 0; i < this.numRows; i++) {
      this.board[i] = [];
      for (let n = 0; n < this.numCols; n++) {
        this.board[i][n] = {
          open: false,
          mine: false,
          flaged: false,
          count: 0,
        };
      }
    }
    this.time = 0;
    this.hasStarted = false;
    this.hasExploted = false;
    this.hasFinished = false;
    this.remainingMines = this.numMines;
    renderFace(this.getGame());
    this.renderGame();
    renderBoard(this.board, this.getGame(), this.cellAction, this.cellRevealed, this.cellFlaged);
  };

  startGame = (curRow, curCol) => {
    this.hasStarted = true;
    this.timer = setInterval(this.updateTimer, 1000);
    for (let i = 0; i < this.numMines; i++) {
      let row;
      let col;
      do {
        row = Math.floor(Math.random() * this.numRows);
        col = Math.floor(Math.random() * this.numCols);
      } while ((row == curRow && col == curCol) || this.board[row][col].mine);
      this.board[row][col].mine = true;
    }
    for (let i = 0; i < this.numRows; i++) {
      for (let n = 0; n < this.numCols; n++) {
        if (!this.board[curRow][curCol].mine) {
          let count = 0;
          const spaces = this.getAroundSpaces(i, n);
          for (const s of spaces) {
            const nx = s[0];
            const ny = s[1];
            if (
              nx >= 0 &&
              nx < this.numRows &&
              ny >= 0 &&
              ny < this.numCols &&
              this.board[nx][ny].mine
            ) {
              count++;
            }
          }
          this.board[i][n].count = count;
        }
      }
    }
  };

  getAroundSpaces = (x, y) => {
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

  cellRevealed = (row, col) => {
    if (
      row < 0 ||
      row > this.numRows ||
      col < 0 ||
      col > this.numCols ||
      this.board[row][col].open ||
      this.board[row][col].flaged ||
      this.hasFinished
    )
      return;
    const curSpace = this.board[row][col];
    curSpace.open = true;

    if (curSpace.mine) {
      this.hasFinished = true;
      this.hasExploded = true;
      editBoard(this.getGame(), curSpace, { row, col });
      this.killTimer();
      endBoard(this.board, this.getGame());
      renderFace(this.getGame());
      return;
    }

    if (!this.hasFinished && curSpace.count === 0) {
      const spaces = this.getAroundSpaces(row, col);
      for (const space of spaces) {
        const nx = space[0];
        const ny = space[1];
        if (nx >= 0 && nx < this.numRows && ny >= 0 && ny < this.numCols) {
          this.cellRevealed(nx, ny);
        }
      }
    }

    if (!curSpace.mine) {
      this.checkState();
    }

    //renderBoard(board, this.getGame(), cellAction, cellRevealed, cellFlaged);
    editBoard(this.getGame(), curSpace, { row, col });
    renderFace(this.getGame());
  };

  cellFlaged = (row, col) => {
    if (
      row < 0 ||
      row > this.numRows ||
      col < 0 ||
      col > this.numCols ||
      this.board[row][col].open ||
      this.hasFinished
    )
      return;
    const curSpace = this.board[row][col];
    curSpace.flaged = !curSpace.flaged;
    this.remainingMines = curSpace.flaged
      ? this.remainingMines - 1
      : this.remainingMines + 1;
    this.updateMines();
    editBoard(this.getGame(), curSpace, { row, col });
  };

  checkState = () => {
    const totalAmount = this.numRows * this.numCols;
    let count = 0;
    for (const row of this.board) {
      for (const cell of row) {
        count = cell.open ? count + 1 : count;
      }
    }
    this.hasFinished = count == totalAmount - this.numMines;
    this.hasFinished && this.killTimer();
    this.hasFinished && endBoard(this.board, { has });
  };

  cellAction = (event, row, col, fun) => {
    event.preventDefault();
    !this.hasStarted && this.startGame(row, col);
    fun(row, col);
  };

  gameAction = (fun) => {
    this.killTimer();
    fun();
  };

  getRemainingMines = () => {
    const length = this.remainingMines.toString().length;
    const value = `${
      length == 3
        ? `${this.remainingMines}`
        : length == 2
        ? `0${this.remainingMines}`
        : `00${this.remainingMines}`
    }`;
    return value;
  };

  getTime = () => {
    const length = this.time.toString().length;
    const value = `${
      length == 3
        ? `${this.time}`
        : length == 2
        ? `0${this.time}`
        : `00${this.time}`
    }`;
    return value;
  };

  killTimer = () => {
    clearInterval(this.timer);
  };

  updateMines = () => {
    setRemainingMines(this.getRemainingMines());
  };

  updateTimer = () => {
    this.time++;
    setTimer(this.getTime());
  };

  getGame = () => {
    return {
      hasExploded: this.hasExploded,
      hasFinished: this.hasFinished,
      hasStarted: this.hasStarted,
    };
  };
}
