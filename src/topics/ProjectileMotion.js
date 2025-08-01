import { calcRange, calcTimeOfFlight, calcVelocityComponents, calcMaxHeight } from "../../utils/formulas";

export function ProjectileMotion ({ gravity, intialVelocity, launchAngle, initialHeight,target }) {
    const gravityVal = Number(gravity) || 9.81;
    const velocity = Number(intialVelocity) || 0;
    const angle = Number(launchAngle) || 0;
    const initialHeightVal = Number(initialHeight) || 0;

    // calculate all 
    const results = {
        ...calcVelocityComponents({ velocity, angle }),
        timeOfFlight: calcTimeOfFlight({
          velocity,
          angle,
          gravity: gravityVal,
          initialHeight: initialHeightVal
        }),
        range: calcRange({
          velocity,
          angle,
          gravity: gravityVal,
          initialHeight: initialHeightVal
        }),
        maxHeight: calcMaxHeight({
          velocity,
          angle,
          gravity: gravityVal,
          initialHeight: initialHeightVal
        })
      };

      // Return only what the user asked for
  switch (target) {
    case "velocityComponents":
      return { vx: results.vx, vy: results.vy };
    case "timeOfFlight":
      return results.timeOfFlight;
    case "range":
      return results.range;
    case "maxHeight":
      return results.maxHeight;
    case "All":
      return results;
    default:
      return null;
  }

};