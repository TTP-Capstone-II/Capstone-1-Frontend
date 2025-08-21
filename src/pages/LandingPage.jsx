import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import {
    Button,
    TextField,
    Paper,
    Typography,
    InputAdornment,
    InputLabel,
    Select,
    MenuItem,
    Modal,
    Box,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import "../AppStyles.css";

const LandingPage = ({ user }) => {
    const sceneRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Events = Matter.Events,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Common = Matter.Common,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            Bodies = Matter.Bodies;

        const engine = Engine.create();
        const world = engine.world;
        engineRef.current = engine;

        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showAngleIndicator: true,
                wireframes: false,
                background: "var(--background-canvas)",
            }
        });

        Render.run(render);

        const runner = Runner.create();
        Runner.run(runner, engine);

        const wallsCanvasColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--walls-canvas')
            .trim();
        // boundaries
        Composite.add(world, [
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true, render: { fillStyle: wallsCanvasColor } }),
            Bodies.rectangle(400, 600, 800, 50, { isStatic: true, render: { fillStyle: wallsCanvasColor } }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true, render: { fillStyle: wallsCanvasColor } }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true, render: { fillStyle: wallsCanvasColor } })
        ]);

        // explosion logic
        const explosion = function (engine, delta) {
            const timeScale = (1000 / 60) / delta;
            const bodies = Composite.allBodies(engine.world);

            for (let i = 0; i < bodies.length; i++) {
                const body = bodies[i];

                if (!body.isStatic && body.position.y >= 500) {
                    const forceMagnitude = (0.05 * body.mass) * timeScale;
                    Body.applyForce(body, body.position, {
                        x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                        y: -forceMagnitude + Common.random() * -forceMagnitude
                    });
                }
            }
        };

        let timeScaleTarget = 1;
        let lastTime = Common.now();

        Events.on(engine, "afterUpdate", function (event) {
            const timeScale = (event.delta || (1000 / 60)) / 1000;
            engine.timing.timeScale += (timeScaleTarget - engine.timing.timeScale) * 12 * timeScale;

            if (Common.now() - lastTime >= 2000) {
                timeScaleTarget = timeScaleTarget < 1 ? 1 : 0;
                explosion(engine, event.delta);
                lastTime = Common.now();
            }
        });

        const bodyOptions = {
            frictionAir: 0,
            friction: 0.0001,
            restitution: 0.8
        };

        Composite.add(world, Composites.stack(20, 100, 15, 3, 20, 40, function (x, y) {
            return Bodies.circle(x, y, Common.random(10, 20), bodyOptions);
        }));

        Composite.add(world, Composites.stack(50, 50, 8, 3, 0, 0, function (x, y) {
            switch (Math.round(Common.random(0, 1))) {
                case 0:
                    return Common.random() < 0.8
                        ? Bodies.rectangle(x, y, Common.random(20, 50), Common.random(20, 50), bodyOptions)
                        : Bodies.rectangle(x, y, Common.random(80, 120), Common.random(20, 30), bodyOptions);
                case 1:
                    return Bodies.polygon(x, y, Math.round(Common.random(4, 8)), Common.random(20, 50), bodyOptions);
            }
        }));

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        Composite.add(world, mouseConstraint);
        render.mouse = mouse;

        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        });

        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.World.clear(world);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom sx={{ color: "var(--text)" }}>
                Welcome to Newton's Playground!
            </Typography>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
                <div ref={sceneRef} style={{ flexShrink: 0, marginLeft: "0px" }} />

                <Paper elevation={3} style={{ marginLeft: "20px", padding: "20px", maxWidth: "450px", height: "600px", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "var(--interface-color)" }}>
                    <div>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            About This Project
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', mb: 2 }}>
                            This simulation uses Matter.js to demonstrate physics interactions.
                            You can drag and interact with the objects on the canvas.
                            This simulation is only an example and not a fully interactive one.
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', mb: 2 }}>
                            After creating an account you will be sent to the sandbox, where you can create objects,
                            interact with them by moving them with your mouse or change the position in the interface,
                            make them static, change their color and more!
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', mb: 2 }}>
                            In the navbar, you can access all the interactive simulations, your profile page, the whiteboard and the forum.
                            Every interactive simulation can be saved to your profile and used as the sandbox.
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', mb: 2 }}>
                            The forums and the whiteboard are collaborative tools where you can post questions, help others,
                            and work together in real-time responses using the forum replies or the whiteboard drawing tools and voice chat.
                        </Typography>
                    </div>
                    <div style={{ display: "flex" }}>
                        <Button
                            variant="contained"
                            component={NavLink}
                            to="/signup"
                            sx={{
                                width: "400px",
                                height: "45px",
                                fontSize: "1.1rem",
                                backgroundColor: "var(--buttons)",
                                color: "#fff",
                                '&:hover': {
                                    backgroundColor: 'var(--buttons-hover)'
                                },
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            Get Started
                        </Button>
                    </div>
                </Paper>
            </div>
        </div>
    );

};

export default LandingPage;
