import { mineSwepper } from "./game.js";
import { closeSetting, openSetting, setRemainingMines } from "./html.js";
import { setEvents } from "./htmlElements.js";
import { MineSwepper } from "./mineSwepper.js";
import { Status } from "./status.js";

//mineSwepper();
document.addEventListener("DOMContentLoaded", () => {
  const game = new MineSwepper(8, 8, 10);
  const status = new Status();

  setEvents({
    onReset: () => {
      status.killTimer();
      game.setupGame();
      init();
    },
    onNewGame: () => {
      status.killTimer();
      game.setGame();
      init();
    },
    onOpen: openSetting,
    onClose: closeSetting,
    onClick: (row, col) => {
      startGame(row, col);
      game.cellRevealed(row, col);
      status.updateStatus(game.getGame());
      const hasFinished = game.checkState();
      if (hasFinished) {
        status.killTimer();
      }
    },
    onRightClick: (row, col) => {
      startGame(row, col);
      game.cellFlaged(row, col);
      status.updateMines(game.getRemainingMines());
      status.updateStatus(game.getGame());
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
