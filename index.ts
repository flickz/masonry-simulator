import { program } from "commander";
import { input, select } from "@inquirer/prompts";

import { Wall } from "./masonry/wall";
import { AsciiRenderer } from "./masonry/visual";
import type { WallConfig, Bond, LayeringOrder } from "./types";
import { validateWallBound, validateLayeringOrder } from "./util";
import { DEFAULT_WALL_WIDTH, DEFAULT_WALL_HEIGHT } from "./config";
import { StrideOptimizer } from "./masonry/optimizer";

/**
 * Interactive mode
 *
 * pnpm run simulator --interactive
 *
 * Non-interactive mode
 *
 * pnpm run simulator --interactive --wall-bound=stretcher --order=regular
 */
async function collectInteractiveInput(): Promise<WallConfig> {
  console.log("Welcome to the Masonry Simulator!\n");

  // Collect wall dimensions
  const dimensionsInput = await input({
    message: "Enter the wall dimensions (width,height in mm):",
    default: `${DEFAULT_WALL_WIDTH},${DEFAULT_WALL_HEIGHT}`,
    validate: (value) => {
      const parts = value.split(",");
      if (parts.length !== 2) {
        return "Please enter dimensions in format: width,height (e.g., 1200,2400)";
      }
      const width = parseInt(parts[0]);
      const height = parseInt(parts[1]);
      if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        return "Please enter valid positive numbers for width and height";
      }
      return true;
    },
  });

  const [width, height] = dimensionsInput.split(",").map(Number);

  // Collect wall bond selection
  const wallBound: Bond = await select({
    message: "Select a wall bond:",
    choices: [
      { name: "Stretcher bond", value: "stretcher" },
      { name: "English bond", value: "english" },
    ],
  });

  // Collect layering order selection
  const layeringOrder: LayeringOrder = await select({
    message: "Select a layering order:",
    choices: [
      { name: "Regular", value: "regular" },
      { name: "Per stride optimization", value: "per-stride" },
    ],
  });

  return {
    width,
    height,
    wallBound,
    layeringOrder,
  };
}

program.description("Simulate the wall construction process");
program.option("-i, --interactive", "Interactive mode");
program.option("-w, --wall-bound <bound>", "Wall bound (stretcher or english)");
program.option("-o, --order <order>", "Layering order (regular or per-stride)");

program.parse(process.argv);

const options = program.opts();

async function main() {
  let config: WallConfig;

  if (options.interactive || (!options.wallBound && !options.order)) {
    // Interactive mode or no flags provided
    config = await collectInteractiveInput();
  } else {
    // Non-interactive mode with flags
    try {
      config = {
        width: DEFAULT_WALL_WIDTH,
        height: DEFAULT_WALL_HEIGHT,
        wallBound: validateWallBound(options.wallBound),
        layeringOrder: validateLayeringOrder(options.order),
      };
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Invalid options");
      process.exit(1);
    }
  }

  console.log("\nConfiguration:");
  console.log(`Wall dimensions: ${config.width}mm x ${config.height}mm`);
  console.log(`Wall bond: ${config.wallBound}`);
  console.log(`Layering order: ${config.layeringOrder} \n`);

  await simulateWall(config);
}

async function simulateWall(config: WallConfig) {
  const wall = new Wall(config.width, config.height, config.wallBound);
  const renderer = new AsciiRenderer(wall);
  let order: number[] | null = null;

  if (config.layeringOrder === "per-stride") {
    order = new StrideOptimizer().optimizeOrder(wall);
  }

  // Render initial wall grid
  renderer.renderWallGrid();

  let cursor = 0;
  while (!wall.isWallComplete()) {
    await input({ message: "Press ENTER to place next brick" });
    const nextBrickIndex = order ? order[cursor++] : cursor++;
    wall.placeNextBrick(nextBrickIndex);
    console.clear();
    renderer.renderWallGrid(config.layeringOrder);
  }

  console.log("🎉 Wall complete!");
}

main().catch(console.error);
