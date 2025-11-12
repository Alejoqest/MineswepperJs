import {
  closeSetting,
  getInputs,
  getRadioValue,
  setInputs,
  setWarning,
} from "./html.js";
import { gameValues, warnings } from "./htmlElements.js";

export class Settings {
  constructor(row, col, mines) {
    document.getElementsByName("set-game")[0].checked = true;
    setInputs(row, col, mines);
  }

  setGame = () => {
    const val = getRadioValue();

    setWarning("");

    if (val != "custom") {
      const values = gameValues;
      setInputs(values[val].row, values[val].column, values[val].mines);
    }

    if (val == "custom") {
      let inputs = getInputs();
      if (!inputs.inputRow || !inputs.inputCol || !inputs.inputMines) {
        setWarning(warnings.void);
        return { error: warnings.void};
      }

      const total = inputs.inputCol * inputs.inputRow;

      if (inputs.inputMines > total) {
        setWarning(warnings.mines);
        return { error: warnings.mines };
      }
    }

    closeSetting();

    return {
      row: getInputs().inputRow,
      col: getInputs().inputCol,
      mines: getInputs().inputMines,
    };
  };
}
