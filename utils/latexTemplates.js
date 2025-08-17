import React from "react";
import { MathJax } from "better-react-mathjax";

// Generic formula template system with improved value substitution
export const createFormulaTemplate = (template, values, result) => {
  const roundedValues = {};
  
  // Process all values, handling both numbers and objects
  Object.keys(values).forEach((key) => {
    const val = values[key];
    if (typeof val === "number") {
      roundedValues[key] = Number(val.toFixed(3));
    } else if (typeof val === "object" && val !== null) {
      // Handle objects like velocity components
      roundedValues[key] = val;
    } else {
      roundedValues[key] = val;
    }
  });

  let formula = template;

  // Replace placeholders with actual values
  Object.keys(roundedValues).forEach((key) => {
    const value = roundedValues[key];
    const regex = new RegExp(`\\{${key}\\}`, "g");
    
    if (typeof value === "number") {
      formula = formula.replace(regex, value.toString());
    } else if (typeof value === "object" && value !== null) {
      // Skip object replacements in main formula - handle separately
      return;
    } else {
      formula = formula.replace(regex, value);
    }
  });

  return {
    formula,
    result: typeof result === "number" ? Number(result.toFixed(3)) : result,
    values: roundedValues
  };
};

// FREE FALL FORMULA TEMPLATES - Fixed parameter mapping
export const FREE_FALL_FORMULAS = {
    // v = u + at
    getFinalVelocityNoY: {
      template: "v_f = {initialVelocity} + ({gravity}) \\cdot {time}",
      description: "Final Velocity (without displacement)",
      baseFormula: "v = u + at"
    },
    
    // v² = u² + 2as  
    getFinalVelocityNoTime: {
      template: "v_f = \\sqrt{{initialVelocity}^2 + 2 \\cdot ({gravity}) \\cdot ({finalHeight} - {initialHeight})}",
      description: "Final Velocity (without time)",
      baseFormula: "v² = u² + 2as"
    },
    
    // u = (s - ½at²)/t
    getinitialVelocityNoFV: {
      template: "u = \\frac{({finalHeight} - {initialHeight}) - \\frac{1}{2} \\cdot ({gravity}) \\cdot {time}^2}{{time}}",
      description: "Initial Velocity (from displacement)",
      baseFormula: "u = (s - ½at²)/t"
    },
    
    // u = v - at
    getinitialVelocityNoY: {
      template: "u = {finalVelocity} - ({gravity}) \\cdot {time}",
      description: "Initial Velocity (from final velocity)",
      baseFormula: "u = v - at"
    },
    
    // u² = v² - 2as
    getinitialVelocityNoTime: {
      template: "u = \\sqrt{{finalVelocity}^2 - 2 \\cdot ({gravity}) \\cdot ({finalHeight} - {initialHeight})}",
      description: "Initial Velocity (without time)",
      baseFormula: "u² = v² - 2as"
    },
    
    // a = (s - ut)/(½t²)
    getGravityNoFV: {
      template: "a = \\frac{({finalHeight} - {initialHeight}) - {initialVelocity} \\cdot {time}}{\\frac{1}{2} \\cdot {time}^2}",
      description: "Acceleration (without final velocity)",
      baseFormula: "a = (s - ut)/(½t²)"
    },
    
    // a = (v - u)/t
    getGravityNoY: {
      template: "a = \\frac{{finalVelocity} - {initialVelocity}}{{time}}",
      description: "Acceleration (from velocity change)",
      baseFormula: "a = (v - u)/t"
    },
    
    // a = (v² - u²)/(2s)
    getGravityNoTime: {
      template: "a = \\frac{{finalVelocity}^2 - {initialVelocity}^2}{2 \\cdot ({finalHeight} - {initialHeight})}",
      description: "Acceleration (without time)",
      baseFormula: "a = (v² - u²)/(2s)"
    },
    
    // t = (v - u)/a
    getTimeNoY: {
      template: "t = \\frac{{finalVelocity} - {initialVelocity}}{{gravity}}",
      description: "Time (from velocities)",
      baseFormula: "t = (v - u)/a"
    },
    
    // Quadratic solution for time
    getTimeNoFV: {
      template: "t = \\frac{-{initialVelocity} + \\sqrt{{initialVelocity}^2 - 2 \\cdot ({gravity}) \\cdot ({initialHeight} - {finalHeight})}}{{gravity}}",
      description: "Time (from displacement - quadratic solution)",
      baseFormula: "s = ut + ½at² → solve for t"
    },
    
    // y = y₀ + (v² - u²)/(2a)
    getfinalHeightNoTime: {
      template: "y_f = {initialHeight} + \\frac{{finalVelocity}^2 - {initialVelocity}^2}{2 \\cdot ({gravity})}",
      description: "Final Position (without time)",
      baseFormula: "y = y₀ + (v² - u²)/(2a)"
    },
    
    // y = y₀ + ut + ½at²
    getfinalHeightNoFV: {
      template: "y_f = {initialHeight} + {initialVelocity} \\cdot {time} + \\frac{1}{2} \\cdot ({gravity}) \\cdot {time}^2",
      description: "Final Position (with time)",
      baseFormula: "y = y₀ + ut + ½at²"
    },
    
    // y₀ = y - (v² - u²)/(2a)
    getinitialHeightNoTime: {
      template: "y_0 = {finalHeight} - \\frac{{finalVelocity}^2 - {initialVelocity}^2}{2 \\cdot ({gravity})}",
      description: "Initial Position (without time)",
      baseFormula: "y₀ = y - (v² - u²)/(2a)"
    },
    
    // y₀ = y - ut - ½at²
    getinitialHeightNoFV: {
      template: "y_0 = {finalHeight} - {initialVelocity} \\cdot {time} - \\frac{1}{2} \\cdot ({gravity}) \\cdot {time}^2",
      description: "Initial Position (with time)",
      baseFormula: "y₀ = y - ut - ½at²"
    }
  };

