import { calcTorque, calcAngularAcceleration, calcDistanceFromPivot } from "../../utils/formulas";

export function Torque ({
  torque = 0,
  angularAcceleration = 0,
  distanceFromPivot = 0,
  angle = 0,
  inertia = 0,
  force = 0,
  target = "All"
}) {
    
switch (target) {
  case "torque":
    return calcTorque({ distanceFromPivot, force, angle, inertia, angularAcceleration });
  case "angularAcceleration":
    return calcAngularAcceleration({ distanceFromPivot, force, angle, inertia, torque });
  case "distanceFromPivot":
    return calcDistanceFromPivot({ torque, force, angle });
  case "angle":
    return angle;
  case "force":
    return force;
  case "All":
    return {
      torque: calcTorque({ distanceFromPivot, force, angle, inertia, angularAcceleration }),
      angularAcceleration: calcAngularAcceleration({ distanceFromPivot, force, angle, inertia, torque }),
      distanceFromPivot: calcDistanceFromPivot({ torque, force, angle }),
      angle,
      force,
    };
  default:
    return null;
}

};