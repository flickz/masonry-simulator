import { BrickType } from "../../types";
import { Brick } from "../brick";

export abstract class BaseBond {
  abstract fillCourse({
    brickList,
    course,
    filledUnits,
    numOfUnitsPerCourse,
  }: {
    brickList: Brick[];
    course: number;
    filledUnits: Set<string>;
    numOfUnitsPerCourse: number;
  }): void;

  protected addBrick(
    type: BrickType,
    course: number,
    column: number,
    brickList: Brick[],
    filledUnits: Set<string>
  ): number {
    const brick = new Brick(column, course, type);
    brickList.push(brick);
    for (let k = 0; k < brick.span; k++) {
      filledUnits.add(`${course}:${column + k}`);
    }
    return brick.span;
  }
}
