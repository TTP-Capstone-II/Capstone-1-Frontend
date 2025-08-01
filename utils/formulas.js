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

//freefall
// Final velocity: v = u + a*t
export function getFinalVelocityNoY({ initialVelocity: u, time: t, gravity: a }) {
  return u + a * t;
}

// Final velocity without time: v² = u² + 2as
export function getFinalVelocityNoTime({
  initialVelocity: u,
  finalHeight: y,
  initialHeight: y0,
  gravity: a,
}) {
  return Math.sqrt(Math.abs(u ** 2 + 2 * a * (y - y0)));
}

// Initial velocity from displacement: u = (s - 0.5*a*t²) / t
export function getinitialVelocityNoFV({
  finalHeight: y,
  initialHeight: y0,
  time: t,
  gravity: a,
}) {
  return (y - y0 - 0.5 * a * t ** 2) / t;
}

// Initial velocity from final velocity: u = v - a*t
export function getinitialVelocityNoY({ finalVelocity: v, time: t, gravity: a }) {
  return v - a * t;
}

// Initial velocity from no time: u² = v² - 2as
export function getinitialVelocityNoTime({
  finalVelocity: v,
  finalHeight: y,
  initialHeight: y0,
  gravity: a,
}) {
  return Math.sqrt(Math.abs(v ** 2 - 2 * a * (y - y0)));
}

// Gravity without final velocity: a = (s - u*t) / 0.5*t²
export function getGravityNoFV({
  initialVelocity: u,
  finalHeight: y,
  initialHeight: y0,
  time: t,
}) {
  return (y - y0 - u * t) / (0.5 * t ** 2);
}

// Gravity from change in velocity: a = (v - u) / t
export function getGravityNoY({ finalVelocity: v, initialVelocity: u, time: t }) {
  return (v - u) / t;
}

// Gravity from no time: a = (v² - u²) / 2s
export function getGravityNoTime({
  finalVelocity: v,
  initialVelocity: u,
  finalHeight: y,
  initialHeight: y0,
}) {
  return (v ** 2 - u ** 2) / (2 * (y - y0));
}

// Time from velocities: t = (v - u) / a
export function getTimeNoY({ finalVelocity: v, initialVelocity: u, gravity: a }) {
  return (v - u) / a;
}

// Time from displacement: solve y = u*t + 0.5*a*t²
export function getTimeNoFV({
  initialVelocity: u,
  finalHeight: y,
  initialHeight: y0,
  gravity: a,
}) {
  const discriminant = u ** 2 - 2 * a * (y0 - y);
  let time = 0;
  if (discriminant < 0) return [];
  const sqrtD = Math.sqrt(discriminant);
  let timeArray = [(-u + sqrtD) / a, (-u - sqrtD) / a];
  if (timeArray[0] > 0) time = timeArray[0];
  if (timeArray[1] > 0) time = timeArray[1];
  return time;
}

// Final position without time: y = ((v² - u²) / 2a) + y0
export function getfinalHeightNoTime({
  finalVelocity: v,
  initialVelocity: u,
  initialHeight: y0,
  gravity: a,
}) {
  return (v ** 2 - u ** 2) / (2 * a) + y0;
}

// Final position with velocity, time: y = y0 + u*t + 0.5*a*t²
export function getfinalHeightNoFV({
  initialHeight: y0,
  initialVelocity: u,
  gravity: a,
  time: t,
}) {
  return y0 + u * t + 0.5 * a * t ** 2;
}

// Start position from final position and velocities: y0 = y - (v² - u²)/2a
export function getinitialHeightNoTime({
  finalVelocity: v,
  initialVelocity: u,
  finalHeight: y,
  gravity: a,
}) {
  return y - (v ** 2 - u ** 2) / (2 * a);
}

// Start position with velocity, time: y0 = y - u*t - 0.5*a*t²
export function getinitialHeightNoFV({ finalHeight: y, initialVelocity: u, gravity: a, time: t }) {
  return y - u * t - 0.5 * a * t ** 2;
}

//porjectile motion
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

export function calcRange({
  velocity,
  angle,
  gravity = 9.81,
  initialHeight = 0,
}) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  const vx = velocity * Math.cos(thetaRad);
  const time = calcTimeOfFlight({ velocity, angle, gravity, initialHeight });
  return vx * time;
}

//Time of flight: t = [v * sinθ + √( (v * sinθ)² + 2 * g * y₀ )] / g
export function calcTimeOfFlight({
  velocity,
  angle,
  gravity = 9.81,
  initialHeight = 0,
}) {
  if (!velocity || !angle) return null;
  const thetaRad = toRadians(angle);
  const vy = velocity * Math.sin(thetaRad);

  // Quadratic equation solution for time when y = 0
  return (vy + Math.sqrt(vy * vy + 2 * gravity * initialHeight)) / gravity;
}

//Maximum height: H = y₀ + (v² * sin²θ) / (2g)
export function calcMaxHeight({
  velocity,
  angle,
  gravity = 9.81,
  initialHeight = 0,
}) {
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
    vy: velocity * Math.sin(thetaRad),
  };
}
