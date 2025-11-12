export const elements = {
  resetButton: document.querySelector("#face-container"),
  faceStatus : document.querySelector("#face-container h1"),
  newGameButton: document.querySelector("#newGame"),
  closeButton: document.querySelector("#btn-close"),
  openButton: document.querySelector("#btn-open"),
  modal: document.querySelector("#modal"),
  board: document.querySelector("#board"),
  timerDisplay: document.querySelector("#time"),
  mineDisplay: document.querySelector("#mines"),
  rowInput: document.querySelector("#row"),
  colInput: document.querySelector("#col"),
  mineInput: document.querySelector("#numMines"),
  newGameRadios: document.querySelectorAll('[name="set-game"]'),
  cell: (row, col) => document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
};

export const setEvents = ({
  onReset,
  onNewGame,
  onClick,
  onRightClick,
  onOpen,
  onClose,
}) => {
  elements.resetButton.addEventListener("click", onReset);

  elements.newGameButton.addEventListener("click", onNewGame)

  elements.board.addEventListener("click", (e) => {
    const cell = e.target.closest("span");
    if (!cell) return;
    const { row, col } = cell.dataset;
    onClick(parseInt(row), parseInt(col));
  });

  elements.board.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const cell = e.target.closest("span");
    if (!cell) return;
    const { row, col } = cell.dataset;
    onRightClick(parseInt(row), parseInt(col));
  });

  elements.openButton.addEventListener("click", onOpen);
  elements.closeButton.addEventListener("click", onClose);
};

export const cellContent = {
  flag: `🚩`,
  bomb: `💣`,
  blank: ``,
};