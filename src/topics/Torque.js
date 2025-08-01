import { calcTorque } from "../../utils/formulas";

export function Torque ({ torque, angularAcceleration, distanceFromPivot, angle, inertia, force, target}) {

    // calculate all 
    const torqueValue = calcTorque({ distanceFromPivot, force, angle, inertia, angularAcceleration });
    const results = {
        torque: torqueValue
      };

      // Return only what the user asked for
  switch (target) {
    case "torque":
      return results.torque;
    case "angularAcceleration":
      return results.torque;
    case "distanceFromPivot":
      return results.torque;
    case "angle":
      return results.torque;
    case "force":
        return results.torque;
    case "All":
      return results;
    default:
      return null;
  }

};