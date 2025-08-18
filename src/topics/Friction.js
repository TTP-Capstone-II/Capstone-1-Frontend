import * as formulas from "../../utils/formulas";

export function Friction({ gravity, mass, friction, angle, target, time, distance }) {
    gravity = parseFloat(gravity);
    mass = parseFloat(mass);
    angle = parseFloat(angle);
    friction = parseFloat(friction);
    time = parseFloat(time);
    distance = parseFloat(distance);


    const normalForce = formulas.calculateNormalForce({ mass, angle, gravity });
    const frictionForce = formulas.calculateFrictionForce({
        normalForce,
        frictionCoefficient: friction,
    });
    const parallelForce = formulas.calculateParallelForce({ mass, angle, gravity });
    const netForce = formulas.calculateNetForce({ parallelForce, frictionForce });
    const acceleration = formulas.calculateAcceleration(netForce, mass);
    const calculateDistance =
        time && !isNaN(time)
            ? formulas.calculateDistance(acceleration, time)
            : null;
    const calculateTime =
        distance && !isNaN(distance)
            ? formulas.calculateTime(acceleration, distance)
            : null;

    const results = {
        normalForce,
        frictionForce,
        parallelForce,
        netForce,
        acceleration,
        distance: calculateDistance,
        time: calculateTime,
    };

    switch ((target || "").toLowerCase()) {
        case "normalforce":
            return { normalForce };
        case "frictionforce":
            return { frictionForce };
        case "parallelforce":
            return { parallelForce };
        case "netforce":
            return { netForce };
        case "acceleration":
            return { acceleration };
        case "distance":
            return { distance: calculateDistance };
        case "time":
            return { time: calculateTime };
        case "all":
            return results;
        default:
            return null;
    }
}
