import { closeSetting, openSetting } from "./html.js";
import { setEvents } from "./htmlElements.js";
import { Game } from "./game.js";
import { Settings } from "./setting.js";
import { Status } from "./status.js";
import { Solver } from "./solver.js";

let row = 8;
let col = 8;
let mines = 10;

//mineSwepper();
document.addEventListener("DOMContentLoaded", () => {
  const game = new Game(row, col, mines);
  const status = new Status();
  const setting = new Settings(row, col, mines);
  const solver = new Solver(row, col, mines);
  let solverActive = false;

  setEvents({
    onReset: () => {
      status.killTimer();
      game.setupGame();
      solver.restart(row, col, mines);
      init();
    },
    onNewGame: () => {
      status.killTimer();
      const { row, col, mines, sol, error } = setting.setGame();
      if (!error) {
        game.setGame(row, col, mines);
        solverActive = sol;
        init();
      }
    },
    onOpen: openSetting,
    onClose: closeSetting,
    onClick: (row, col) => {
      startGame(row, col);
      const valid = game.cellRevealed(row, col);
      if (valid) {
          const hasFinished = game.checkState();
          status.updateStatus(game.getGame());
          if (hasFinished) {
            status.killTimer();
            solver.killTimer();
          }
      }
    },
    onRightClick: (row, col) => {
      startGame(row, col);
      const valid = game.cellFlaged(row, col);
      if (valid) {
          status.updateMines(game.remainingMines);
          status.updateStatus(game.getGame());
      }
    },
  });

  const startGame = (row, col) => {
    if (!game.hasStarted) {
      game.startGame(row, col);
      status.startTimer();
      game.hasStarted = true;
    }
  };

  const init = () => {
    game.setupGame();
    status.start(game.numMines);
    status.updateStatus(game.getGame());
    (solverActive) && solver.start();
  };

  init();
});
