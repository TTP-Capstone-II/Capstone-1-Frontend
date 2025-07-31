import React, {
  useCallback,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import Matter from "matter-js";
import { Engine, Render, World, Runner, Bodies } from "matter-js";
import { Button, TextField } from "@mui/material";
import FreeFallInterface from "../interfaces/FreeFallInterface";

const BaseSimulation = () => {
  const canvasRef = useRef(null); // Ref for the DOM element where Matter.js will render
  const engineRef = useRef(Engine.create()); // Ref to hold the Matter.js engine instance
  const renderRef = useRef(); // Ref to hold the Matter.js renderer instance
  const runnerRef = useRef(); // Ref to hold the Matter.js runner instance
  const rectRef = useRef(null);
  const xInputRef = useRef();
  const yInputRef = useRef();
  const engine = engineRef.current;
  const world = engine.world;

  const [userInput, setUserInput] = useState({
    gravity: "9.81",
    initialVelocity: "",
    finalVelocity: "",
    initialPosition: "",
    finalPosition: "",
    time: "",
  });

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
    if (world) {
      World.clear(world, false);
    }

    // Create a renderer
    renderRef.current = Render.create({
      element: canvasRef.current, // Render to the div referenced by canvasRef
      engine: engine,
      options: {
        width: 1000,
        height: 700,
        wireframes: false, // Show solid bodies
        background: "#f0f0f0",
      },
    });

    // Add a ground body
    World.add(world, Bodies.rectangle(400, 690, 1200, 20, { isStatic: true }));

    rectRef.current = Bodies.rectangle(400, 50, 80, 80);

    // Add some falling boxes
    World.add(world, [
      rectRef.current,
      Bodies.rectangle(450, 150, 80, 80),
      Bodies.rectangle(480, 60, 60, 60),
    ]);

    // Run the renderer
    Render.run(renderRef.current);

    // Create and run the engine runner
    runnerRef.current = Runner.create();
    Runner.run(runnerRef.current, engine);
  });

  useEffect(() => {
    setupMatter();
    // Cleanup function when the component unmounts
    return () => {
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (renderRef.current) Render.stop(renderRef.current);
      if (engineRef.current) Engine.clear(engineRef.current);
      if (renderRef.current && renderRef.current.canvas) {
        renderRef.current.canvas.remove();
      }
      if (world.current) World.clear(world);
      if (engine.current) Engine.clear(engine);
      renderRef.current.canvas.remove(); // Remove the canvas element
    };
  }, [setupMatter]); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    console.log(userInput.gravity);
  }, [userInput]);

  const handleReset = () => {
    setupMatter();
  };

  const handlePosition = () => {
    const rect = rectRef.current;
    if (!rect) return;

    const x = parseFloat(xInputRef.current.value);
    const y = parseFloat(yInputRef.current.value);

    if (!isNaN(x) && !isNaN(y)) {
      Matter.Body.setPosition(rect, { x, y });
    }
  };

  return (
    <div style={{ display: "flex", height: "700px" }}>
      {/* Small container for the button */}
      <div style={{ width: "auto", margin: "10px auto" }}>
        <Button onClick={handleReset}>Reset Simulation</Button>
      </div>
      <FreeFallInterface userInput={userInput} setUserInput={setUserInput} />
      {/* Matter.js will render a canvas inside this div */}
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          backgroundColor: "#f0f0f0",
          width: "100%",
        }}
      />
    </div>
  );
};

export default BaseSimulation;
