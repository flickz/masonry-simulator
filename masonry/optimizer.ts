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
    for (let i = 0; i < wall.totalBricks; i++) {
      const brick = wall.getBrick(i);
      const key = brick.stridePos.join(",");
      if (!strideMap.has(key)) {
        strideMap.set(key, []);
      }
      strideMap.get(key)!.push(i);
    }

    const keys = [...strideMap.keys()].map(
      (k) => k.split(",").map(Number) as [number, number]
    );
    const heuristic = (
      [sx, sz]: [number, number],
      [tx, tz]: [number, number]
    ) =>
      this.sideWaysCost * Math.abs(sx - tx) +
      this.upDownCost * Math.abs(sz - tz);

    const visited = new Set<string>();
    const order: number[] = [];
    let currentPos: [number, number] = [0, 0]; // start pose

    while (visited.size < keys.length) {
      let bestKey: [number, number] | undefined,
        bestCost = Infinity;
      for (const key of keys) {
        const keyStr = key.join(",");
        if (visited.has(keyStr)) continue;
        const cost = heuristic(currentPos, key);

        if (cost < bestCost) {
          bestCost = cost;
          bestKey = key;
        }
      }

      if (!bestKey) break; // safety check
      const bestKeyStr = bestKey.join(",");
      visited.add(bestKeyStr);
      currentPos = bestKey;
      order.push(...strideMap.get(bestKeyStr)!);
    }

    return order;
  }
}
