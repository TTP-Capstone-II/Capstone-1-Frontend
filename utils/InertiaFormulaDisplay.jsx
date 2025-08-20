import React from "react";
import { Box, Typography } from "@mui/material";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

// Component to display inertia formulas with user inputs and results
const InertiaFormulaDisplay = ({ topic, target, results, userInput }) => {
  // Safely parse user inputs with fallback values
  const m1 = Number(userInput?.square1_mass) || 0;
  const v1 = Number(userInput?.square1_initialAcceleration) || 0; // Treating as velocity
  const x1 = Number(userInput?.square1_initialPosition) || 0;
  const m2 = Number(userInput?.square2_mass) || 0;
  const v2 = Number(userInput?.square2_initialAcceleration) || 0; // Treating as velocity
  const x2 = Number(userInput?.square2_initialPosition) || 0;
  const time = Number(userInput?.time) || 0;

  // Calculate intermediate values if not provided in results
  const v1Final = results?.v1Final ?? (((m1 - m2) / (m1 + m2)) * v1 + (2 * m2 / (m1 + m2)) * v2).toFixed(2);
  const v2Final = results?.v2Final ?? ((2 * m1 / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2).toFixed(2);
  const momentum1 = (m1 * v1).toFixed(2);
  const momentum2 = (m2 * v2).toFixed(2);
  const kineticEnergy1 = (0.5 * m1 * v1 ** 2).toFixed(2);
  const kineticEnergy2 = (0.5 * m2 * v2 ** 2).toFixed(2);
  const velocityDiff = v1 - v2;
  const positionDiff = x2 - x1;
  const timeToCollision = velocityDiff !== 0 ? (positionDiff / velocityDiff).toFixed(2) : "undefined";
  const position1 = (x1 + v1 * time).toFixed(2);
  const position2 = (x2 + v2 * time).toFixed(2);

  // Define formulas for inertia topic
  const formulaDefinitions = {
    inertia: {
      finalVelocity: {
        base: "v_{1f} = \\frac{m_1 - m_2}{m_1 + m_2} v_1 + \\frac{2 m_2}{m_1 + m_2} v_2, \\quad v_{2f} = \\frac{2 m_1}{m_1 + m_2} v_1 + \\frac{m_2 - m_1}{m_1 + m_2} v_2",
        plugged: `v_{1f} = \\frac{${m1.toFixed(2)} - ${m2.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v1.toFixed(2)} + \\frac{2 \\cdot ${m2.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v2.toFixed(2)}, \\quad v_{2f} = \\frac{2 \\cdot ${m1.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v1.toFixed(2)} + \\frac{${m2.toFixed(2)} - ${m1.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v2.toFixed(2)}`,
        result: results?.v1Final && results?.v2Final ? `v_{1f} = ${Number(results.v1Final).toFixed(2)} \\text{ m/s}, \\quad v_{2f} = ${Number(results.v2Final).toFixed(2)} \\text{ m/s}` : null,
      },
      momentum: {
        base: "p = m v",
        plugged: `p_1 = ${m1.toFixed(2)} \\cdot ${v1.toFixed(2)}, \\quad p_2 = ${m2.toFixed(2)} \\cdot ${v2.toFixed(2)}`,
        result: results?.momentum1 && results?.momentum2 ? `p_1 = ${Number(results.momentum1).toFixed(2)} \\text{ kg·m/s}, \\quad p_2 = ${Number(results.momentum2).toFixed(2)} \\text{ kg·m/s}` : null,
      },
      kineticEnergy: {
        base: "KE = \\frac{1}{2} m v^2",
        plugged: `KE_1 = \\frac{1}{2} \\cdot ${m1.toFixed(2)} \\cdot (${v1.toFixed(2)})^2, \\quad KE_2 = \\frac{1}{2} \\cdot ${m2.toFixed(2)} \\cdot (${v2.toFixed(2)})^2`,
        result: results?.kineticEnergy1 && results?.kineticEnergy2 ? `KE_1 = ${Number(results.kineticEnergy1).toFixed(2)} \\text{ J}, \\quad KE_2 = ${Number(results.kineticEnergy2).toFixed(2)} \\text{ J}` : null,
      },
      time: {
        base: "t = \\frac{x_2 - x_1}{v_1 - v_2}",
        plugged: `t = \\frac{${x2.toFixed(2)} - ${x1.toFixed(2)}}{${v1.toFixed(2)} - ${v2.toFixed(2)}}`,
        result: results?.timeToCollision && Number.isFinite(Number(results.timeToCollision)) ? `t = ${Number(results.timeToCollision).toFixed(2)} \\text{ s}` : velocityDiff !== 0 ? `t = ${timeToCollision} \\text{ s}` : "t = \\text{undefined}",
      },
      positionsAfterT: {
        base: "x = x_0 + v t",
        plugged: `x_1 = ${x1.toFixed(2)} + ${v1.toFixed(2)} \\cdot ${time.toFixed(2)}, \\quad x_2 = ${x2.toFixed(2)} + ${v2.toFixed(2)} \\cdot ${time.toFixed(2)}`,
        result: results?.position1 && results?.position2 ? `x_1 = ${Number(results.position1).toFixed(2)} \\text{ m}, \\quad x_2 = ${Number(results.position2).toFixed(2)} \\text{ m}` : null,
      },
      All: {
        calculations: [
          {
            label: "Final Velocities",
            base: "v_{1f} = \\frac{m_1 - m_2}{m_1 + m_2} v_1 + \\frac{2 m_2}{m_1 + m_2} v_2, \\quad v_{2f} = \\frac{2 m_1}{m_1 + m_2} v_1 + \\frac{m_2 - m_1}{m_1 + m_2} v_2",
            plugged: `v_{1f} = \\frac{${m1.toFixed(2)} - ${m2.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v1.toFixed(2)} + \\frac{2 \\cdot ${m2.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v2.toFixed(2)}, \\quad v_{2f} = \\frac{2 \\cdot ${m1.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v1.toFixed(2)} + \\frac{${m2.toFixed(2)} - ${m1.toFixed(2)}}{${m1.toFixed(2)} + ${m2.toFixed(2)}} \\cdot ${v2.toFixed(2)}`,
            result: results?.v1Final && results?.v2Final ? `v_{1f} = ${Number(results.v1Final).toFixed(2)} \\text{ m/s}, \\quad v_{2f} = ${Number(results.v2Final).toFixed(2)} \\text{ m/s}` : null,
          },
          {
            label: "Momentum (Before Collision)",
            base: "p = m v",
            plugged: `p_1 = ${m1.toFixed(2)} \\cdot ${v1.toFixed(2)}, \\quad p_2 = ${m2.toFixed(2)} \\cdot ${v2.toFixed(2)}`,
            result: results?.momentum1 && results?.momentum2 ? `p_1 = ${Number(results.momentum1).toFixed(2)} \\text{ kg·m/s}, \\quad p_2 = ${Number(results.momentum2).toFixed(2)} \\text{ kg·m/s}` : null,
          },
          {
            label: "Kinetic Energy (Before Collision)",
            base: "KE = \\frac{1}{2} m v^2",
            plugged: `KE_1 = \\frac{1}{2} \\cdot ${m1.toFixed(2)} \\cdot (${v1.toFixed(2)})^2, \\quad KE_2 = \\frac{1}{2} \\cdot ${m2.toFixed(2)} \\cdot (${v2.toFixed(2)})^2`,
            result: results?.kineticEnergy1 && results?.kineticEnergy2 ? `KE_1 = ${Number(results.kineticEnergy1).toFixed(2)} \\text{ J}, \\quad KE_2 = ${Number(results.kineticEnergy2).toFixed(2)} \\text{ J}` : null,
          },
          {
            label: "Time to Collision",
            base: "t = \\frac{x_2 - x_1}{v_1 - v_2}",
            plugged: `t = \\frac{${x2.toFixed(2)} - ${x1.toFixed(2)}}{${v1.toFixed(2)} - ${v2.toFixed(2)}}`,
            result: results?.timeToCollision && Number.isFinite(Number(results.timeToCollision)) ? `t = ${Number(results.timeToCollision).toFixed(2)} \\text{ s}` : velocityDiff !== 0 ? `t = ${timeToCollision} \\text{ s}` : "t = \\text{undefined}",
          },
          {
            label: "Positions After Time",
            base: "x = x_0 + v t",
            plugged: `x_1 = ${x1.toFixed(2)} + ${v1.toFixed(2)} \\cdot ${time.toFixed(2)}, \\quad x_2 = ${x2.toFixed(2)} + ${v2.toFixed(2)} \\cdot ${time.toFixed(2)}`,
            result: results?.position1 && results?.position2 ? `x_1 = ${Number(results.position1).toFixed(2)} \\text{ m}, \\quad x_2 = ${Number(results.position2).toFixed(2)} \\text{ m}` : null,
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

export default InertiaFormulaDisplay;