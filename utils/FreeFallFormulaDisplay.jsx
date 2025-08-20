import React from "react";
import { Box, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

// Component to display free fall formulas with user inputs and results
const FreeFallFormulaDisplay = ({ topic, target, results, userInput }) => {
  // Safely parse user inputs with fallback values
  const g = Number(userInput?.gravity) || 9.81;
  const u = Number(userInput?.initialVelocity) || 0;
  const v = Number(userInput?.finalVelocity) || 0;
  const y0 = Number(userInput?.initialHeight) || 0;
  const y = Number(userInput?.finalHeight) || 0;
  const t = Number(userInput?.time) || 0;

  // Calculate intermediate values for plugged formulas and results
  const displacement = (y - y0).toFixed(2);
  const finalVelocityNoY = (u + g * t).toFixed(2);
  const finalVelocityNoTime = Number.isFinite(Math.sqrt(Math.abs(u ** 2 + 2 * g * (y - y0)))) ? Math.sqrt(Math.abs(u ** 2 + 2 * g * (y - y0))).toFixed(2) : null;
  const initialVelocityNoFV = t !== 0 ? ((y - y0 - 0.5 * g * t ** 2) / t).toFixed(2) : null;
  const initialVelocityNoY = (v - g * t).toFixed(2);
  const initialVelocityNoTime = Number.isFinite(Math.sqrt(Math.abs(v ** 2 - 2 * g * (y - y0)))) ? Math.sqrt(Math.abs(v ** 2 - 2 * g * (y - y0))).toFixed(2) : null;
  const gravityNoFV = t !== 0 ? ((y - y0 - u * t) / (0.5 * t ** 2)).toFixed(2) : null;
  const gravityNoY = t !== 0 ? ((v - u) / t).toFixed(2) : null;
  const gravityNoTime = (y - y0) !== 0 ? ((v ** 2 - u ** 2) / (2 * (y - y0))).toFixed(2) : null;
  const timeNoY = g !== 0 ? ((v - u) / g).toFixed(2) : null;
  const discriminant = u ** 2 - 2 * g * (y0 - y);
  const timeNoFV = discriminant >= 0 && g !== 0 ? [((-u + Math.sqrt(discriminant)) / g).toFixed(2), ((-u - Math.sqrt(discriminant)) / g).toFixed(2)].filter(t => Number(t) > 0) : [];
  const finalHeightNoTime = g !== 0 ? ((v ** 2 - u ** 2) / (2 * g) + y0).toFixed(2) : null;
  const finalHeightNoFV = (y0 + u * t + 0.5 * g * t ** 2).toFixed(2);
  const initialHeightNoTime = g !== 0 ? (y - (v ** 2 - u ** 2) / (2 * g)).toFixed(2) : null;
  const initialHeightNoFV = (y - u * t - 0.5 * g * t ** 2).toFixed(2);

  // Define formulas for free fall topic
  const formulaDefinitions = {
    freeFall: {
      finalVelocity: {
        base: "v = u + a t",
        plugged: `v = ${u.toFixed(2)} + ${g.toFixed(2)} \\cdot ${t.toFixed(2)}`,
        result: results?.finalVelocity ? `v = ${Number(results.finalVelocity).toFixed(2)} \\text{ m/s}` : null,
      },
      finalHeight: {
        base: "y = y_0 + u t + \\frac{1}{2} a t^2",
        plugged: `y = ${y0.toFixed(2)} + ${u.toFixed(2)} \\cdot ${t.toFixed(2)} + \\frac{1}{2} \\cdot ${g.toFixed(2)} \\cdot ${t.toFixed(2)}^2`,
        result: results?.finalHeight ? `y = ${Number(results.finalHeight).toFixed(2)} \\text{ m}` : null,
      },
      time: {
        base: "t = \\frac{v - u}{a} \\quad \\text{or} \\quad t = \\frac{-u \\pm \\sqrt{u^2 - 2 a (y_0 - y)}}{a}",
        plugged: `t = \\frac{${v.toFixed(2)} - ${u.toFixed(2)}}{${g.toFixed(2)}} \\quad \\text{or} \\quad t = \\frac{-(${u.toFixed(2)}) \\pm \\sqrt{${u.toFixed(2)}^2 - 2 \\cdot ${g.toFixed(2)} \\cdot (${y0.toFixed(2)} - ${y.toFixed(2)})}}{${g.toFixed(2)}}`,
        result: results?.time ? (Array.isArray(results.time) ? results.time.map(t => Number(t).toFixed(2)).filter(t => t > 0).join(", ") + " \\text{ s}" : `${Number(results.time).toFixed(2)} \\text{ s}`) : null,
      },
      initialVelocity: {
        base: "u = v - a t \\quad \\text{or} \\quad u = \\frac{y - y_0 - \\frac{1}{2} a t^2}{t}",
        plugged: `u = ${v.toFixed(2)} - ${g.toFixed(2)} \\cdot ${t.toFixed(2)} \\quad \\text{or} \\quad u = \\frac{${y.toFixed(2)} - ${y0.toFixed(2)} - \\frac{1}{2} \\cdot ${g.toFixed(2)} \\cdot ${t.toFixed(2)}^2}{${t.toFixed(2)}}`,
        result: results?.initialVelocity ? `u = ${Number(results.initialVelocity).toFixed(2)} \\text{ m/s}` : null,
      },
      initialHeight: {
        base: "y_0 = y - u t - \\frac{1}{2} a t^2",
        plugged: `y_0 = ${y.toFixed(2)} - ${u.toFixed(2)} \\cdot ${t.toFixed(2)} - \\frac{1}{2} \\cdot ${g.toFixed(2)} \\cdot ${t.toFixed(2)}^2`,
        result: results?.initialHeight ? `y_0 = ${Number(results.initialHeight).toFixed(2)} \\text{ m}` : null,
      },
      gravity: {
        base: "a = \\frac{v - u}{t} \\quad \\text{or} \\quad a = \\frac{y - y_0 - u t}{\\frac{1}{2} t^2}",
        plugged: `a = \\frac{${v.toFixed(2)} - ${u.toFixed(2)}}{${t.toFixed(2)}} \\quad \\text{or} \\quad a = \\frac{${y.toFixed(2)} - ${y0.toFixed(2)} - ${u.toFixed(2)} \\cdot ${t.toFixed(2)}}{\\frac{1}{2} \\cdot ${t.toFixed(2)}^2}`,
        result: results?.gravity ? `a = ${Number(results.gravity).toFixed(2)} \\text{ m/s}^2` : null,
      },
      All: {
        calculations: [
          {
            label: "Final Velocity",
            base: "v = u + a t \\quad \\text{or} \\quad v^2 = u^2 + 2 a (y - y_0)",
            plugged: `v = ${u.toFixed(2)} + ${g.toFixed(2)} \\cdot ${t.toFixed(2)} \\quad \\text{or} \\quad v^2 = ${u.toFixed(2)}^2 + 2 \\cdot ${g.toFixed(2)} \\cdot (${y.toFixed(2)} - ${y0.toFixed(2)})`,
            result: results?.finalVelocity ? `v = ${Number(results.finalVelocity).toFixed(2)} \\text{ m/s}` : null,
          },
          {
            label: "Final Height",
            base: "y = y_0 + u t + \\frac{1}{2} a t^2 \\quad \\text{or} \\quad y = \\frac{v^2 - u^2}{2 a} + y_0",
            plugged: `y = ${y0.toFixed(2)} + ${u.toFixed(2)} \\cdot ${t.toFixed(2)} + \\frac{1}{2} \\cdot ${g.toFixed(2)} \\cdot ${t.toFixed(2)}^2 \\quad \\text{or} \\quad y = \\frac{${v.toFixed(2)}^2 - ${u.toFixed(2)}^2}{2 \\cdot ${g.toFixed(2)}} + ${y0.toFixed(2)}`,
            result: results?.finalHeight ? `y = ${Number(results.finalHeight).toFixed(2)} \\text{ m}` : null,
          },
          {
            label: "Time",
            base: "t = \\frac{v - u}{a} \\quad \\text{or} \\quad t = \\frac{-u \\pm \\sqrt{u^2 - 2 a (y_0 - y)}}{a}",
            plugged: `t = \\frac{${v.toFixed(2)} - ${u.toFixed(2)}}{${g.toFixed(2)}} \\quad \\text{or} \\quad t = \\frac{-(${u.toFixed(2)}) \\pm \\sqrt{${u.toFixed(2)}^2 - 2 \\cdot ${g.toFixed(2)} \\cdot (${y0.toFixed(2)} - ${y.toFixed(2)})}}{${g.toFixed(2)}}`,
            result: results?.time ? (Array.isArray(results.time) ? results.time.map(t => Number(t).toFixed(2)).filter(t => t > 0).join(", ") + " \\text{ s}" : `${Number(results.time).toFixed(2)} \\text{ s}`) : null,
          },
          {
            label: "Initial Velocity",
            base: "u = v - a t \\quad \\text{or} \\quad u = \\frac{y - y_0 - \\frac{1}{2} a t^2}{t}",
            plugged: `u = ${v.toFixed(2)} - ${g.toFixed(2)} \\cdot ${t.toFixed(2)} \\quad \\text{or} \\quad u = \\frac{${y.toFixed(2)} - ${y0.toFixed(2)} - \\frac{1}{2} \\cdot ${g.toFixed(2)} \\cdot ${t.toFixed(2)}^2}{${t.toFixed(2)}}`,
            result: results?.initialVelocity ? `u = ${Number(results.initialVelocity).toFixed(2)} \\text{ m/s}` : null,
          },
          {
            label: "Initial Height",
            base: "y_0 = y - u t - \\frac{1}{2} a t^2 \\quad \\text{or} \\quad y_0 = y - \\frac{v^2 - u^2}{2 a}",
            plugged: `y_0 = ${y.toFixed(2)} - ${u.toFixed(2)} \\cdot ${t.toFixed(2)} - \\frac{1}{2} \\cdot ${g.toFixed(2)} \\cdot ${t.toFixed(2)}^2 \\quad \\text{or} \\quad y_0 = ${y.toFixed(2)} - \\frac{${v.toFixed(2)}^2 - ${u.toFixed(2)}^2}{2 \\cdot ${g.toFixed(2)}}`,
            result: results?.initialHeight ? `y_0 = ${Number(results.initialHeight).toFixed(2)} \\text{ m}` : null,
          },
          {
            label: "Gravity",
            base: "a = \\frac{v - u}{t} \\quad \\text{or} \\quad a = \\frac{y - y_0 - u t}{\\frac{1}{2} t^2}",
            plugged: `a = \\frac{${v.toFixed(2)} - ${u.toFixed(2)}}{${t.toFixed(2)}} \\quad \\text{or} \\quad a = \\frac{${y.toFixed(2)} - ${y0.toFixed(2)} - ${u.toFixed(2)} \\cdot ${t.toFixed(2)}}{\\frac{1}{2} \\cdot ${t.toFixed(2)}^2}`,
            result: results?.gravity ? `a = ${Number(results.gravity).toFixed(2)} \\text{ m/s}^2` : null,
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

export default FreeFallFormulaDisplay;