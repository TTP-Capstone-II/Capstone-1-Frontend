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
    const pivot = Bodies.polygon(500, 300, 5, 30, { isStatic: true });

    const lever = Bodies.rectangle(600, 300, 300, 30);

    var options = {
      bodyA: pivot,
      bodyB: lever,
      length: 20,
      pointA: { x: 0, y: 0 },
      pointB: { x: -150, y: 0 },
      stiffness: 1,
    };

    var constraint = Constraint.create(options);

    World.add(world, [pivot, lever, constraint]);
  };

  return (
    <div
      className="simulation-page"
      style={{ display: "flex", height: "700px" }}
    >
      <BaseSimulation onEngineReady={handleEngineReady} />
    </div>
  );
};

export default Torque;
