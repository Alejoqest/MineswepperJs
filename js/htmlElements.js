export const statusContainers = [
  {
    id: "mine-container",
  },
  {
    id: "time-container",
  },
];

export const elements = {
  resetButton: document.querySelector("#face-container"),
  newGameButton: document.querySelector("#newGame"),
  closeButton: document.querySelector("#btn-close"),
  openButton: document.querySelector("#btn-open"),
  board: document.querySelector("#board"),
  timerDisplay: document.querySelector("#time-container"),
  mineDisplay: document.querySelector("#mine-container"),
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

export const faces = {
  normal: `🙂`,
  loss: `😵`,
  click: `😯`,
  win: `😎`,
};

export const cellContent = {
  flag: `🚩`,
  bomb: `💣`,
  blank: ``,
};

export const gameValues = {
  beginner: {
    row: 8,
    column: 8,
    mines: 10,
  },
  intermediate: {
    row: 16,
    column: 16,
    mines: 30,
  },
  expert: {
    row: 16,
    column: 30,
    mines: 99,
  },
};

export const warnings = {
  void: `There's no values.`,
  mines: `There can't be more mines than cells.`,
};

export const gamePanels = (getRemainingMines, getTime) => {
  return [
    {
      id: "mines",
      value: getRemainingMines(),
      classes: ["panel"],
      disabled: true,
      inputType: "text",
    },
    {
      id: "time",
      value: getTime(),
      classes: ["panel"],
      disabled: true,
      inputType: "text",
    },
  ];
};

export const gameInputs = (values) => {
  const gm = [
    {
      id: "first-row",
      classes: ["bottom-row"],
      children: [
        {
          id: "row",
          value: values.row,
          label: "Rows:",
          classes: ["setting"],
          inputType: "number",
        },
        {
          id: "col",
          label: "Columns:",
          value: values.col,
          classes: ["setting"],
          inputType: "number",
        },
        {
          id: "numMines",
          label: "Mines:",
          value: values.mines,
          classes: ["setting"],
          inputType: "number",
        },
      ],
    },
    {
      id: "second-row",
      classes: ["bottom-row"],
      children: [
        {
          id: "newGame",
          value: "Update",
          classes: ["btn"],
          inputType: "button",
        },
      ],
    },
    {
      id: "warning-row",
      classes: ["bottom-row"],
      children: [],
    },
  ];
  return gm;
};
