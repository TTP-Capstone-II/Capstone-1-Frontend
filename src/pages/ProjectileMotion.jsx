import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import ProjectileMotionInterface from "../interfaces/ProjectileMotionInterface";
import Matter from "matter-js";
import {
  Engine,
  Render,
  Bodies,
  World,
  Runner,
  Mouse,
  MouseConstraint,
} from "matter-js";
import { Button } from "@mui/material";

const ProjectileMotion = () => {
  const [userInput, setUserInput] = useState({
    gravity: "9.81",
    initialVelocity: "",
    launchAngle: "",
    initialHeight: "",
    target: "",
  });

  //console.log("Initial Velocity Input:", userInput.initialVelocity);

  const angle = Number(userInput.launchAngle) * (Math.PI / 180);
  const velocity = Number(userInput.initialVelocity);

  //console.log("Parsed Velocity:", velocity);

  const initialVelocityX = velocity * Math.cos(angle);
  const initialVelocityY = velocity * Math.sin(angle);

  //console.log({ initialVelocityX, initialVelocityY });

  const handleEngineReady = (engine, world) => {
    const ball = Bodies.circle(50, 390, 30, {
      friction: 0.1,
      frictionAir: 0.01,
      restitution: 0.2,
    });
    Matter.Body.setVelocity(ball, {
      x: initialVelocityX,
      y: -initialVelocityY,
    });
    Matter.Body.setPosition(ball, { x: 50, y: userInput.initialHeight });

    // Add gravity
    engine.world.gravity.y = Number(userInput.gravity) / 9.81;

    World.add(world, ball);
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

export default ProjectileMotion;
