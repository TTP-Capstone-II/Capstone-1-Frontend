import React from "react";
import { Box, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

// Component to display formulas with user inputs and results
const FormulaDisplay = ({ topic, target, results, userInput }) => {
  // Safely parse user inputs with fallback values
  const gravity = Number(userInput?.gravity) || 9.81;
  const velocity = Number(userInput?.initialVelocity) || 0;
  const angle = Number(userInput?.launchAngle) || 0;
  const initialHeight = Number(userInput?.initialHeight) || 0;

  // Define formulas for different topics and targets
  const formulaDefinitions = {
    "projectile-motion": {
      range: {
        base: "R = v \\cos\\theta \\cdot t",
        plugged: `R = ${velocity.toFixed(2)} \\cos(${angle.toFixed(2)}^\\circ) \\cdot ${results?.timeOfFlight?.toFixed(2) || "t"}`,
        result: results?.range ? `R = ${results.range.toFixed(2)} \\text{ m}` : null,
      },
      timeOfFlight: {
        base: "t = \\frac{v \\sin\\theta + \\sqrt{(v \\sin\\theta)^2 + 2 g y_0}}{g}",
        plugged: `t = \\frac{${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ) + \\sqrt{(${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ))^2 + 2 \\cdot ${gravity.toFixed(2)} \\cdot ${initialHeight.toFixed(2)}}}{${gravity.toFixed(2)}}`,
        result: results?.timeOfFlight ? `t = ${results.timeOfFlight.toFixed(2)} \\text{ s}` : null,
      },
      maxHeight: {
        base: "H = y_0 + \\frac{(v \\sin\\theta)^2}{2g}",
        plugged: `H = ${initialHeight.toFixed(2)} + \\frac{(${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ))^2}{2 \\cdot ${gravity.toFixed(2)}}`,
        result: results?.maxHeight ? `H = ${results.maxHeight.toFixed(2)} \\text{ m}` : null,
      },
      velocityComponents: {
        base: "v_x = v \\cos\\theta, \\quad v_y = v \\sin\\theta",
        plugged: `v_x = ${velocity.toFixed(2)} \\cos(${angle.toFixed(2)}^\\circ), \\quad v_y = ${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ)`,
        result: results?.vx && results?.vy ? `v_x = ${results.vx.toFixed(2)} \\text{ m/s}, \\quad v_y = ${results.vy.toFixed(2)} \\text{ m/s}` : null,
      },
      All: {
        calculations: [
          {
            label: "Range",
            base: "R = v \\cos\\theta \\cdot t",
            plugged: `R = ${velocity.toFixed(2)} \\cos(${angle.toFixed(2)}^\\circ) \\cdot ${results?.timeOfFlight?.toFixed(2) || "t"}`,
            result: results?.range ? `R = ${results.range.toFixed(2)} \\text{ m}` : null,
          },
          {
            label: "Time of Flight",
            base: "t = \\frac{v \\sin\\theta + \\sqrt{(v \\sin\\theta)^2 + 2 g y_0}}{g}",
            plugged: `t = \\frac{${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ) + \\sqrt{(${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ))^2 + 2 \\cdot ${gravity.toFixed(2)} \\cdot ${initialHeight.toFixed(2)}}}{${gravity.toFixed(2)}}`,
            result: results?.timeOfFlight ? `t = ${results.timeOfFlight.toFixed(2)} \\text{ s}` : null,
          },
          {
            label: "Maximum Height",
            base: "H = y_0 + \\frac{(v \\sin\\theta)^2}{2g}",
            plugged: `H = ${initialHeight.toFixed(2)} + \\frac{(${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ))^2}{2 \\cdot ${gravity.toFixed(2)}}`,
            result: results?.maxHeight ? `H = ${results.maxHeight.toFixed(2)} \\text{ m}` : null,
          },
          {
            label: "Velocity Components",
            base: "v_x = v \\cos\\theta, \\quad v_y = v \\sin\\theta",
            plugged: `v_x = ${velocity.toFixed(2)} \\cos(${angle.toFixed(2)}^\\circ), \\quad v_y = ${velocity.toFixed(2)} \\sin(${angle.toFixed(2)}^\\circ)`,
            result: results?.vx && results?.vy ? `v_x = ${results.vx.toFixed(2)} \\text{ m/s}, \\quad v_y = ${results.vy.toFixed(2)} \\text{ m/s}` : null,
          },
        ],
      },
    },
    // Add other topics here in the future, e.g., "kinematics", "dynamics"
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
            {calc.result && (
              <>
                <BlockMath math={calc.result} />
              </>
            )}
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
      {formulas.result && (
        <>
          <BlockMath math={formulas.result} />
        </>
      )}
    </Box>
  );
};

export default FormulaDisplay;