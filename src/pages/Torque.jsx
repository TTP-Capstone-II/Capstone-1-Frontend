import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import TorqueInterface from "../interfaces/TorqueInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Constraint, Body } from "matter-js";
import { Button } from "@mui/material";
import { toRadians } from "../../utils/formulas";
import { useLocation } from "react-router-dom";

const Torque = ({ user }) => {
  const location = useLocation();
  const simulation = location.state?.simulation;
  const [userInput, setUserInput] = useState(
    simulation?.storedValues || {
      torque: undefined,
      inertia: undefined,
      angularAcceleration: undefined,
      distanceFromPivot: undefined,
      length: 300,
      angle: 90,
      force: undefined,
      target: undefined,
    }
  );

  const maxForce = 10000;
  const height = 30;
  const angleInRadians = toRadians(userInput.angle);

  const handleEngineReady = (engine, world, render) => {
    const nail = { x: 400, y: 300 };
    const lever = Bodies.rectangle(
      nail.x + userInput.length / 2,
      nail.y,
      userInput.length,
      height,
      {
        density: 0.01,
        frictionAir: 0.001,
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
      const forceMagnitude = Math.min(userInput.force / maxForce, 1);
      const distance = Math.min(userInput.distanceFromPivot, userInput.length);

      const pivot = {
        x: lever.position.x - (userInput.length / 2) * Math.cos(lever.angle),
        y: lever.position.y - (userInput.length / 2) * Math.sin(lever.angle),
      };

      const forcePoint = {
        x: pivot.x + distance * Math.cos(lever.angle),
        y: pivot.y + distance * Math.sin(lever.angle),
      };

      const forceVector = {
        x: forceMagnitude * Math.cos(lever.angle + angleInRadians),
        y: forceMagnitude * Math.sin(lever.angle + angleInRadians),
      };

      Matter.Body.applyForce(lever, forcePoint, forceVector);
    });

    // Visualization of the force vector
    Matter.Events.on(render, "afterRender", () => {
      const context = render.context;

      const pivot = {
        x: lever.position.x - (userInput.length / 2) * Math.cos(lever.angle),
        y: lever.position.y - (userInput.length / 2) * Math.sin(lever.angle),
      };

      const distance = Math.min(userInput.distanceFromPivot, userInput.length);

      const forcePoint = {
        x: pivot.x + distance * Math.cos(lever.angle),
        y: pivot.y + distance * Math.sin(lever.angle),
      };

      const forceMagnitude = userInput.force * 1.2;

      const forceVector = {
        x: forceMagnitude * Math.cos(lever.angle + angleInRadians),
        y: forceMagnitude * Math.sin(lever.angle + angleInRadians),
      };

      const bodyEnd = {
        x: forcePoint.x + forceVector.x,
        y: forcePoint.y + forceVector.y,
      };

      context.beginPath();
      context.moveTo(forcePoint.x, forcePoint.y);
      context.lineTo(bodyEnd.x, bodyEnd.y);
      context.strokeStyle = "red";
      context.lineWidth = 3;
      context.stroke();

      const angle = Math.atan2(forceVector.y, forceVector.x);

      context.beginPath();
      context.moveTo(bodyEnd.x, bodyEnd.y);
      const height = 10;
      const length = 10;
      const tip = bodyEnd;

      //left side
      context.lineTo(
        tip.x - length * Math.cos(angle - Math.PI / 2),
        tip.y - length * Math.sin(angle - Math.PI / 2)
      );

      context.lineTo(
        tip.x + height * Math.cos(angle),
        tip.y + height * Math.sin(angle)
      );
      context.closePath();

      context.strokeStyle = "black";
      context.lineWidth = 1;
      context.stroke();
      context.fillStyle = "black";
      context.fill();

      // Right side
      context.beginPath();
      context.moveTo(bodyEnd.x, bodyEnd.y);
      context.lineTo(
        tip.x + length * Math.cos(angle - Math.PI / 2),
        tip.y + length * Math.sin(angle - Math.PI / 2)
      );
      context.lineTo(
        tip.x + height * Math.cos(angle),
        tip.y + height * Math.sin(angle)
      );

      context.closePath();
      context.strokeStyle = "black";
      context.lineWidth = 1;
      context.stroke();
      context.fillStyle = "black";
      context.fill();

      // Angle Arc
      if (userInput.angle !== 90) {
        context.beginPath();
        context.arc(forcePoint.x, forcePoint.y, 20, lever.angle, angle);
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.stroke();
      } else {
        context.save();
        context.translate(forcePoint.x, forcePoint.y);
        context.rotate(angle);
        context.beginPath();
        context.strokeStyle = "black";
        context.lineWidth = 3;
        context.strokeRect(0, -15.5, 15, 15);
        context.restore();
      }
    });
  };

  return (
    <div
      className="simulation-page"
      style={{ display: "flex", height: "700px" }}
    >
      <TorqueInterface userInput={userInput} setUserInput={setUserInput} user={user} simulation={simulation}/>
      <BaseSimulation onEngineReady={handleEngineReady} />
    </div>
  );
};

export default Torque;
