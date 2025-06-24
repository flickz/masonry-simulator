import { Bond } from "../types";
import { brickParameters } from "../config";
import { Brick } from "./brick";
import { StretcherBond } from "./bonds/stretcher";
import { BaseBond } from "./bonds/base";

const bonds = {
  stretcher: new StretcherBond(),
};

export class Wall {
  public grid: Brick[];
  public numOfCourses: number;
  public numOfUnitsPerCourse: number;
  public builtBricks: Set<number>;

  constructor(wallWidth: number, wallHeight: number, wallBound: Bond) {
    const fullBrickUnit = brickParameters.fullBrick + brickParameters.headJoint;
    const halfBrickUnit = fullBrickUnit / 2;

    this.numOfCourses = Math.floor(wallHeight / brickParameters.courseHeight);
    this.numOfUnitsPerCourse = Math.floor(wallWidth / halfBrickUnit);

    this.grid = this.generateWall(
      this.numOfCourses,
      this.numOfUnitsPerCourse,
      bonds[wallBound]
    );
    this.builtBricks = new Set();
  }

  private generateWall(
    numOfCourses: number,
    numOfUnitsPerCourse: number,
    bond: BaseBond
  ) {
    const wall: Brick[] = [];
    const filledUnits = new Set<string>();

    for (let course = 0; course < numOfCourses; course++) {
      bond.fillCourse({
        brickList: wall,
        course,
        filledUnits,
        numOfUnitsPerCourse,
      });
    }

    return wall;
  }

  placeNextBrick(brickIndex: number) {
    this.builtBricks.add(brickIndex);
  }

  isWallComplete() {
    return this.builtBricks.size === this.grid.length;
  }
}
