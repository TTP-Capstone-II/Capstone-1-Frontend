import { calcTorque, calcAngularAcceleration, calcDistanceFromPivot, calcAngle, calcForce } from "../../utils/formulas";

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
    return calcAngle({torque, force, distanceFromPivot});
  case "force":
    return calcForce({torque, distanceFromPivot, angle})
  case "All":
    return {
      torque: calcTorque({ distanceFromPivot, force, angle, inertia, angularAcceleration }),
      angularAcceleration: calcAngularAcceleration({ distanceFromPivot, force, angle, inertia, torque }),
      distanceFromPivot: calcDistanceFromPivot({ torque, force, angle }),
      angle: calcAngle({torque, force, distanceFromPivot}),
      force: calcForce({torque, distanceFromPivot, angle})
    };
  default:
    return null;
}

};