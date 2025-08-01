import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import TorqueInterface from "../interfaces/TorqueInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Constraint, Body } from "matter-js";
import { Button } from "@mui/material";

const Torque = () => {
  const [userInput, setUserInput] = useState({
    torque: "",
    inertia: "",
    angularAcceleration: "",
    distanceFromPivot: 300,
    angle: "",
    force: "",
    target: "",
  });

  //const angle = Number(userInput.angle) * (Math.PI / 180);
  //const angularAcceleration = Number(userInput.angularAcceleration);

  const handleEngineReady = (engine, world) => {
    //const pivot = Bodies.polygon(500, 300, 5, 30);
    const nail = { x: 400, y: 300 };
    const lever = Bodies.rectangle(600, 300, 300, 30, {
      density: 0.01,
      frictionAir: 1,
    });

    const pivot = Constraint.create({
      pointA: nail,
      bodyB: lever,
      pointB: { x: -150, y: 0 },
      stiffness: 1,
      length: 0,
    });

    engine.world.gravity.y = 0;

    World.add(world, [pivot, lever, nail]);
  };

  return (
    <div
      className="simulation-page"
      style={{ display: "flex", height: "700px" }}
    >
      <TorqueInterface userInput={userInput} setUserInput={setUserInput} />
      <BaseSimulation onEngineReady={handleEngineReady} />
    </div>
  );
};

export default Torque;
