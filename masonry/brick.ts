import { brickParameters, brickTypeSpan, robotEnvelope } from "../config";
import { BrickType } from "../types";

export class Brick {
  public column: number;
  public course: number;
  public type: BrickType;
  public span: number;
  public stridePos: readonly [number, number];

  constructor(column: number, course: number, type: BrickType) {
    this.column = column;
    this.course = course;
    this.type = type;
    this.span = brickTypeSpan[type];
    this.stridePos = this.getStridePos();
  }

  private getStridePos() {
    const centerHorizontal =
      (this.column + this.span / 2) * brickParameters.halfBrick;
    const centerVertical = this.course * brickParameters.courseHeight;

    const strideHorizontal = Math.floor(centerHorizontal / robotEnvelope.width);
    const strideVertical = Math.floor(centerVertical / robotEnvelope.height);

    return [strideHorizontal, strideVertical] as const;
  }
}
