export const statusContainers = [
  {
    id: "mine-container",
  },
  {
    id: "time-container",
  },
];

export const faces = {
  normal: `🙂`,
  loss: `😵`,
  win: `😎`,
};

export const cellContent = {
  flag: `🚩`,
  bomb: `💣`,
  blank: ``
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
