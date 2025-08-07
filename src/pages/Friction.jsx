import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FrictionInterface from "../interfaces/FrictionInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint } from "matter-js";
import { Button } from "@mui/material";

const Friction = () => {
    const [userInput, setUserInput] = useState({
        gravity: "9.81",
        mass: "5",
        friction: "0.005",
        angle: "30",
    });

const handleEngineReady = (engine, world) => {
    const slopeAngle = (parseFloat(userInput.angle) * Math.PI) / 180; // Convert to radians

    // Create the slope body (width reduced to make it fit within canvas size)
    const slope = Matter.Bodies.rectangle(500, 690, 2000, 20, { // Reduced width from 2000 to 1000
        angle: slopeAngle,
        isStatic: true
    });
    World.add(world, slope);

    // Calculate the left side of the slope's position (adjusting for the smaller slope width)
    const slopeLeftX = 500 - 500; // Leftmost point of the slope, now centered at 500 with a width of 1000
    const slopeLeftY = 690 - Math.tan(slopeAngle) * 500; // Correct Y position for the left side of the slope

    // Debugging: log calculated values for the slope
    console.log("Slope Left X:", slopeLeftX);
    console.log("Slope Left Y:", slopeLeftY);

    // Declare square positions with `let` to allow reassigning
    let squareX = slopeLeftX + 25; // 25px offset to the right of the leftmost point
    let squareY = slopeLeftY - 30; // 30px above the leftmost point of the slope

    // Debugging: log square position to verify it is within bounds
    console.log("Square Position X:", squareX, "Y:", squareY);

    // Ensure the square is within the bounds of the canvas
    if (squareX < 0 || squareX > 1000 || squareY < 0 || squareY > 700) {
        console.log("Square is out of bounds, adjusting position.");
        squareX = 200; // Adjust X to be within canvas bounds
        squareY = 200; // Adjust Y to be within canvas bounds
    }

    const square = Matter.Bodies.rectangle(squareX, squareY, 50, 50, {
        mass: parseFloat(userInput.mass), 
        friction: parseFloat(userInput.friction), // Kinetic friction
        frictionAir: 0.05, // Air friction
        frictionStatic: 0.01
    });

    // Reset gravity to normal (9.81 m/s^2)
    engine.world.gravity.y = 1; // Normal gravity

    // Add the square to the world
    World.add(world, square);
};







    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <FrictionInterface userInput={userInput} setUserInput={setUserInput} />
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default Friction;
