import { BaseBond } from "./base";
import { Brick } from "../brick";

export class StretcherBond extends BaseBond {
  fillCourse({
    brickList,
    course,
    filledUnits,
    numOfUnitsPerCourse,
  }: {
    brickList: Brick[];
    course: number;
    filledUnits: Set<string>;
    numOfUnitsPerCourse: number;
  }) {
    const isOdd = course % 2 === 1;
    let col = 0;

    if (isOdd) {
      const halfBrick = new Brick(col, course, "half");
      brickList.push(halfBrick);
      filledUnits.add(`${course}:${col}`);
      col += halfBrick.span;
    }

    while (col + 1 < numOfUnitsPerCourse) {
      if (!filledUnits.has(`${course}:${col}`)) {
        const fb = new Brick(col, course, "full");
        brickList.push(fb);

        for (let k = 0; k < fb.span; k++) {
          filledUnits.add(`${course}:${col + k}`);
        }
        col += fb.span;
      } else {
        col++;
      }
    }

    if (isOdd && col === numOfUnitsPerCourse - 1) {
      const halfBrick = new Brick(col, course, "half");
      brickList.push(halfBrick);
      filledUnits.add(`${course}:${col}`);
    }
  }
}
