export type Bond = "stretcher" | "english";
export type LayeringOrder = "regular" | "per-stride";

export type WallConfig = {
  width: number;
  height: number;
  wallBound: Bond;
  layeringOrder: LayeringOrder;
};

export type BrickType = "full" | "half" | "queen" | "head";

export type BrickDescriptor = {
  type: BrickType;
  course: number;
  column: number;
};
