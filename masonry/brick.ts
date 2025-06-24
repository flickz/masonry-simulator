import { brickParameters, brickTypeSpan, robotEnvelope } from "../config";

export class Brick {
  public column: number;
  public course: number;
  public type: "full" | "half" | "queenCloser" | "head";
  public span: number;
  public stridePos: readonly [number, number];

  constructor(
    column: number,
    course: number,
    type: "full" | "half" | "queenCloser" | "head"
  ) {
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