// PROJECTILE MOTION FORMULA TEMPLATES - Improved
export const PROJECTILE_MOTION_FORMULAS = {
    calcRange: {
      template: "R = \\frac{{velocity} \\cos({angle}°) \\left[ {velocity} \\sin({angle}°) + \\sqrt{({velocity} \\sin({angle}°))^2 + 2 \\cdot {gravity} \\cdot {initialHeight}} \\right]}{{gravity}}",
      description: "Horizontal Range",
      baseFormula: "R = (v²sin(2θ))/g + (vₓ√(vᵧ² + 2gy₀))/g"
    },
    
    calcTimeOfFlight: {
      template: "t = \\frac{{velocity} \\sin({angle}°) + \\sqrt{({velocity} \\sin({angle}°))^2 + 2 \\times {gravity} \\times {initialHeight}}}{{gravity}}",
      description: "Time of Flight",
      baseFormula: "t = (v sin θ + √((v sin θ)² + 2gy₀))/g"
    },
    
    calcMaxHeight: {
      template: "H = {initialHeight} + \\frac{({velocity} \\sin({angle}°))^2}{2 \\times {gravity}}",
      description: "Maximum Height",
      baseFormula: "H = y₀ + (v sin θ)²/(2g)"
    },
    
    calcVelocityComponents: {
      template: "v_x = {velocity} \\cos({angle}°), \\quad v_y = {velocity} \\sin({angle}°)",
      description: "Velocity Components",
      baseFormula: "vₓ = v cos θ, vᵧ = v sin θ"
    }
  };

// FRICTION FORMULA TEMPLATES - Fixed
export const FRICTION_FORMULAS = {
  calculateNormalForce: {
    template: "N = {mass} \\times {gravity} \\times \\cos({angle}°)",
    description: "Normal Force",
    baseFormula: "N = mg cos θ"
  },
  
  calculateFrictionForce: {
    template: "F_f = \\mu \\times N = {frictionCoefficient} \\times {normalForce}",
    description: "Friction Force", 
    baseFormula: "f = μN"
  },
  
  calculateParallelForce: {
    template: "F_{\\parallel} = {mass} \\times {gravity} \\times \\sin({angle}°)",
    description: "Parallel Force",
    baseFormula: "F‖ = mg sin θ"
  },
  
  calculateNetForce: {
    template: "F_{net} = F_{\\parallel} - F_f = {parallelForce} - {frictionForce}",
    description: "Net Force",
    baseFormula: "Fₙₑₜ = F‖ - f"
  },
  
  calculateAcceleration: {
    template: "a = \\frac{F_{net}}{m} = \\frac{{netForce}}{{mass}}",
    description: "Acceleration",
    baseFormula: "a = F/m"
  },
  
  calculateDistance: {
    template: "d = \\frac{1}{2} \\times a \\times t^2 = \\frac{1}{2} \\times {acceleration} \\times {time}^2",
    description: "Distance Traveled",
    baseFormula: "d = ½at²"
  },
  
  calculateTime: {
    template: "t = \\sqrt{\\frac{2d}{a}} = \\sqrt{\\frac{2 \\times {distance}}{{acceleration}}}",
    description: "Time to Travel Distance",
    baseFormula: "t = √(2d/a)"
  }
};

