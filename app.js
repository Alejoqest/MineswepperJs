import { mineSwepper } from "./board.js";
import { getInputs, setWarning } from "./html.js";
import { warnings } from "./htmlElements.js";

let numRow = 8;
let numCol = 8;
let numMines = 10;
let game = {
  hasStarted: false,
  hasExploted: false,
  hasFinished: false,
};

const setNumRow = (row) => {
  numRow = row;
};

const setNumCol = (col) => {
  numCol = col;
};

const setNumMines = (mines) => {
  numMines = mines;
};

const setGame = () => {
  const inputs = getInputs();

  if (!inputs.inputRow || !inputs.inputCol || !inputs.inputMines) {
    setWarning(warnings.void);
    return;
  }

  const total = inputs.inputCol * inputs.inputRow;

  if (inputs.inputMines > total) {
    setWarning(warnings.mines);
    return;
  }

  setNumRow(inputs.inputRow);
  setNumCol(inputs.inputCol);
  setNumMines(inputs.inputMines);
  mineSwepper(numRow, numCol, numMines, game, setGame);
};

mineSwepper(numRow, numCol, numMines, game, setGame);
