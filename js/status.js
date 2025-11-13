import { renderFace, setRemainingMines, setTimer } from "./html.js";
import { elements } from "./htmlElements.js";

export class Status {
  constructor() {
    this.time = 0;
    this.timer = null;
  }

  start = (mines) => {
    this.time = 0;
    this.timer = null;
    elements.mineDisplay.value = this.getRemainingMines(mines);
    elements.timerDisplay.value = this.getTime();
  };

  updateStatus = (game) => {
    const faces = {
      normal: `🙂`,
      loss: `😵`,
      click: `😯`,
      win: `😎`,
    };

    renderFace(faces.click);

    setTimeout(() => {
      const status = game.hasFinished
        ? !game.hasExploded
          ? faces.win
          : faces.loss
        : faces.normal;
      renderFace(status);
    }, 150);
  };

  getRemainingMines = (remainingMines) => {
    const length = remainingMines.toString().length;
    const value = `${
      length == 3
        ? `${remainingMines}`
        : length == 2
        ? `0${remainingMines}`
        : `00${remainingMines}`
    }`;
    return value;
  };

  getTime = () => {
    const length = this.time.toString().length;
    const value = `${
      length == 3
        ? `${this.time}`
        : length == 2
        ? `0${this.time}`
        : `00${this.time}`
    }`;
    return value;
  };

  killTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  updateMines = (remainingMines) => {
    setRemainingMines(this.getRemainingMines(remainingMines));
  };

  startTimer = () => {
    if (this.timer) return;

    this.timer = setInterval(() => {
      this.time++;
      setTimer(this.getTime());
    }, 1000);
  };
}
