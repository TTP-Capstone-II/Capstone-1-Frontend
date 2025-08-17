import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FrictionInterface from "../interfaces/FrictionInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint } from "matter-js";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const Friction = ({ user }) => {
    const location = useLocation();
    const simulation = location.state?.simulation;
    const [userInput, setUserInput] = useState(
        simulation?.storedValues || {
            gravity: 9.81,
            mass: 5,
            friction: 0.005,
            angle: 30,
            distance: "",
            time: ""
        }
    );

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

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <FrictionInterface userInput={userInput} setUserInput={setUserInput} user={user} simulation={simulation} />
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default Friction;
