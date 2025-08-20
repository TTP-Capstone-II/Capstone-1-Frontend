import { calcTorque, calcAngularAcceleration, calcDistanceFromPivot, calcAngle, calcForce } from "../../utils/formulas";

export function Torque({
  torque = 0,
  angularAcceleration = 0,
  distanceFromPivot = 0,
  angle = 0,
  inertia = 0,
  force = 0,
  target = "All"
}) {
  // Safely parse inputs
  const tau = Number(torque) || 0;
  const alpha = Number(angularAcceleration) || 0;
  const r = Number(distanceFromPivot) || 0;
  const theta = Number(angle) || 0;
  const I = Number(inertia) || 0;
  const F = Number(force) || 0;

  switch (target) {
    case "torque":
      return { torque: calcTorque({ distanceFromPivot: r, force: F, angle: theta, inertia: I, angularAcceleration: alpha }) };
    case "angularAcceleration":
      return { angularAcceleration: calcAngularAcceleration({ distanceFromPivot: r, force: F, angle: theta, inertia: I, torque: tau }) };
    case "distanceFromPivot":
      return { distanceFromPivot: calcDistanceFromPivot({ torque: tau, force: F, angle: theta }) };
    case "angle":
      return { angle: calcAngle({ torque: tau, force: F, distanceFromPivot: r }) };
    case "force":
      return { force: calcForce({ torque: tau, distanceFromPivot: r, angle: theta }) };
    case "All":
      return {
        torque: calcTorque({ distanceFromPivot: r, force: F, angle: theta, inertia: I, angularAcceleration: alpha }),
        angularAcceleration: calcAngularAcceleration({ distanceFromPivot: r, force: F, angle: theta, inertia: I, torque: tau }),
        distanceFromPivot: calcDistanceFromPivot({ torque: tau, force: F, angle: theta }),
        angle: calcAngle({ torque: tau, force: F, distanceFromPivot: r }),
        force: calcForce({ torque: tau, distanceFromPivot: r, angle: theta }),
      };
    default:
      return {};
  }
}