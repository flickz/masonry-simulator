import { brickTypeSpan } from "../../config";
import { Brick } from "../brick";
import { BaseBond } from "./base";
import { BrickType } from "../../types";

export class EnglishBond extends BaseBond {
  private fillHeaderCourse(
    brickList: Brick[],
    course: number,
    filled: Set<string>,
    units: number
  ) {
    let col = 0;

    col += this.addBrick("head", course, col, brickList, filled);
    col += this.addBrick("queen", course, col, brickList, filled);

    const END = brickTypeSpan.queen + brickTypeSpan.head;

    while (col + END < units) {
      col += this.addBrick("head", course, col, brickList, filled);
    }

    const remain = units - col;

    if (remain === END) {
      col += this.addBrick("queen", course, col, brickList, filled);
      this.addBrick("head", course, col, brickList, filled);
    } else if (remain === brickTypeSpan.queen) {
      this.addBrick("queen", course, col, brickList, filled);
    } else if (remain === brickTypeSpan.head) {
      this.addBrick("head", course, col, brickList, filled);
    }
  }

  private fillStretcherCourse(
    brickList: Brick[],
    course: number,
    filledUnits: Set<string>,
    numOfUnitsPerCourse: number
  ) {
    let col = 0;
    while (col < numOfUnitsPerCourse) {
      if (!filledUnits.has(`${course}:${col}`)) {
        col += this.addBrick("full", course, col, brickList, filledUnits);
      } else {
        col++;
      }
    }
  }

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
    const isEvenCourse = course % 2 === 0;

    if (isEvenCourse) {
      this.fillStretcherCourse(
        brickList,
        course,
        filledUnits,
        numOfUnitsPerCourse
      );
    } else {
      this.fillHeaderCourse(
        brickList,
        course,
        filledUnits,
        numOfUnitsPerCourse
      );
    }
  }
}
