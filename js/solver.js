import { elements } from "./htmlElements.js";

export class Solver {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.timer;
    //this.start()
  }

  restart(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    clearInterval(this.timer);
  }

  killTimer() {
    clearInterval(this.timer);
  }

  start = (time = 300) => {
    this.timer = setInterval(() => this.chose(), time)
  };

  getNeighbors(row, col) {
    const neighbors = [];

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r === row && c === col) continue;
        const cell = document.querySelector(
          `span[data-row="${r}"][data-col="${c}"]`,
        );
        if (cell) neighbors.push(cell);
      }
    }
    return neighbors;
  }

  chose = () => {
    let valid = false;
    let count = 0;
    do {
      console.log("ocunt =" + count);
      row = Math.floor(Math.random() * this.rows);
      col = Math.floor(Math.random() * this.cols);
      valid = this.click(row, col);
      console.log(valid);
      count++;
    } while (!valid);
  };

  run = () => {};

  click = (row, col) => {
    const cell = elements.cell(row, col);
    console.log(row + " " + col);
    //console.log(cell)
    if (cell && !cell.classList.contains("open")) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientX: cell.getBoundingClientRect().left + 25, // Center of the cell
        clientY: cell.getBoundingClientRect().top + 25, // Center of the cell
      });
      cell.dispatchEvent(clickEvent);
      return true;
    } else {
      console.log("Cell does not exist.");
      return false;
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
}
