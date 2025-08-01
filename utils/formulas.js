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
  function calcFinalVelocity(u, a, t) {
    return u + a * t;
  }
  
  //final position
  function calcFinalPosition(y0, u, t, a) {
    return y0 + u * t + 0.5 * a * t * t;
  }

  //final velocity squared
  function calcFinalVelocitySquared(u, a, y0, y) {
    return u * u + 2 * a * (y - y0);
  }


  //  Projectile motion formulas
  //----------------------------------
  
  const degreesToRad = Math.PI / 180;


// Converts degrees to radians
export function toRadians(degrees) {
  return degrees * degreesToRad;
}

// Horizontal range: R = (v^2 * sin(2θ)) / g

export function calcRange({ velocity, angle, gravity = 9.81 }) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  return (Math.pow(velocity, 2) * Math.sin(2 * thetaRad)) / gravity;
}

//Time of flight: t = (2 * v * sin(θ)) / g
export function calcTimeOfFlight({ velocity, angle, gravity = 9.81 }) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  return (2 * velocity * Math.sin(thetaRad)) / gravity;
}


 //Maximum height: H = (v^2 * sin^2(θ)) / (2 * g)
export function calcMaxHeight({ velocity, angle, gravity = 9.81 }) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  return (Math.pow(velocity * Math.sin(thetaRad), 2)) / (2 * gravity);
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