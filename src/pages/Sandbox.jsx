import React, { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import SandboxInterface from "../interfaces/SandboxInterface";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";

const Sandbox = ({ user }) => {
    const location = useLocation();
    const simulation = location.state?.simulation;
    const [userInput, setUserInput] = useState(
        simulation?.storedValues || {
            gravity: "9.81",
        }
    );

    const engineRef = useRef(null);
    const worldRef = useRef(null);
    const sceneRef = useRef(null);

    const [objects, setObjects] = useState([]); // Track created objects

    // Initialize Matter.js engine and renderer, including mouse drag
    useEffect(() => {
        const engine = Matter.Engine.create();
        const world = engine.world;

        world.gravity.y = Number(userInput.gravity) / 9.81;

        const render = Matter.Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 1000,
                height: 700,
                wireframes: false,
                background: "#BDBDA3",
            },
        });

        const leftWall = Matter.Bodies.rectangle(0, 350, 20, 700, {
            isStatic: true,
            restitution: 1,   // Perfectly elastic bounce
            friction: 0,
            render: { fillStyle: "#042851" }
        });

        const rightWall = Matter.Bodies.rectangle(1000, 350, 20, 700, {
            isStatic: true,
            restitution: 1,   // Perfectly elastic bounce
            friction: 0,
            render: { fillStyle: "#042851" }
        });

        const topWall = Matter.Bodies.rectangle(500, 0, 1200, 20, {
            isStatic: true,
            restitution: 1,   // Perfectly elastic bounce
            friction: 0,
            render: { fillStyle: "#042851" }
        });

        // Add ground
        Matter.World.add(world, Matter.Bodies.rectangle(500, 690, 1200, 20, { isStatic: true, restitution: 0.8, render: { fillStyle: "#042851"} }));
        Matter.World.add(world, leftWall);
        Matter.World.add(world, rightWall);
        Matter.World.add(world, topWall);

        const rampVertices = [];
        const startX = 400;
        const startY = 450;
        const width = 300;
        const height = 150;
        const steps = 20;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = startX + width * t;
            // Quadratic curve example y = startY + height * (t^2)
            const y = startY + height * (t * t);
            rampVertices.push({ x, y });
        }
        // Close the polygon at the bottom:
        rampVertices.push({ x: startX + width, y: startY + height + 20 });
        rampVertices.push({ x: startX, y: startY + height + 20 });


        const ramp = Matter.Bodies.fromVertices(550, 350, [rampVertices], {
            isStatic: false,
            render: { fillStyle: 'brown' }
        }, true);

        Matter.Composite.add(world, ramp);

        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false },
            },
        });
        Matter.World.add(world, mouseConstraint);
        render.mouse = mouse;

        Matter.Render.run(render);
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        engineRef.current = engine;
        worldRef.current = world;

        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.World.clear(world, false);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, [userInput.gravity]);

    // Generalized object creator
    const handleCreateShape = (shapeData) => {
        const world = worldRef.current;
        const engine = engineRef.current;

        if (world && engine) {
            const { x, y, width, height, radius, mass, angle, isStatic = false, type } = shapeData;
            const color = shapeData.color || "#4a90e2";

            let body;
            if (type === "circle") {
                if ([x, y, radius, mass].some((v) => typeof v !== "number" || isNaN(v))) {
                    console.warn("Invalid circle data, skipping creation.");
                    return;
                }

                body = Matter.Bodies.circle(x, y, radius, {
                    mass,
                    isStatic,
                    restitution: 0.8,
                    render: { fillStyle: color },
                });
            } else {
                if ([x, y, width, height, mass, angle].some((v) => typeof v !== "number" || isNaN(v))) {
                    console.warn("Invalid rectangle data, skipping creation.");
                    return;
                }

                body = Matter.Bodies.rectangle(x, y, width, height, {
                    mass,
                    angle: (angle * Math.PI) / 180,
                    isStatic,
                    restitution: 0.8,
                    render: { fillStyle: color },
                });
            }

            Matter.World.add(world, body);

            // Count number of each type
            const shapeCount = objects.filter((obj) => obj.data.type === type).length;

            const newObj = {
                id: Date.now(),
                name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${shapeCount + 1}`,
                data: { ...shapeData },
                body,
            };

            setObjects((prev) => [...prev, newObj]);
        }
    };



    // Update object properties & Matter.js body
    const handleUpdateObject = (id, newData) => {
        const essentialFields = ["x", "y", "mass"];
        const hasInvalid = essentialFields.some(
            (key) => newData[key] === "" || isNaN(newData[key])
        );

        // For rectangles
        if (newData.type === "rectangle") {
            if (
                hasInvalid ||
                newData.width === "" ||
                newData.height === "" ||
                isNaN(newData.width) ||
                isNaN(newData.height)
            ) {
                return;
            }
        }

        // For circles
        if (newData.type === "circle") {
            if (
                hasInvalid ||
                newData.radius === "" ||
                isNaN(newData.radius)
            ) {
                return;
            }
        }
        setObjects((prev) =>
            prev.map((obj) => {
                if (obj.id !== id) return obj;

                const { type } = obj.data;
                const world = worldRef.current;
                const oldBody = obj.body;

                // Shared properties
                const {
                    x,
                    y,
                    mass,
                    isStatic,
                    color,
                    angle,
                    width,
                    height,
                    radius,
                } = newData;

                // Determine if a dimension change requires replacing the body
                const needsReplace =
                    (type === "rectangle" &&
                        (width !== obj.data.width || height !== obj.data.height)) ||
                    (type === "circle" && radius !== obj.data.radius);

                if (needsReplace) {
                    Matter.World.remove(world, oldBody);

                    let newBody;
                    if (type === "circle") {
                        newBody = Matter.Bodies.circle(x, y, radius, {
                            mass,
                            isStatic,
                            restitution: 0.8,
                            render: { fillStyle: color },
                        });
                    } else {
                        newBody = Matter.Bodies.rectangle(x, y, width, height, {
                            mass,
                            angle: (angle * Math.PI) / 180,
                            isStatic,
                            restitution: 0.8,
                            render: { fillStyle: color },
                        });
                    }

                    Matter.World.add(world, newBody);

                    return {
                        ...obj,
                        body: newBody,
                        data: { ...newData },
                    };
                } else {
                    // Update body without replacing
                    Matter.Body.setPosition(oldBody, { x, y });
                    Matter.Body.setMass(oldBody, mass);
                    Matter.Body.setStatic(oldBody, !!isStatic);
                    oldBody.render.fillStyle = color;

                    if (type === "rectangle") {
                        Matter.Body.setAngle(oldBody, (angle * Math.PI) / 180);
                    }

                    return {
                        ...obj,
                        data: { ...newData },
                    };
                }
            })
        );
    };

    // Delete an object & remove its body from world
    const handleDeleteObject = (id) => {
        setObjects((prev) => {
            const objToRemove = prev.find((obj) => obj.id === id);
            if (objToRemove) {
                // Remove from Matter.js world
                Matter.World.remove(worldRef.current, objToRemove.body);
            }
            // Remove from state
            return prev.filter((obj) => obj.id !== id);
        });
    };

    return (
        <div style={{ display: "flex", height: "700px", alignItems: "flex-start" }}>
            <SandboxInterface
                userInput={userInput}
                setUserInput={setUserInput}
                user={user}
                simulation={simulation}
                onCreateShape={handleCreateShape}
                objects={objects}
                onUpdateObject={handleUpdateObject}
                onDeleteObject={handleDeleteObject}
            />

            <div style={{ display: "flex", flexDirection: "column", marginLeft: "20px" }}>
                <div style={{ width: "auto", margin: "10px auto" }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#073E7B",color: "#fff",'&:hover': {backgroundColor: '#042851' }, }}
                        onClick={() => {
                            // Reset simulation: clear all objects and reset engine/world
                            objects.forEach((obj) => {
                                Matter.World.remove(worldRef.current, obj.body);
                            });
                            setObjects([]);
                        }}
                    >
                        Reset Simulation
                    </Button>
                </div>

                <div
                    ref={sceneRef}
                    style={{
                        width: 1000,
                        height: 700,
                        backgroundColor: "#BDBDA3",
                    }}
                />
            </div>
        </div>
    );

};

export default Sandbox;
