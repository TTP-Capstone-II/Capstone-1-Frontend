import React, { useState } from "react";
import BaseSimulation from "../components/BaseSimulation";
import InertiaInterface from "../interfaces/InertiaInterface";
import Matter from "matter-js";
import { Engine, Render, Bodies, World, Runner, Mouse, MouseConstraint, Avatar } from "matter-js";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const Inertia = ({ user }) => {
    const location = useLocation();
    const simulation = location.state?.simulation;
    const [userInput, setUserInput] = useState(
        simulation?.storedValues || {
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
    });

    const leftWall = Matter.Bodies.rectangle(0, 350, 20, 700, {
        isStatic: true,
        restitution: 0.1,       // Perfectly elastic bounce
        friction: 0,
        render: { fillStyle: 'black' }
    });

    const rightWall = Matter.Bodies.rectangle(1000, 350, 20, 700, {
        isStatic: true,
        restitution: 0.1,       // Perfectly elastic bounce
        friction: 0,
        render: { fillStyle: 'black' }
    });


    const handleEngineReady = (engine, world) => {
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

    };

    return (
        <div className="simulation-page" style={{ display: 'flex', height: '700px' }}>
            <InertiaInterface userInput={userInput} setUserInput={setUserInput} user={user} simulation={simulation}/>
            <BaseSimulation onEngineReady={handleEngineReady} />
        </div>
    );
};

export default Inertia;
