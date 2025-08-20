import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FreeFallInterface from "../interfaces/FreeFallInterface";
import Matter from "matter-js";
import { useLocation } from "react-router-dom";
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

const FreeFall = ({ user }) => {
  const location = useLocation();
  const simulation = location.state?.simulation;
  const [userInput, setUserInput] = useState(
    simulation?.storedValues || {
      gravity: "9.81",
      initialVelocity: "0",
      finalVelocity: "",
      initialHeight: "700",
      finalHeight: "0",
      time: "",
      target: "",
    }
  );

  const handleEngineReady = (engine, world) => {
    const square = Matter.Bodies.rectangle(
      500,
      650 - userInput.initialHeight,
      50,
      50
    );

    Matter.Body.setVelocity(square, {x: 0, y: userInput.initialVelocity});

    engine.world.gravity.y = Number(userInput.gravity) / 9.81;

Matter.Events.on(engine, "beforeUpdate", () => {
    if (square.position.y >= 675 - userInput.finalHeight) {
      Matter.Body.setVelocity(square, { x: 0, y: 0 });
      Matter.Body.setPosition(square, { x: square.position.x, y: 675 - userInput.finalHeight});
      square.isStatic = true;
    }
  });


    World.add(world, square);
  };

  return (
    <div
      className="simulation-page"
      style={{ display: "flex", height: "700px" }}
    >
      <FreeFallInterface userInput={userInput} setUserInput={setUserInput} user={user} simulation={simulation} />
      <BaseSimulation onEngineReady={handleEngineReady} />
    </div>
  );
};

export default FreeFall;
