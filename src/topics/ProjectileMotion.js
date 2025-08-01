import { calcRange, calcTimeOfFlight, calcVelocityComponents, calcMaxHeight } from "../../utils/formulas";

export function ProjectileMotion ({ gravity, intialVelocity, launchAngle, initialHeight }) {
    const gravityVal = Number(gravity) || 9.81;
    const velocity = Number(intialVelocity) || 0;
    const angle = Number(launchAngle) || 0;
    const initialHeightVal = Number(initialHeight) || 0;

    const { vx, vy } = calcVelocityComponents({ velocity, angle });
    const range = calcRange({ velocity, angle, gravity: gravityVal });
    const timeOfFlight = calcTimeOfFlight({ velocity, angle, gravity: gravityVal });
    const maxHeight = calcMaxHeight({ velocity, angle, gravity: gravityVal });

    
};