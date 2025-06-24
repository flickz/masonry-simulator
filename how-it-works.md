# How it works

This documentation explains my thought process behind the code.

## Wall

A **Wall** is a 2D layout composed of bricks arranged in rows and columns. It is defined by physical dimensions: `wallWidth` and `wallHeight`.

- **Courses** (rows): These are computed as `wallHeight / courseHeight`, where `courseHeight` is the sum of the brick height and the bed joint thickness.
- **Units** (columns): These are calculated as `wallWidth / halfBrickUnit`, where `halfBrickUnit` is `(fullBrick + headJoint) / 2`. Each unit represents the width of half a full brick including the mortar joint.

## Brick

Each **Brick** has a type based on how it is used in a bond pattern, and each type spans a fixed number of grid units:

```
{
  full: 2,   // spans 2 units (≈ 220mm)
  half: 1,   // spans 1 unit (≈ 110mm)
  head: 1,   // header laid end-on, spans 1 unit
  queen: 0.5 // queen closer, spans 0.5 unit (≈ 55mm)
}
```

- A **full** brick spans two columns.
- A **half** brick spans one column.
- A **head** is a header brick (seen on the face as a 100mm wide end).
- A **queen** spans half a unit (¼-brick).

Bricks are placed with `(column, course)` coordinates and carry metadata including their span and their stride position.

## Bond

A **Bond** defines the brick pattern strategy for constructing a wall. Each bond provides a method to fill a single course of bricks.

- **Stretcher Bond** – All stretchers in every even course; odd courses start and finish with a half-brick so head joints stagger.
- **English Bond** – Alternating courses of stretchers and headers. Even courses: stretchers only. Odd courses: `H Q … Q H` — header, queen closer, run of headers, queen closer, header.

Each bond implements a `fillCourse` function that populates a given course using the appropriate brick pattern. This design allows easy extensibility for new bond types like Flemish, stack, or wild bonds.

## Optimizer

The robot can lay bricks within a **stride envelope** (e.g. 800 mm × 1300 mm) without moving its base or lift.
Steps:

1. **Stride tagging** – every brick pre-computes its stride coordinates `(sx, sz)` once.
2. **Bucketing** – bricks are grouped by stride key in a `Map`.
3. **Greedy A\*** – starting at (0,0) choose the unvisited stride that minimises the cost function.

```
cost = sideWaysCost · |sx − tx|  +  upDownCost · |sz − tz|
```

- `sx, sz`: current stride coordinates
- `tx, tz`: target stride coordinates
- `sideWaysCost`: cost of lateral movement
- `upDownCost`: cost of vertical movement

I assume `upDownCost > sideWaysCost` because horizontal shuffles are quicker and allow visual inspection of freshly laid bricks. This heuristic enables the robot to select the next best stride to build, reducing overall movement and build time.

## Visualizer

The **Visualizer** renders the wall layout using ASCII characters:

- `░` represents **design bricks** (yet to be placed)
- `█` represents **built bricks**

Each unit cell is visualized with a width of 5 characters for clarity. The visualizer assigns a **distinct color** to each stride using its `(strideX, strideZ)` position, allowing you to visually distinguish which bricks are built in each robot stride.
