import React, { useCallback, useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import {
  Engine,
  Render,
  Bodies,
  World,
  Runner,
  Mouse,
  MouseConstraint,
} from "matter-js";
import { Button } from "@mui/material";

const Simulation = ({ onEngineReady }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(Engine.create());
  const renderRef = useRef();
  const runnerRef = useRef();

  const engine = engineRef.current;
  const world = engine.world;

  const setupMatter = useCallback(() => {
    if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
    if (renderRef.current) Matter.Render.stop(renderRef.current);
    if (engineRef.current) Matter.Engine.clear(engineRef.current);

    if (renderRef.current && renderRef.current.canvas) {
      renderRef.current.canvas.remove();
      renderRef.current.canvas = null;
      renderRef.current.context = null;
      renderRef.current.textures = {};
    }

    World.clear(world, false);

    // Create a new renderer
    renderRef.current = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 1000,
        height: 700,
        wireframes: false,
        background: "#f0f0f0",
      },
    });

    // Add ground
    World.add(world, Bodies.rectangle(500, 690, 1200, 20, { isStatic: true }));

    // Create mouse
    const mouse = Mouse.create(renderRef.current.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    World.add(world, mouseConstraint);

    // Link mouse to render
    renderRef.current.mouse = mouse;

    // Run renderer and engine
    Render.run(renderRef.current);
    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engine);

    // Expose engine/world to parent
    if (onEngineReady) {
      onEngineReady(engine, world);
    }
  }, [engine, world, onEngineReady]);

  useEffect(() => {
    setupMatter();
    return () => {
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (renderRef.current) Render.stop(renderRef.current);
      if (engineRef.current) Engine.clear(engineRef.current);
      if (renderRef.current?.canvas) renderRef.current.canvas.remove();
      World.clear(world);
    };
  }, [setupMatter, world]);

  return (
    <div style={{ display: "flex", height: "700px" }}>
      <div
        style={{
          width: "1000px",
          height: "700px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          marginLeft: "20px",
        }}
      >
        <div style={{ width: "auto", margin: "10px auto" }}>
          <Button onClick={setupMatter}>Reset Simulation</Button>
        </div>

        <div
          ref={canvasRef}
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default Simulation;
