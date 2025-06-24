import { Bond, BrickDescriptor } from "../types";
import { brickParameters } from "../config";
import { Brick } from "./brick";
import { StretcherBond } from "./bonds/stretcher";
import { BaseBond } from "./bonds/base";
import { EnglishBond } from "./bonds/english";

const bonds = {
  stretcher: new StretcherBond(),
  english: new EnglishBond(),
};

export class Wall {
  public brickLayout: BrickDescriptor[];
  public numOfCourses: number;
  public numOfUnitsPerCourse: number;
  public builtBricks: Set<number>;
  private brickCache = new Map<number, Brick>();

  constructor(wallWidth: number, wallHeight: number, wallBound: Bond) {
    const fullBrickUnit = brickParameters.fullBrick + brickParameters.headJoint;
    const halfBrickUnit = fullBrickUnit / 2;

    this.numOfCourses = Math.floor(wallHeight / brickParameters.courseHeight);
    this.numOfUnitsPerCourse = Math.floor(wallWidth / halfBrickUnit);

    this.brickLayout = this.generateBrickLayout(
      this.numOfCourses,
      this.numOfUnitsPerCourse,
      bonds[wallBound]
    );
    this.builtBricks = new Set();
  }

  private generateBrickLayout(
    numOfCourses: number,
    numOfUnitsPerCourse: number,
    bond: BaseBond
  ) {
    const layout: BrickDescriptor[] = [];
    const filledUnits = new Set<string>();

    for (let course = 0; course < numOfCourses; course++) {
      bond.fillCourse({
        brickList: layout,
        course,
        filledUnits,
        numOfUnitsPerCourse,
      });
    }

    return layout;
  }

  getBrick(index: number): Brick {
    if (this.brickCache.has(index)) {
      return this.brickCache.get(index)!;
    }

    const descriptor = this.brickLayout[index];
    if (!descriptor) {
      throw new Error(`No brick descriptor found for index ${index}`);
    }

    const brick = new Brick(
      descriptor.column,
      descriptor.course,
      descriptor.type
    );
    this.brickCache.set(index, brick);
    return brick;
  }

  get totalBricks(): number {
    return this.brickLayout.length;
  }

  placeNextBrick(brickIndex: number) {
    this.builtBricks.add(brickIndex);
  }

  isWallComplete() {
    return this.builtBricks.size === this.totalBricks;
  }
}
