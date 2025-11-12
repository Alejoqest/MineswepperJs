import { closeSetting, openSetting } from "./html.js";
import { setEvents } from "./htmlElements.js";
import { MineSwepper } from "./mineSwepper.js";
import { Settings } from "./setting.js";
import { Status } from "./status.js";

let row = 8;
let col = 8;
let mines = 10;

//mineSwepper();
document.addEventListener("DOMContentLoaded", () => {
  const game = new MineSwepper(row, col, mines);
  const status = new Status();
  const setting = new Settings(row, col, mines);

  setEvents({
    onReset: () => {
      status.killTimer();
      game.setupGame();
      init();
    },
    onNewGame: () => {
      status.killTimer();
      const { row, col, mines, error } = setting.setGame();
      if (!error) {
        game.setGame(row, col, mines);
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
  };

  init();
});