// COLLISION/MOMENTUM FORMULA TEMPLATES - Fixed variable names
export const COLLISION_FORMULAS = {
  calcFinalVelocitiesElastic: {
    // This returns two velocities, so we'll handle it specially
    template: "v_1' = \\frac{({m1} - {m2}) \\times {v1} + 2 \\times {m2} \\times {v2}}{{m1} + {m2}}, \\quad v_2' = \\frac{({m2} - {m1}) \\times {v2} + 2 \\times {m1} \\times {v1}}{{m1} + {m2}}",
    description: "Final Velocities (Elastic Collision)",
    baseFormula: "Conservation of momentum + kinetic energy"
  },
  
  calcMomentum: {
    template: "p = {m} \\times {v}",
    description: "Momentum",
    baseFormula: "p = mv"
  },
  
  calcKineticEnergy: {
    template: "KE = \\frac{1}{2} \\times {m} \\times {v}^2",
    description: "Kinetic Energy", 
    baseFormula: "KE = ½mv²"
  },
  
  calcTimeToCollision: {
    template: "t = \\frac{|{x2} - {x1}|}{|{v1} - {v2}|} = \\frac{|{x2} - {x1}|}{|{v1} - {v2}|}",
    description: "Time to Collision",
    baseFormula: "t = Δx/Δv"
  },
  
  calcPosition: {
    template: "x = {x0} + {v} \\times {t}",
    description: "Position after Time",
    baseFormula: "x = x₀ + vt"
  }
};

// Enhanced FormulaDisplay component with error handling
export const FormulaDisplay = ({
  formulaKey,
  values = {},
  result,
  topic = "freefall",
  showBaseFormula = true
}) => {
  const getFormulaConfig = () => {
    switch (topic) {
      case "freefall":
      case "free-fall":
        return FREE_FALL_FORMULAS[formulaKey];
      case "projectile":
      case "projectile-motion":
        return PROJECTILE_MOTION_FORMULAS[formulaKey];
      case "friction":
        return FRICTION_FORMULAS[formulaKey];
      case "collision":
      case "inertia":
        return COLLISION_FORMULAS[formulaKey];
      default:
        console.warn(`Unknown topic: ${topic}`);
        return null;
    }
  };

  const formulaConfig = getFormulaConfig();
  if (!formulaConfig) {
    return (
      <div style={{ color: 'red', padding: '10px' }}>
        Formula not found: {formulaKey} in topic {topic}
      </div>
    );
  }

  const { formula, result: formattedResult } = createFormulaTemplate(
    formulaConfig.template,
    values,
    result
  );

  return (
    <div style={{
      margin: "15px 0",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #e9ecef"
    }}>
      <div style={{ 
        fontWeight: "bold", 
        marginBottom: "8px",
        color: "#495057",
        fontSize: "16px"
      }}>
        {formulaConfig.description}
      </div>
      
      {showBaseFormula && (
        <div style={{ 
          marginBottom: "10px",
          fontSize: "14px",
          color: "#6c757d"
        }}>
          <strong>Base Formula:</strong> {formulaConfig.baseFormula}
        </div>
      )}
      
      <div style={{
        backgroundColor: "white",
        padding: "12px",
        borderRadius: "4px",
        border: "1px solid #dee2e6"
      }}>
        <MathJax>{`$$${formula}$$`}</MathJax>
      </div>
      
      {formattedResult !== undefined && formattedResult !== null && (
        <div style={{ 
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#d4edda",
          color: "#155724",
          borderRadius: "4px",
          fontWeight: "bold"
        }}>
          Result: {formattedResult}
        </div>
      )}
    </div>
  );
};

// Helper functions for each topic - Fixed parameter mapping

// FREE FALL helper function
export const getFreeFallFormulasForTarget = (functionName, userInput, result) => {
    // Validate and sanitize inputs
    const sanitizeValue = (value, fallback = 0) => {
      if (value === null || value === undefined || value === '' || isNaN(value)) {
        return fallback;
      }
      return Number(value);
    };
  
    const baseValues = {
      initialVelocity: sanitizeValue(userInput.initialVelocity),
      finalVelocity: sanitizeValue(userInput.finalVelocity, result),
      gravity: sanitizeValue(userInput.gravity, 9.81),
      initialHeight: sanitizeValue(userInput.initialHeight),
      finalHeight: sanitizeValue(userInput.finalHeight, result),
      time: sanitizeValue(userInput.time, result)
    };
  
    // Check if we have enough non-zero values to make sense
    const hasValidInputs = Object.values(baseValues).some(val => val !== 0);
    
    if (!hasValidInputs) {
      console.warn('No valid inputs provided for formula generation');
      return [];
    }
  
    // For the specific calculation, use the result if it's the target
    const targetValue = typeof result === 'number' ? Number(result.toFixed(3)) : result;
  
    return [{
      key: functionName,
      values: baseValues,
      result: targetValue
    }];
  };
  

