//Formulas 

//Kinematic equations

/*
 Where:
  - u = initial velocity
  - v = final velocity
  - a = acceleration
  - t = time
  - y0 = initial position
  - y = final position
  - s = displacement
  */

  //final velocity
  export function calcFinalVelocity(u, a, t) {
    return u + a * t;
  }
  
  //final position
  export function calcFinalPosition(y0, u, t, a) {
    return y0 + u * t + 0.5 * a * t * t;
  }

  //final velocity squared
  export function calcFinalVelocitySquared(u, a, y0, y) {
    return u * u + 2 * a * (y - y0);
  }


  //  Projectile motion formulas
  //----------------------------------
  
  const degreesToRad = Math.PI / 180;


// Converts degrees to radians
export function toRadians(degrees) {
  return degrees * degreesToRad;
}

// Horizontal range: v * cosθ * t

export function calcRange({ velocity, angle, gravity = 9.81, initialHeight = 0 }) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  const vx = velocity * Math.cos(thetaRad);
  const time = calcTimeOfFlight({ velocity, angle, gravity, initialHeight });
  return vx * time;
}

//Time of flight: t = [v * sinθ + √( (v * sinθ)² + 2 * g * y₀ )] / g
export function calcTimeOfFlight({ velocity, angle, gravity = 9.81, initialHeight = 0 }) {
    if (!velocity || !angle) return null;
    const thetaRad = toRadians(angle);
    const vy = velocity * Math.sin(thetaRad);
    
    // Quadratic equation solution for time when y = 0
    return (vy + Math.sqrt(vy*vy + 2 * gravity * initialHeight)) / gravity;
  }


 //Maximum height: H = y₀ + (v² * sin²θ) / (2g)
export function calcMaxHeight({ velocity, angle, gravity = 9.81, initialHeight = 0 }) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  const vy = velocity * Math.sin(thetaRad);
  return initialHeight + (vy * vy) / (2 * gravity);
}


 //Velocity components: vx = v * cos(θ), vy = v * sin(θ)
export function calcVelocityComponents({ velocity, angle }) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  return {
    vx: velocity * Math.cos(thetaRad),
    vy: velocity * Math.sin(thetaRad)
  };
}

// Torque
//----------------------------------
export function calcTorque({radius, force, angle = 90, inertia, angularAcceleration}) {

  if (radius !== undefined && force !== undefined) {
    const thetaRad = toRadians(angle);

    // τ = r * F * sin(θ)
     const torque = radius * force * Math.sin(thetaRad);
     return torque;
  }

   // τ = I * α
  else if (inertia !== undefined && angularAcceleration !== undefined) {
    return inertia * angularAcceleration;
  }

  else {
    console.log("Invalid parameters for Torque");
  }
}
