import { brickStyles, UNIT_CHAR_WIDTH } from "../config";
import { Wall } from "./wall";
import { strideColorFn } from "../util";
import { LayeringOrder } from "../types";

export class AsciiRenderer {
  private wall: Wall;

  constructor(wall: Wall) {
    this.wall = wall;
  }

  renderWallGrid(renderingOrder: LayeringOrder = "regular") {
    // Initialize grid with empty space to render the wall
    const grid = Array.from({ length: this.wall.numOfCourses }, () =>
      Array(this.wall.numOfUnitsPerCourse * (UNIT_CHAR_WIDTH + 1)).fill(" ")
    );

    for (let i = 0; i < this.wall.grid.length; i++) {
      const brick = this.wall.grid[i];
      const brickStyle = this.wall.builtBricks.has(i)
        ? brickStyles.built
        : brickStyles.design;
      const spanWidth = brick.span * (UNIT_CHAR_WIDTH + 1) - 1;
      const start = brick.column * (UNIT_CHAR_WIDTH + 1);
      for (let i = 0; i < spanWidth; i++) {
        const shouldUseStrideColor =
          renderingOrder !== "regular" && brickStyle === brickStyles.built;
        const finalColor = shouldUseStrideColor
          ? strideColorFn(...brick.stridePos)
          : brickStyle.color;

        grid[brick.course][start + i] = finalColor(brickStyle.char);
      }
    }

    for (let i = grid.length - 1; i >= 0; i--) {
      console.log(grid[i].join(""));
      if (i > 0) console.log();
    }
  }
}
