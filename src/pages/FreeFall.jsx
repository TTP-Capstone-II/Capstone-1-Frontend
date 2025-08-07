import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FreeFallInterface from "../interfaces/FreeFallInterface";
import Matter from "matter-js";
import { World } from "matter-js";
import { FreeFallMotion } from "../topics/FreeFall";

const FreeFall = () => {
  const [userInput, setUserInput] = useState({
    gravity: "9.81",
    initialVelocity: "0",
    finalVelocity: "",
    initialHeight: "700",
    finalHeight: "0",
    time: "",
    target: "",
  });

  const [calculatedInput, setCalculatedInput] = useState(null); // 🔁 Used to trigger simulation

  const pixelsToMeterRatio = 2;

  const handleEngineReady = (engine, world) => {
    if (!calculatedInput) return;

    const square = Matter.Bodies.rectangle(
      500,
      650 - calculatedInput.initialHeight,
      50,
      50
    );

    Matter.Body.setVelocity(square, {
      x: 0,
      y: calculatedInput.initialVelocity * pixelsToMeterRatio,
    });

    engine.world.gravity.y =
      (Number(calculatedInput.gravity) / 9.81) * pixelsToMeterRatio;

    World.add(world, square);
  };

  // 🔁 Run simulation from interface button
  const runSimulation = () => {
    const result = FreeFallMotion({
      gravity: userInput.gravity,
      initialVelocity: userInput.initialVelocity,
      finalVelocity: userInput.finalVelocity,
      initialHeight: userInput.initialHeight,
      finalHeight: userInput.finalHeight,
      time: userInput.time,
      target: userInput.target,
    });

    if (typeof result === "string") {
      // Error string from validation
      return result;
    }

    setCalculatedInput(result); // ✅ This will be used in simulation
    return result;
  };

  return (
    <div className="simulation-page" style={{ display: "flex", height: "700px" }}>
      <FreeFallInterface
        userInput={userInput}
        setUserInput={setUserInput}
        runSimulation={runSimulation} // Pass simulation trigger
      />
      <BaseSimulation onEngineReady={handleEngineReady} />
    </div>
  );
};

export default FreeFall;
