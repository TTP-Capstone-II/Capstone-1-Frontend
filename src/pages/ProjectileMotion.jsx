import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import ProjectileMotionInterface from "../interfaces/ProjectileMotionInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint } from "matter-js";
import { Button } from "@mui/material";

const ProjectileMotion = () => {
    const [userInput, setUserInput] = useState({
        gravity: "9.81",
        initialVelocity: "",
        launchAngle: "",
        initialHeight: "",
    });


    const handleEngineReady = (engine, world) => {
        const square = Matter.Bodies.rectangle(200, userInput.initialPosition, 50, 50);

        
        World.add(world, square);

    };

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <ProjectileMotionInterface userInput={userInput} setUserInput={setUserInput} />
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default ProjectileMotion;
