import { closeSetting, getInputs, getRadioValue, setWarning } from "./html.js";
import { gameValues, warnings } from "./htmlElements.js";

export class Settings {
  constructor() {
    document.getElementsByName("set-game")[0].checked = true;
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

    return {
      row: inputs.inputRow,
      col: inputs.inputCol,
      mines: inputs.inputMines,
    };
  };
}