// PROJECTILE MOTION helper function
export const getProjectileMotionFormulasForTarget = (functionName, userInput, result) => {
    const baseValues = {
      velocity: userInput.velocity ?? userInput.initialVelocity ?? 0,
      angle: userInput.angle ?? userInput.launchAngle ?? 0, // FIX: Map launchAngle correctly
      gravity: Math.abs(userInput.gravity ?? 9.81), // FIX: Ensure positive for display
      initialHeight: userInput.initialHeight ?? 0,
      vx: result?.vx,
      vy: result?.vy
    };
  
    // Handle velocity components special case
    if (functionName === 'calcVelocityComponents' && result) {
      baseValues.vx = result.vx?.toFixed(2);
      baseValues.vy = result.vy?.toFixed(2);
    }
  
    return [{
      key: functionName,
      values: baseValues,
      result: typeof result === 'object' ? null : result
    }];
  };

// FRICTION helper function 
export const getFrictionFormulasForTarget = (functionName, userInput, result) => {
    // Validate and sanitize inputs
    const sanitizeValue = (value, fallback = 0) => {
      if (value === null || value === undefined || value === '' || isNaN(value)) {
        return fallback;
      }
      return Number(value);
    };
  
    const baseValues = {
      mass: sanitizeValue(userInput.mass),
      gravity: sanitizeValue(userInput.gravity, 9.81),
      angle: sanitizeValue(userInput.angle),
      frictionCoefficient: sanitizeValue(userInput.frictionCoefficient || userInput.friction),
      time: sanitizeValue(userInput.time),
      distance: sanitizeValue(userInput.distance),
      // Include intermediate calculated values
      normalForce: sanitizeValue(userInput.normalForce),
      frictionForce: sanitizeValue(userInput.frictionForce),
      parallelForce: sanitizeValue(userInput.parallelForce),
      netForce: sanitizeValue(userInput.netForce),
      acceleration: sanitizeValue(userInput.acceleration)
    };
  
    // Check if we have enough non-zero values to make sense
    const hasValidInputs = Object.values(baseValues).some(val => val !== 0);
    
    if (!hasValidInputs) {
      console.warn('No valid inputs provided for friction formula generation');
      return [];
    }
  
    // For the specific calculation, use the result if it's the target
    const targetValue = typeof result === 'number' ? Number(result.toFixed(3)) : result;
  
    return [{
      key: functionName,
      values: baseValues,
      result: targetValue
    }];
  };

// COLLISION helper function
export const getCollisionFormulasForTarget = (functionName, userInput, result) => {
  const baseValues = {
    m: userInput.m ?? userInput.mass ?? 0,
    v: userInput.v ?? userInput.velocity ?? 0,
    m1: userInput.m1 ?? userInput.mass1 ?? 0,
    m2: userInput.m2 ?? userInput.mass2 ?? 0,
    v1: userInput.v1 ?? userInput.velocity1 ?? 0,
    v2: userInput.v2 ?? userInput.velocity2 ?? 0,
    x0: userInput.x0 ?? userInput.initialPosition ?? 0,
    x1: userInput.x1 ?? userInput.position1 ?? 0,
    x2: userInput.x2 ?? userInput.position2 ?? 0,
    t: userInput.t ?? userInput.time ?? 0
  };

  return [{
    key: functionName,
    values: baseValues,
    result: result
  }];
};

// Utility function to get formula display for any physics calculation
export const getFormulaDisplay = (topic, functionName, userInput, result) => {
  switch (topic) {
    case 'freefall':
    case 'free-fall':
      return getFreeFallFormulasForTarget(functionName, userInput, result);
    case 'projectile':
    case 'projectile-motion':
      return getProjectileMotionFormulasForTarget(functionName, userInput, result);
    case 'friction':
      return getFrictionFormulasForTarget(functionName, userInput, result);
    case 'collision':
    case 'inertia':
      return getCollisionFormulasForTarget(functionName, userInput, result);
    default:
      console.warn(`Unknown topic for formula display: ${topic}`);
      return [];
  }
};