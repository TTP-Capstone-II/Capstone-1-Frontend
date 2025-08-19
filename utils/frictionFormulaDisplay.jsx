import React from "react";
import { Box, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

// Component to display friction formulas with user inputs and results
const FrictionFormulaDisplay = ({ topic, target, results, userInput }) => {
  // Safely parse user inputs with fallback values
  const gravity = Number(userInput?.gravity) || 9.81;
  const mass = Number(userInput?.mass) || 0;
  const frictionCoefficient = Number(userInput?.friction) || 0;
  const angle = Number(userInput?.angle) || 0;
  const time = Number(userInput?.time) || 0;
  const distance = Number(userInput?.distance) || 0;

  // Calculate intermediate values if not provided in results
  const normalForce = results?.normalForce ?? (mass * gravity * Math.cos((angle * Math.PI) / 180)).toFixed(2);
  const parallelForce = results?.parallelForce ?? (mass * gravity * Math.sin((angle * Math.PI) / 180)).toFixed(2);
  const frictionForce = results?.frictionForce ?? (normalForce * frictionCoefficient).toFixed(2);
  const netForce = results?.netForce ?? (parallelForce - frictionForce).toFixed(2);
  const acceleration = results?.acceleration ?? (netForce / mass).toFixed(2);

  // Define formulas for friction topic
  const formulaDefinitions = {
    friction: {
      normalForce: {
        base: "N = m g \\cos\\theta",
        plugged: `N = ${mass.toFixed(2)} \\cdot ${gravity.toFixed(2)} \\cos(${angle.toFixed(2)}^\\circ)`,
        result: results?.normalForce ? `N = ${results.normalForce.toFixed(2)} \\text{ N}` : null,
      },
      frictionForce: {
        base: "F_f = \\mu N",
        plugged: `F_f = ${frictionCoefficient.toFixed(2)} \\cdot ${normalForce}`,
        result: results?.frictionForce ? `F_f = ${results.frictionForce.toFixed(2)} \\text{ N}` : null,
      },
      parallelForce: {
        base: "F_\\parallel = m g \\sin\\theta",
        plugged: `F_\\parallel = ${mass.toFixed(2)} \\cdot ${gravity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ)`,
        result: results?.parallelForce ? `F_\\parallel = ${results.parallelForce.toFixed(2)} \\text{ N}` : null,
      },
      netForce: {
        base: "F_\\text{net} = F_\\parallel - F_f",
        plugged: `F_\\text{net} = ${parallelForce} - ${frictionForce}`,
        result: results?.netForce ? `F_\\text{net} = ${results.netForce.toFixed(2)} \\text{ N}` : null,
      },
      acceleration: {
        base: "a = \\frac{F_\\text{net}}{m}",
        plugged: `a = \\frac{${netForce}}{${mass.toFixed(2)}}`,
        result: results?.acceleration ? `a = ${results.acceleration.toFixed(2)} \\text{ m/s}^2` : null,
      },
      distance: {
        base: "d = \\frac{1}{2} a t^2",
        plugged: `d = \\frac{1}{2} \\cdot ${acceleration} \\cdot ${time.toFixed(2)}^2`,
        result: results?.distance ? `d = ${results.distance.toFixed(2)} \\text{ m}` : null,
      },
      time: {
        base: "t = \\sqrt{\\frac{2d}{a}}",
        plugged: `t = \\sqrt{\\frac{2 \\cdot ${distance.toFixed(2)}}{${acceleration}}}`,
        result: results?.time ? `t = ${results.time.toFixed(2)} \\text{ s}` : null,
      },
      all: {
        calculations: [
          {
            label: "Normal Force",
            base: "N = m g \\cos\\theta",
            plugged: `N = ${mass.toFixed(2)} \\cdot ${gravity.toFixed(2)} \\cos(${angle.toFixed(2)}^\\circ)`,
            result: results?.normalForce ? `N = ${results.normalForce.toFixed(2)} \\text{ N}` : null,
          },
          {
            label: "Friction Force",
            base: "F_f = \\mu N",
            plugged: `F_f = ${frictionCoefficient.toFixed(2)} \\cdot ${normalForce}`,
            result: results?.frictionForce ? `F_f = ${results.frictionForce.toFixed(2)} \\text{ N}` : null,
          },
          {
            label: "Parallel Force",
            base: "F_\\parallel = m g \\sin\\theta",
            plugged: `F_\\parallel = ${mass.toFixed(2)} \\cdot ${gravity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ)`,
            result: results?.parallelForce ? `F_\\parallel = ${results.parallelForce.toFixed(2)} \\text{ N}` : null,
          },
          {
            label: "Net Force",
            base: "F_\\text{net} = F_\\parallel - F_f",
            plugged: `F_\\text{net} = ${parallelForce} - ${frictionForce}`,
            result: results?.netForce ? `F_\\text{net} = ${results.netForce.toFixed(2)} \\text{ N}` : null,
          },
          {
            label: "Acceleration",
            base: "a = \\frac{F_\\text{net}}{m}",
            plugged: `a = \\frac{${netForce}}{${mass.toFixed(2)}}`,
            result: results?.acceleration ? `a = ${results.acceleration.toFixed(2)} \\text{ m/s}^2` : null,
          },
          {
            label: "Distance",
            base: "d = \\frac{1}{2} a t^2",
            plugged: `d = \\frac{1}{2} \\cdot ${acceleration} \\cdot ${time.toFixed(2)}^2`,
            result: results?.distance ? `d = ${results.distance.toFixed(2)} \\text{ m}` : null,
          },
          {
            label: "Time",
            base: "t = \\sqrt{\\frac{2d}{a}}",
            plugged: `t = \\sqrt{\\frac{2 \\cdot ${distance.toFixed(2)}}{${acceleration}}}`,
            result: results?.time ? `t = ${results.time.toFixed(2)} \\text{ s}` : null,
          },
        ],
      },
    },
  };

  // Safely access formulas for the given topic and target
  const formulas = formulaDefinitions[topic]?.[target] || {};

  // Handle single formula vs multiple calculations (all target)
  if (target === "all") {
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

  // Handle non-all targets
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

export default FrictionFormulaDisplay;