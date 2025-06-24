export type Bond = "stretcher" | "english";
export type LayeringOrder = "regular" | "per-stride";

export type WallConfig = {
  width: number;
  height: number;
  wallBound: Bond;
  layeringOrder: LayeringOrder;
};
