import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FreeFallInterface from "../interfaces/FreeFallInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint } from "matter-js";
import { Button } from "@mui/material";

const Friction = () => {
    const [userInput, setUserInput] = useState({
        gravity: "9.81",
        initialVelocity: "0",
        finalVelocity: "",
        initialPosition: "50",
        finalPosition: "0",
        time: ""
    });

    const leftWall = Matter.Bodies.rectangle(0, 350, 20, 700, {
        isStatic: true,
        restitution: 1,       // Perfectly elastic bounce
        friction: 0,
        render: { fillStyle: 'black' }
    });


    const handleEngineReady = (engine, world) => {
        const square = Matter.Bodies.rectangle(50, userInput.initialPosition, 50, 50, {
            mass: 1,
            friction: 0,        // Kinetic friction
            frictionAir: 0,     // Air friction
            restitution: 1
        });

        const square2 = Matter.Bodies.rectangle(150, userInput.initialPosition, 50, 50, {
            mass: 100,
            friction: 0,        // Kinetic friction
            frictionAir: 0,     // Air friction
            restitution: 1
        });

        engine.world.gravity.y = Number(userInput.gravity) / 9.81;
        World.add(world, square);
        World.add(world, square2);
        World.add(world, leftWall);

        
        const forceMagnitude = 0.02 * square.mass;
        const forceMagnitude2 = 0.02 * square2.mass;
        Matter.Body.applyForce(square, square.position, { x: forceMagnitude, y: 0 });
        Matter.Body.applyForce(square2, square2.position, { x: -forceMagnitude2, y: 0 });

    };

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <FreeFallInterface userInput={userInput} setUserInput={setUserInput} />
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default Friction;
