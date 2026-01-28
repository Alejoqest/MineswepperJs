import { elements } from "./htmlElements.js";

export class Solver {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.timer;
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
    this.chose();

    setTimeout(() => {
      this.timer = setInterval(() => {
        this.solve();
      }, time);
    }, time);
  };

  solve = () => {
    let hasChosen = false;

    const open = document.querySelectorAll(".open");

    const hidden = document.querySelectorAll(":not(.open):not(.flag)");

    const flags = document.querySelectorAll(".flag");

    if (flags.length === this.mines) {
      hidden.forEach((c) => this.click(c.dataset.row, c.dataset.col));
      return;
    }

    open.forEach((c) => {
      const count = +c.innerHTML;

      if (!count) return;

      const row = +c.dataset.row;
      const col = +c.dataset.col;

      const neighbors = this.getNeighbors(row, col);

      const flagged = neighbors.filter((n) => n.classList.contains("flag"));

      const hidden = neighbors.filter(
        (n) => !n.classList.contains("open") && !n.classList.contains("flag"),
      );

      if (hidden.length && hidden.length + flagged.length === count) {
        hidden.forEach((n) => {
          if (!n.classList.contains("flag")) {
            n.classList.add("flag");
            hasChosen = true;
          }
        });
      }

      if (flagged.length === count) {
        hidden.forEach((n) => {
          if (!n.classList.contains("open") && !n.classList.contains("flag")) {
            this.click(n.dataset.row, n.dataset.col);
            hasChosen = true;
          }
        });
      }
    });

    if (!hasChosen) {
      this.guess();
      return;
    }
  };

  getNeighbors(row, col) {
    const neighbors = [];

    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r === row && c === col) continue;
        const cell = elements.cell(r, c);
        if (cell) neighbors.push(cell);
      }
    }
    return neighbors;
  }

  getBorder = () => {
    const cells = document.querySelectorAll(".open");
    const border = new Set();

    cells.forEach((c) => {
      const row = +c.dataset.row;
      const col = +c.dataset.col;
      this.getNeighbors(row, col).forEach((n) => {
        !n.classList.contains("open") &&
          !n.classList.contains("flag") &&
          border.add(n);
      });
    });

    return [...border];
  };

  getProb = (cell) => {
    const row = +cell.dataset.row;
    const col = +cell.dataset.col;

    let prob = 0;
    let con = 0;

    this.getNeighbors(row, col).forEach((n) => {
      if (!n.classList.contains("open")) return;
      const count = +n.innerHTML;
      if (!count) return;

      const nNeigh = this.getNeighbors(+n.dataset.row, +n.dataset.col);

      const flagged = nNeigh.filter((x) => x.classList.contains("flag")).length;

      const hidden = nNeigh.filter(
        (x) => !x.classList.contains("open") && !x.classList.contains("flag"),
      ).length;

      if (hidden > 0) {
        prob += (count - flagged) / hidden;
        con++;
      }
    });

    return con ? prob / con : 1;
  };

  guess = () => {
    const border = this.getBorder();

    if (!border.length) return;

    let best = null;

    let bestProb = Infinity;

    border.forEach((c) => {
      const p = this.getProb(c);
      if (p < bestProb) {
        bestProb = p;
        best = c;
      }
    });

    if (best && !best.classList.contains("open")) {
      this.click(best.dataset.row, best.dataset.col);
    }
  };

  chose = () => {
    let valid = false;
    let row, col;
    do {
      row = Math.floor(Math.random() * this.rows);
      col = Math.floor(Math.random() * this.cols);
      valid = this.click(row, col);
    } while (!valid);
  };

  run = () => {};

  click = (row, col) => {
    const cell = elements.cell(row, col);
    //console.log(row + " " + col);
    //console.log(cell)
    if (
      cell &&
      !cell.classList.contains("open") &&
      !cell.classList.contains("flag")
    ) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        //clientX: cell.getBoundingClientRect().left + 25,
        //clientY: cell.getBoundingClientRect().top + 25,
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
