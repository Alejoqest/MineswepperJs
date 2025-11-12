import {
    closeSetting,
  editBoard,
  endBoard,
  getInputs,
  getRadioValue,
  renderBoard,
  renderMineSwepper,
  setWarning,
} from "./html.js";
import { gameInputs, gamePanels, gameValues, warnings } from "./htmlElements.js";

export class MineSwepper {
  constructor(rows, cols, mines) {
    this.numRows = rows;
    this.numCols = cols;
    this.numMines = mines;
    this.board = [];
    this.remainingMines = mines;
    this.hasStarted = false;
    this.hasFinished = false;
    this.hasExploded = false;
  }

  setGame = () => {
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

    this.numRows = inputs.inputRow;
    this.numCols = inputs.inputCol;
    this.numMines = inputs.inputMines;
  };

  renderGame = () => {
    //const gP = gamePanels(this.getRemainingMines, this.getTime);
    const values = { 
      row: this.numRows,
      col: this.numCols,
      mines: this.numMines,
    };
    const gI = gameInputs(values);
    renderMineSwepper(gI);
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
    this.hasStarted = false;
    this.hasExploded = false;
    this.hasFinished = false;
    this.remainingMines = this.numMines;
    this.renderGame();
    renderBoard(
      this.board,
      this.getGame(),
    );
  };

  startGame = (curRow, curCol) => {
    this.hasStarted = true;
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
      endBoard(this.board, this.getGame());
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
    //renderBoard(board, this.getGame(), cellAction, cellRevealed, cellFlaged);
    editBoard(this.getGame(), curSpace, { row, col });
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
    this.hasFinished && endBoard(this.board, this.getGame());
    return this.hasFinished || this.hasExploded;
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

  getGame = () => {
    return {
      hasExploded: this.hasExploded,
      hasFinished: this.hasFinished,
      hasStarted: this.hasStarted,
    };
  };
}
