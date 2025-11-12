import { mineSwepper } from "./game.js";
import { closeSetting, openSetting } from "./html.js";
import { setEvents } from "./htmlElements.js";
import { MineSwepper } from "./mineSwepper.js";

//mineSwepper();
document.addEventListener('DOMContentLoaded', () => {
    const game = new MineSwepper(8, 8, 10);

    setEvents({
        onReset: () => {
            game.setupGame();
            init()
        },
        onNewGame: () => {
            game.setGame();
            init();
        },
        onOpen: openSetting,
        onClose : closeSetting,
        onClick : (row, col) => {
            startGame(row, col)
            game.cellRevealed(row, col)
        },
        onRightClick : (row, col) => {
            startGame(row, col)
            game.cellFlaged(row, col)
        }
    })

    const startGame = (row, col) => {
        if (!game.hasStarted) game.startGame(row, col)
    }

    const init = () => {
        game.setupGame();
    }

    init();
})


