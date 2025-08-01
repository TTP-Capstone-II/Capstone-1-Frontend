import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import FreeFallInterface from "../interfaces/FreeFallInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint } from "matter-js";
import { Button } from "@mui/material";

const FreeFall = () => {
    const [userInput, setUserInput] = useState({
        gravity: "9.81",
        initialVelocity: "0",
        finalVelocity: "",
        initialHeight: "",
        finalHeight: "0",
        time: "",
        target: "",
    });

    const handleEngineReady = (engine, world) => {
        const square = Matter.Bodies.rectangle(200, userInput.initialHeight, 50, 50);

        
        World.add(world, square);

    };

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <FreeFallInterface userInput={userInput} setUserInput={setUserInput} />
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default FreeFall;
