import { Wall } from "./wall";

export class StrideOptimizer {
  private sideWaysCost: number;
  private upDownCost: number;

  constructor(sideWaysCost: number = 1, upDownCost: number = 3) {
    this.sideWaysCost = sideWaysCost;
    this.upDownCost = upDownCost;
  }

  optimizeOrder(wall: Wall) {
    const strideMap = new Map<string, number[]>();

    // group bricks by stride window
    wall.grid.forEach((brick, index) => {
      const key = brick.stridePos.join(":");
      if (!strideMap.has(key)) {
        strideMap.set(key, []);
      }
      strideMap.get(key)!.push(index);
    });

    const keys = [...strideMap.keys()];
    const heuristic = ([sx, sz], [tx, tz]) =>
      this.sideWaysCost * Math.abs(sx - tx) +
      this.upDownCost * Math.abs(sz - tz);

    const visited = new Set();
    const order: number[] = [];
    let [cx, cz] = [0, 0]; // start pose

    while (visited.size < keys.length) {
      let bestKey: string | undefined,
        bestCost = Infinity;
      for (const key of keys) {
        if (visited.has(key)) continue;
        const [sx, sz] = key.split(":").map(Number);
        const cost = heuristic([cx, cz], [sx, sz]);

        if (cost < bestCost) {
          bestCost = cost;
          bestKey = key;
        }
      }

      if (!bestKey) break;
      visited.add(bestKey);
      const [nx, nz] = bestKey.split(":").map(Number);
      cx = nx;
      cz = nz;
      order.push(...strideMap.get(bestKey)!);
    }

    return order;
  }
}
