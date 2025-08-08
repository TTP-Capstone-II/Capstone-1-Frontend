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
    distanceFromPivot: 300,
    angle: 90,
    force: undefined,
    target: undefined,
  });

  const handleEngineReady = (engine, world) => {
    var group = Body.nextGroup(true),
      length = userInput.distanceFromPivot,
      height = 30;

    const nail = { x: 400, y: 300 };
    const lever = Bodies.rectangle(
      nail.x + userInput.distanceFromPivot / 2,
      nail.y,
      userInput.distanceFromPivot,
      height,
      {
        density: 0.01,
        frictionAir: 1,
        collisionFilter: { group: group },
      }
    );

    const nailToLeverPivot = Constraint.create({
      pointA: nail,
      bodyB: lever,
      pointB: { x: -userInput.distanceFromPivot / 2, y: 0 },
      stiffness: 1,
      length: 0,
    });

    // --- Force Arrow ---
    const arrowLength = 100;
    const arrowRadius = 20;
    const arrowHeight = 10;

    // Align the arrow with the right end of the lever
    const arrowBaseX = nail.x + length + 10;
    const arrowY = nail.y + height; // just below the lever

    const arrowAnchorX = nail.x + length * 0.9; // roughly lever right end (same as pointA.x)
    const arrowAnchorY = nail.y;

    /*
    const arrowHead = Bodies.polygon(
      arrowBaseX + arrowRadius * 2,
      arrowY,
      3,
      arrowRadius,
      {
        density: 0.01,
        frictionAir: 1,
        collisionFilter: { group },
      }
    );

    Body.rotate(arrowHead, Math.PI);
    */
    const angleRad = toRadians(userInput.angle);

    const arrowCenterX = arrowAnchorX + (arrowLength / 2) * Math.cos(angleRad);
    const arrowCenterY = arrowAnchorY + (arrowLength / 2) * Math.sin(angleRad);

    const arrowBody = Bodies.rectangle(
      arrowCenterX,
      arrowCenterY,
      arrowLength,
      arrowHeight,
      {
        density: 0.01,
        frictionAir: 1,
        collisionFilter: { group },
      }
    );

    // Compound the arrow parts
    /*
    const arrow = Body.create({
      parts: [arrowBody, arrowHead],
      density: 0.01,
      frictionAir: 1,
      collisionFilter: { group },
    });
    */

    //Body.setAngle(arrowBody, toRadians(userInput.angle));

    // Constraint from right end of lever to left end of arrow
    const secondPivot = Constraint.create({
      bodyA: lever,
      pointA: { x: (length / 2) * 0.9, y: 0 }, // right end of lever
      bodyB: arrowBody,
      pointB: { x: -arrowLength / 2, y: 0 }, // left end of arrow body
      stiffness: 1,
      length: 0,
      angularStiffness: 0.4,
      angleA: 180,
      angleB: angleRad,
    });

    // Final setup
    engine.world.gravity.y = 0;

    World.add(world, [lever, arrowBody, nailToLeverPivot, secondPivot]);
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
