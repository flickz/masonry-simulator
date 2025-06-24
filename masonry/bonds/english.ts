import { Brick } from "../brick";
import { BaseBond } from "./base";

export class EnglishBond extends BaseBond {
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
    // TODO: Implement
  }
}
