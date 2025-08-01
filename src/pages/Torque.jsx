import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import ProjectileMotionInterface from "../interfaces/ProjectileMotionInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Constraint } from "matter-js";
import { Button } from "@mui/material";

const Torque = () => {
  const [userInput, setUserInput] = useState({
    Torque: "",
    angularAcceleration: "",
    distanceFromPivot: "",
    angle: "",
    force: "",
    momentOfInertia: "",
  });

  const angle = Number(userInput.angle) * (Math.PI / 180);
  const angularAcceleration = Number(userInput.angularAcceleration);

  const handleEngineReady = (engine, world) => {
    const pivot = Bodies.polygon(50, 390, 5, 10, { isStatic: true });
    Matter.Body.setPosition(pivot, { x: 30, y: 30 });

    const lever = Bodies.rectangle(Bodies.rectangle(400, 690, 600, 20), {});
    Matter.Body.setPosition(pivot, { x: 30, y: 30 });

    var options = {
      bodyA: pivot.body,
      bodyB: lever.body,
      length: 20,
    };

    var constraint = Constraint.create(options);

    World.add(world, constraint);
  };

  return (
    <div
      className="simulation-page"
      style={{ display: "flex", height: "700px" }}
    >
      <ProjectileMotionInterface
        userInput={userInput}
        setUserInput={setUserInput}
      />
      <BaseSimulation onEngineReady={handleEngineReady} />
    </div>
  );
};

export default Torque;
