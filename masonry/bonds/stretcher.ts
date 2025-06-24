import { BaseBond } from "./base";
import { Brick } from "../brick";
import { brickTypeSpan } from "../../config";

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
    let col = 0;
    const isOddCourse = course % 2 === 1;

    if (isOddCourse) {
      col += this.addBrick("half", course, col, brickList, filledUnits);
    }

    while (col + brickTypeSpan.full <= numOfUnitsPerCourse) {
      if (!filledUnits.has(`${course}:${col}`)) {
        col += this.addBrick("full", course, col, brickList, filledUnits);
      } else {
        col++;
      }
    }

    if (isOddCourse && col < numOfUnitsPerCourse) {
      if (numOfUnitsPerCourse - col === brickTypeSpan.half) {
        this.addBrick("half", course, col, brickList, filledUnits);
      }
    }
  }
}
