import { BaseBond } from "./base";
import { BrickDescriptor } from "../../types";

export class WildBond extends BaseBond {
  fillCourse({
    brickList,
    course,
    filledUnits,
    numOfUnitsPerCourse,
  }: {
    brickList: BrickDescriptor[];
    course: number;
    filledUnits: Set<string>;
    numOfUnitsPerCourse: number;
  }) {}
}
