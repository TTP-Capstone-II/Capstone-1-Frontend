import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
<<<<<<< Updated upstream
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
=======
import InertiaInterface from "../interfaces/InertiaInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint, Avatar } from "matter-js";
import { Button } from "@mui/material";

const Inertia = () => {
    const [userInput, setUserInput] = useState({
        gravity: "9.81",
        square1_mass: "0",
        square1_initialAcceleration: "0",
        square1_finalVelocity: "",
        square1_initialPosition: "50",
        square1_finalPosition: "0",
        square2_mass: "0",
        square2_initialAcceleration: "0",
        square2_finalVelocity: "",
        square2_initialPosition: "500",
        square2_finalPosition: "0",
        time: "",
>>>>>>> Stashed changes
    });

    const leftWall = Matter.Bodies.rectangle(0, 350, 20, 700, {
        isStatic: true,
<<<<<<< Updated upstream
        restitution: 1,       // Perfectly elastic bounce
=======
        restitution: 0.1,       // Perfectly elastic bounce
        friction: 0,
        render: { fillStyle: 'black' }
    });

    const rightWall = Matter.Bodies.rectangle(1000, 350, 20, 700, {
        isStatic: true,
        restitution: 0.1,       // Perfectly elastic bounce
>>>>>>> Stashed changes
        friction: 0,
        render: { fillStyle: 'black' }
    });


    const handleEngineReady = (engine, world) => {
<<<<<<< Updated upstream
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

=======
        const square = Matter.Bodies.rectangle(Number(userInput.square1_initialPosition), 650, 50, 50, {
            mass: Number(userInput.square1_mass),
            isStatic: false,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            restitution: 1, // For perfectly elastic collisions
            inertia: Infinity // To prevent rotation
        });

        const square2 = Matter.Bodies.rectangle(Number(userInput.square2_initialPosition), 650, 50, 50, {
            mass: Number(userInput.square2_mass),
            isStatic: false,
            friction: 0,
            frictionAir: 0,
            frictionStatic: 0,
            restitution: 1, // For perfectly elastic collisions
            inertia: Infinity // To prevent rotation
        });



        engine.world.gravity.y = Number(userInput.gravity);
        World.add(world, square);
        World.add(world, square2);
        World.add(world, leftWall);
        World.add(world, rightWall);


        const forceMagnitude = (userInput.square1_initialAcceleration / 100) * square.mass;
        const forceMagnitude2 = (userInput.square2_initialAcceleration / 100) * square2.mass;
        Matter.Body.applyForce(square, square.position, { x: forceMagnitude, y: 0 });
        Matter.Body.applyForce(square2, square2.position, { x: -forceMagnitude2, y: 0 });

        Matter.Events.on(engine, "collisionStart", (event) => {
            for (let pair of event.pairs) {
                const { bodyA, bodyB } = pair;

                const collided =
                    (bodyA === square && bodyB === square2) ||
                    (bodyA === square2 && bodyB === square);

                if (collided) {
                    console.log("Collision detected — freezing only square1");

                    setTimeout(() => {
                        Matter.Body.setVelocity(square, { x: 0, y: 0 });
                        Matter.Body.setAngularVelocity(square, 0);
                    }, 0);
                }
            }
        });

>>>>>>> Stashed changes
    };

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
<<<<<<< Updated upstream
            <FreeFallInterface userInput={userInput} setUserInput={setUserInput} />
=======
            <InertiaInterface userInput={userInput} setUserInput={setUserInput} />
>>>>>>> Stashed changes
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

<<<<<<< Updated upstream
export default Friction;
=======
export default Inertia;
>>>>>>> Stashed changes
