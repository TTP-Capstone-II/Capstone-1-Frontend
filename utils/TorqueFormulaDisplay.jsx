import React from "react";
import { Box, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

// Convert degrees to radians
const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Component to display torque formulas with user inputs and results
const TorqueFormulaDisplay = ({ topic, target, results, userInput }) => {
  // Safely parse user inputs with fallback values
  const torque = Number(userInput?.torque) || 0;
  const inertia = Number(userInput?.inertia) || 0;
  const angularAcceleration = Number(userInput?.angularAcceleration) || 0;
  const distanceFromPivot = Number(userInput?.distanceFromPivot) || 0;
  const angle = Number(userInput?.angle) || 0;
  const force = Number(userInput?.force) || 0;

  // Calculate intermediate values for plugged formulas
  const thetaRad = toRadians(angle);
  const sinTheta = Number.isFinite(Math.sin(thetaRad)) ? Math.sin(thetaRad).toFixed(2) : "0.00";
  const torqueFromForce = distanceFromPivot && force && Number.isFinite(Math.sin(thetaRad)) ? (distanceFromPivot * force * Math.sin(thetaRad)).toFixed(2) : null;
  const torqueFromInertia = inertia && angularAcceleration ? (inertia * angularAcceleration).toFixed(2) : null;
  const angularAccelerationFromTorque = inertia !== 0 ? (torque / inertia).toFixed(2) : null;
  const angularAccelerationFromForce = inertia !== 0 && distanceFromPivot && force && Number.isFinite(Math.sin(thetaRad)) ? ((distanceFromPivot * force * Math.sin(thetaRad)) / inertia).toFixed(2) : null;
  const distanceFromPivotCalc = force !== 0 && Number.isFinite(Math.sin(thetaRad)) && Math.sin(thetaRad) !== 0 ? (torque / (force * Math.sin(thetaRad))).toFixed(2) : null;
  const angleCalc = distanceFromPivot !== 0 && force !== 0 && Number.isFinite(torque / (distanceFromPivot * force)) && Math.abs(torque / (distanceFromPivot * force)) <= 1 ? (Math.asin(torque / (distanceFromPivot * force)) * 180 / Math.PI).toFixed(2) : null;
  const forceCalc = distanceFromPivot !== 0 && Number.isFinite(Math.sin(thetaRad)) && Math.sin(thetaRad) !== 0 ? (torque / (distanceFromPivot * Math.sin(thetaRad))).toFixed(2) : null;

  // Define formulas for torque topic
  const formulaDefinitions = {
    torque: {
      torque: {
        base: "\\tau = r F \\sin\\theta \\quad \\text{or} \\quad \\tau = I \\alpha",
        plugged: `\\tau = ${distanceFromPivot.toFixed(2)} \\cdot ${force.toFixed(2)} \\cdot ${sinTheta} \\quad \\text{or} \\quad \\tau = ${inertia.toFixed(2)} \\cdot ${angularAcceleration.toFixed(2)}`,
        result: results?.torque != null ? `\\tau = ${Number(results.torque).toFixed(2)} \\text{ N} \\cdot \\text{m}` : "\\text{no valid result}",
      },
      angularAcceleration: {
        base: "\\alpha = \\frac{\\tau}{I} \\quad \\text{or} \\quad \\alpha = \\frac{r F \\sin\\theta}{I}",
        plugged: `\\alpha = \\frac{${torque.toFixed(2)}}{${inertia.toFixed(2)}} \\quad \\text{or} \\quad \\alpha = \\frac{${distanceFromPivot.toFixed(2)} \\cdot ${force.toFixed(2)} \\cdot ${sinTheta}}{${inertia.toFixed(2)}}`,
        result: results?.angularAcceleration != null ? `\\alpha = ${Number(results.angularAcceleration).toFixed(2)} \\text{ rad/s}^2` : "\\text{no valid result}",
      },
      distanceFromPivot: {
        base: "r = \\frac{\\tau}{F \\sin\\theta}",
        plugged: `r = \\frac{${torque.toFixed(2)}}{${force.toFixed(2)} \\cdot ${sinTheta}}`,
        result: results?.distanceFromPivot != null ? `r = ${Number(results.distanceFromPivot).toFixed(2)} \\text{ m}` : "\\text{no valid result}",
      },
      angle: {
        base: "\\theta = \\sin^{-1}\\left(\\frac{\\tau}{r F}\\right)",
        plugged: `\\theta = \\sin^{-1}\\left(\\frac{${torque.toFixed(2)}}{${distanceFromPivot.toFixed(2)} \\cdot ${force.toFixed(2)}}\\right)`,
        result: results?.angle != null && Number.isFinite(Number(results.angle)) ? `\\theta = ${Number(results.angle).toFixed(2)} \\text{ °}` : "\\text{invalid angle}",
      },
      force: {
        base: "F = \\frac{\\tau}{r \\sin\\theta}",
        plugged: `F = \\frac{${torque.toFixed(2)}}{${distanceFromPivot.toFixed(2)} \\cdot ${sinTheta}}`,
        result: results?.force != null ? `F = ${Number(results.force).toFixed(2)} \\text{ N}` : "\\text{no valid result}",
      },
      All: {
        calculations: [
          {
            label: "Torque",
            base: "\\tau = r F \\sin\\theta \\quad \\text{or} \\quad \\tau = I \\alpha",
            plugged: `\\tau = ${distanceFromPivot.toFixed(2)} \\cdot ${force.toFixed(2)} \\cdot ${sinTheta} \\quad \\text{or} \\quad \\tau = ${inertia.toFixed(2)} \\cdot ${angularAcceleration.toFixed(2)}`,
            result: results?.torque != null ? `\\tau = ${Number(results.torque).toFixed(2)} \\text{ N} \\cdot \\text{m}` : "\\text{no valid result}",
          },
          {
            label: "Angular Acceleration",
            base: "\\alpha = \\frac{\\tau}{I} \\quad \\text{or} \\quad \\alpha = \\frac{r F \\sin\\theta}{I}",
            plugged: `\\alpha = \\frac{${torque.toFixed(2)}}{${inertia.toFixed(2)}} \\quad \\text{or} \\quad \\alpha = \\frac{${distanceFromPivot.toFixed(2)} \\cdot ${force.toFixed(2)} \\cdot ${sinTheta}}{${inertia.toFixed(2)}}`,
            result: results?.angularAcceleration != null ? `\\alpha = ${Number(results.angularAcceleration).toFixed(2)} \\text{ rad/s}^2` : "\\text{no valid result}",
          },
          {
            label: "Distance from Pivot",
            base: "r = \\frac{\\tau}{F \\sin\\theta}",
            plugged: `r = \\frac{${torque.toFixed(2)}}{${force.toFixed(2)} \\cdot ${sinTheta}}`,
            result: results?.distanceFromPivot != null ? `r = ${Number(results.distanceFromPivot).toFixed(2)} \\text{ m}` : "\\text{no valid result}",
          },
          {
            label: "Angle",
            base: "\\theta = \\sin^{-1}\\left(\\frac{\\tau}{r F}\\right)",
            plugged: `\\theta = \\sin^{-1}\\left(\\frac{${torque.toFixed(2)}}{${distanceFromPivot.toFixed(2)} \\cdot ${force.toFixed(2)}}\\right)`,
            result: results?.angle != null && Number.isFinite(Number(results.angle)) ? `\\theta = ${Number(results.angle).toFixed(2)} \\text{ °}` : "\\text{invalid angle}",
          },
          {
            label: "Force",
            base: "F = \\frac{\\tau}{r \\sin\\theta}",
            plugged: `F = \\frac{${torque.toFixed(2)}}{${distanceFromPivot.toFixed(2)} \\cdot ${sinTheta}}`,
            result: results?.force != null ? `F = ${Number(results.force).toFixed(2)} \\text{ N}` : "\\text{no valid result}",
          },
        ],
      },
    },
  };

  // Safely access formulas for the given topic and target
  const formulas = formulaDefinitions[topic]?.[target] || {};

  // Handle single formula vs multiple calculations (All target)
  if (target === "All") {
    const calculations = formulas.calculations || [];
    if (calculations.length === 0) {
      return (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">No formulas available for this selection.</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {calculations.map((calc, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {calc.label}
            </Typography>
            <BlockMath math={calc.base} />
            <BlockMath math={calc.plugged} />
            {calc.result && <BlockMath math={calc.result} />}
          </Box>
        ))}
      </Box>
    );
  }

  // Handle non-All targets
  if (!formulas.base) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">No formula available for this selection.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <BlockMath math={formulas.base} />
      <BlockMath math={formulas.plugged} />
      {formulas.result && <BlockMath math={formulas.result} />}
    </Box>
  );
};

export default TorqueFormulaDisplay;