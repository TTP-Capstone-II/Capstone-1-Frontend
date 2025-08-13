import * as formulas from "../../utils/formulas";

export function Inertia({
  square1_mass,
  square1_initialAcceleration,
  square1_initialPosition,
  square2_mass,
  square2_initialAcceleration,
  square2_initialPosition,
  time,
  target
}) {
  const m1 = Number(square1_mass);
  const m2 = Number(square2_mass);
  const v1 = Number(square1_initialAcceleration); // treating as initial velocity input
  const v2 = Number(square2_initialAcceleration);
  const x1 = Number(square1_initialPosition);
  const x2 = Number(square2_initialPosition);
  const t = Number(time) || 0;

  const finalVels = formulas.calcFinalVelocitiesElastic({ m1, v1, m2, v2 });
  const momentum1 = formulas.calcMomentum({ m: m1, v: v1 });
  const momentum2 = formulas.calcMomentum({ m: m2, v: v2 });
  const ke1 = formulas.calcKineticEnergy({ m: m1, v: v1 });
  const ke2 = formulas.calcKineticEnergy({ m: m2, v: v2 });
  const collisionTime = formulas.calcTimeToCollision({ x1, v1, x2, v2 });
  const pos1AfterT = formulas.calcPosition({ x0: x1, v: v1, t });
  const pos2AfterT = formulas.calcPosition({ x0: x2, v: v2, t });

  const results = {
    finalVelocities: finalVels,
    momentum: { square1: momentum1, square2: momentum2 },
    kineticEnergy: { square1: ke1, square2: ke2 },
    timeToCollision: collisionTime,
    positionAfterT: { square1: pos1AfterT, square2: pos2AfterT }
  };

  switch (target) {
    case "finalVelocity":
      return finalVels;
    case "momentum":
      return { square1: momentum1, square2: momentum2 };
    case "kineticEnergy":
      return { square1: ke1, square2: ke2 };
    case "time":
      return collisionTime;
    case "positionAfterT":
      return { square1: pos1AfterT, square2: pos2AfterT };
    case "All":
      return results;
    default:
      return null;
  }
}
