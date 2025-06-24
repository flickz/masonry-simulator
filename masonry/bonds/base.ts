import { Brick } from "../brick";
import { BrickDescriptor, BrickType } from "../../types";
import { brickTypeSpan } from "../../config";

export abstract class BaseBond {
  protected addBrick(
    type: BrickType,
    course: number,
    column: number,
    brickLayout: BrickDescriptor[],
    filledUnits: Set<string>
  ): number {
    const span = brickTypeSpan[type];
    brickLayout.push({ type, course, column });
    for (let k = 0; k < span; k++) {
      filledUnits.add(`${course}:${column + k}`);
    }
    return span;
  }

  abstract fillCourse({
    brickList,
    course,
    filledUnits,
    numOfUnitsPerCourse,
  }: {
    brickList: BrickDescriptor[];
    course: number;
    filledUnits: Set<string>;
    numOfUnitsPerCourse: number;
  }): void;
}
