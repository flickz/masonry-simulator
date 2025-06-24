import chalk from "chalk";

export const DEFAULT_WALL_BOUND = "stretcher";
export const DEFAULT_LAYERING_ORDER = "regular";
export const DEFAULT_WALL_WIDTH = 2300;
export const DEFAULT_WALL_HEIGHT = 2000;

export const UNIT_CHAR_WIDTH = 5;

export const brickParameters = {
  fullBrick: 210,
  halfBrick: 100,
  headJoint: 10,
  bedJoint: 12.5,
  courseHeight: 62.5,
};

export const robotEnvelope = {
  width: 1300,
  height: 800,
};

export const brickStyles = {
  design: {
    char: "░",
    color: chalk.white,
  },
  built: {
    char: "█",
    color: chalk.white.bold,
  },
};

export const brickTypeSpan = {
  full: 2,
  half: 1,
  queenCloser: 2,
  head: 1,
};
