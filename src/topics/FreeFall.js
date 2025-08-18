import * as formulas from "../../utils/formulas";

export function FreeFallMotion({
  gravity,
  initialVelocity,
  time,
  initialHeight,
  finalVelocity,
  finalHeight,
  target,
}) {
  const g = gravity !== undefined ? Number(gravity) : 9.81;
  const u = initialVelocity !== undefined ? Number(initialVelocity) : undefined;
  const t = time !== undefined ? Number(time) : undefined;
  const y0 = initialHeight !== undefined ? Number(initialHeight) : undefined;
  const v = finalVelocity !== undefined ? Number(finalVelocity) : undefined;
  const y =
    finalHeight !== undefined && finalHeight !== "" ? Number(finalHeight) : 0; // default to ground

  const results = {};

  if (u !== undefined && t !== undefined && g !== undefined) {
    results.finalVelocity = formulas.getFinalVelocityNoY({
      initialVelocity: u,
      time: t,
      gravity: g,
    });
  } else if (
    u !== undefined &&
    y !== undefined &&
    g !== undefined &&
    y0 !== undefined
  ) {
    results.finalVelocity = formulas.getFinalVelocityNoTime({
      initialVelocity: u,
      finalHeight: y,
      gravity: g,
      initialHeight: y0,
    });
  }

  if (
    y !== undefined &&
    y0 !== undefined &&
    g !== undefined &&
    t !== undefined
  ) {
    results.initialVelocity = formulas.getinitialVelocityNoFV({
      finalHeight: y,
      initialHeight: y0,
      time: t,
      gravity: g,
    });
  } else if (v !== undefined && t !== undefined && g !== undefined) {
    results.initialVelocity = formulas.getinitialVelocityNoY({
      finalVelocity: v,
      time: t,
      gravity: g,
    });
  } else if (
    y !== undefined &&
    y0 !== undefined &&
    g !== undefined &&
    v !== undefined
  ) {
    results.initialVelocity = formulas.getinitialVelocityNoTime({
      finalHeight: y,
      initialHeight: y0,
      finalVelocity: v,
      gravity: g,
    });
  }

  if (
    y !== undefined &&
    u !== undefined &&
    y0 !== undefined &&
    t !== undefined
  ) {
    results.gravity = formulas.getGravityNoFV({
      initialVelocity: u,
      finalHeight: y,
      initialHeight: y0,
      time: t,
    });
  } else if (v !== undefined && u !== undefined && t !== undefined) {
    results.gravity = formulas.getGravityNoY({
      initialVelocity: u,
      finalVelocity: v,
      time: t,
    });
  } else if (
    y !== undefined &&
    u !== undefined &&
    y0 !== undefined &&
    v !== undefined
  ) {
    results.gravity = formulas.getGravityNoTime({
      finalVelocity: v,
      initialVelocity: u,
      finalHeight: y,
      initialHeight: y0,
    });
  }

  if (v !== undefined && u !== undefined && g !== undefined) {
    results.time = formulas.getTimeNoY({
      finalVelocity: v,
      initialVelocity: u,
      gravity: g,
    });
  } else if (
    u !== undefined &&
    y !== undefined &&
    y0 !== undefined &&
    g !== undefined
  ) {
    results.time = formulas.getTimeNoFV({
      initialVelocity: u,
      finalHeight: y,
      initialHeight: y0,
      gravity: g,
    });
  }

  if (
    u !== undefined &&
    t !== undefined &&
    g !== undefined &&
    y0 !== undefined
  ) {
    results.finalHeight = formulas.getfinalHeightNoFV({
      initialHeight: y0,
      initialVelocity: u,
      gravity: g,
      time: t,
    });
  } else if (
    v !== undefined &&
    u !== undefined &&
    y0 !== undefined &&
    g !== undefined
  ) {
    results.finalHeightNoTime = formulas.getfinalHeightNoTime({
      finalVelocity: v,
      initialVelocity: u,
      initialHeight: y0,
      gravity: g,
    });
  }

  if (
    t !== undefined &&
    u !== undefined &&
    y !== undefined &&
    g !== undefined
  ) {
    results.initialHeight = formulas.getinitialHeightNoFV({
      finalHeight: y,
      initialVelocity: u,
      gravity: g,
      time: t,
    });
  } else if (
    v !== undefined &&
    u !== undefined &&
    y !== undefined &&
    g !== undefined
  ) {
    results.initialHeight = formulas.getinitialHeightNoTime({
      finalVelocity: v,
      initialVelocity: u,
      finalHeight: y,
      gravity: g,
    });
  }

  if (target && target !== "All") {
    return results[target] !== undefined ? results[target] : null;
  }

  return results;
}
