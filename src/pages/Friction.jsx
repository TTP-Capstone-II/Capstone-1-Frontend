import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FrictionInterface from "../interfaces/FrictionInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint } from "matter-js";
<<<<<<< Updated upstream
import { Button } from "@mui/material";
=======
>>>>>>> Stashed changes

const Friction = () => {
    const [userInput, setUserInput] = useState({
        gravity: "9.81",
        mass: "5",
        friction: "0.005",
        angle: "30",
    });

<<<<<<< Updated upstream
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






=======
    const handleEngineReady = (engine, world) => {
        const canvasWidth = 1000;
        const canvasHeight = 700;
        const offsetY = -250;
        const offsetSpecialY = 100;
        const offsetSpecialX = -100;

        const angleDegOriginal = parseFloat(userInput.angle);

        const angleDeg = angleDegOriginal > 90 ? angleDegOriginal - 180 : angleDegOriginal;
        const slopeAngle = (angleDeg * Math.PI) / 180;

        const slopeLength = 1000;

        let slopeCenterX, slopeCenterY;
        let endX, endY;

        if (angleDegOriginal <= 90) {
            endX = 0;
            endY = canvasHeight - 50;

            if (angleDegOriginal >= 11 && angleDegOriginal <= 16) {
                slopeCenterX = endX + (slopeLength / 2) * Math.cos(slopeAngle) + offsetSpecialX;
                slopeCenterY = endY + (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY;
            }
            else if (angleDegOriginal >= 4 && angleDegOriginal <= 10) {
                slopeCenterX = endX + (slopeLength / 2) * Math.cos(slopeAngle) + offsetSpecialX;
                slopeCenterY = endY + (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY + 125;
            }
            else if (angleDegOriginal >= 2 && angleDegOriginal <= 3) {
                slopeCenterX = endX + (slopeLength / 2) * Math.cos(slopeAngle) + offsetSpecialX;
                slopeCenterY = endY + (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY + 155;
            }
            else if (angleDegOriginal == 1) {
                slopeCenterX = endX + (slopeLength / 2) * Math.cos(slopeAngle) + offsetSpecialX;
                slopeCenterY = endY + (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY + 173;
            }
            else {
                slopeCenterX = endX + (slopeLength / 2) * Math.cos(slopeAngle);
                slopeCenterY = endY + (slopeLength / 2) * Math.sin(slopeAngle) + offsetY;
            }
        } else {
            endX = canvasWidth;
            endY = canvasHeight - 50;

            if ((angleDegOriginal >= 164 && angleDegOriginal <= 169)) {
                slopeCenterX = endX - (slopeLength / 2) * Math.cos(slopeAngle) - offsetSpecialX;
                slopeCenterY = endY - (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY;
            } else if ((angleDegOriginal >= 170 && angleDegOriginal <= 176)) {
                slopeCenterX = endX - (slopeLength / 2) * Math.cos(slopeAngle) - offsetSpecialX;
                slopeCenterY = endY - (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY + 125;
            } else if ((angleDegOriginal >= 177 && angleDegOriginal <= 178)) {
                slopeCenterX = endX - (slopeLength / 2) * Math.cos(slopeAngle) - offsetSpecialX;
                slopeCenterY = endY - (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY + 155;
            } else if (angleDegOriginal === 179) {
                slopeCenterX = endX - (slopeLength / 2) * Math.cos(slopeAngle) - offsetSpecialX;
                slopeCenterY = endY - (slopeLength / 2) * Math.sin(slopeAngle) + offsetY + offsetSpecialY + 173;
            } else {
                slopeCenterX = endX - (slopeLength / 2) * Math.cos(slopeAngle);
                slopeCenterY = endY - (slopeLength / 2) * Math.sin(slopeAngle) + offsetY;
            }
        }

        const slope = Matter.Bodies.rectangle(slopeCenterX, slopeCenterY, slopeLength, 20, {
            angle: slopeAngle,
            isStatic: true,
        });
        World.add(world, slope);

        let squareX, squareY;
        if (angleDegOriginal <= 90) {
            squareX = endX + 25 * Math.cos(slopeAngle);
            squareY = endY + 25 * Math.sin(slopeAngle) - 30 + offsetY;
        } else {
            squareX = endX - 25 * Math.cos(slopeAngle);
            squareY = endY - 25 * Math.sin(slopeAngle) - 30 + offsetY;
        }

        squareX = Math.min(Math.max(squareX, 25), canvasWidth - 25);
        squareY = Math.min(Math.max(squareY, 25), canvasHeight - 25);

        const square = Matter.Bodies.rectangle(squareX, squareY, 50, 50, {
            mass: parseFloat(userInput.mass),
            friction: parseFloat(userInput.friction),
            frictionAir: 0.05,
            frictionStatic: 0.01,
        });

        engine.world.gravity.y = 1;
        World.add(world, square);
    };
>>>>>>> Stashed changes

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <FrictionInterface userInput={userInput} setUserInput={setUserInput} />
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default Friction;
