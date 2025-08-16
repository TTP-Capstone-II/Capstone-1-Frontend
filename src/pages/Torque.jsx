import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import TorqueInterface from "../interfaces/TorqueInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Constraint, Body } from "matter-js";
import { Button } from "@mui/material";
import { toRadians } from "../../utils/formulas";

const Torque = () => {
  const [userInput, setUserInput] = useState({
    torque: undefined,
    inertia: undefined,
    angularAcceleration: undefined,
    distanceFromPivot: undefined,
    length: 300,
    angle: 90,
    force: undefined,
    target: undefined,
  });

  const handleEngineReady = (engine, world) => {
    var group = Body.nextGroup(true),
      length = userInput.length,
      height = 30;

    const nail = { x: 400, y: 300 };
    const lever = Bodies.rectangle(
      nail.x + userInput.length / 2,
      nail.y,
      userInput.length,
      height,
      {
        density: 0.01,
        frictionAir: 0.001,
        collisionFilter: { group: group },
      }
    );

    const nailToLeverPivot = Constraint.create({
      pointA: nail,
      bodyB: lever,
      pointB: { x: -userInput.length / 2, y: 0 },
      stiffness: 1,
      length: 0,
    });

    // Final setup
    engine.world.gravity.y = 0;

    World.add(world, [lever, nailToLeverPivot]);

    Matter.Events.on(engine, "beforeUpdate", () => {
      const forceMagnitude = 0.01;

      const forcePoint = {
        x: lever.position.x + (userInput.length / 2) * Math.cos(lever.angle),
        y: lever.position.y + (userInput.length / 2) * Math.sin(lever.angle),
      };

      const forceVector = {
        x: forceMagnitude * Math.cos(lever.angle + Math.PI / 2),
        y: forceMagnitude * Math.sin(lever.angle + Math.PI / 2),
      };

      Matter.Body.applyForce(lever, forcePoint, forceVector);
    });
  };

  const topic = "torque";

  return (
    <div
      className="simulation-page"
      style={{ display: "flex", height: "700px" }}
    >
      <TorqueInterface userInput={userInput} setUserInput={setUserInput} />
      <BaseSimulation onEngineReady={handleEngineReady} topic={topic} />
    </div>
  );
};

export default Torque;
