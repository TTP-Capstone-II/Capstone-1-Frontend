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