import React, { useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import Matter from "matter-js";
import { Engine, Render, World, Runner } from "matter-js";
import { Button } from "@mui/material";

const BaseSimulation = () => {
    return (
        <div className="base-simulation">
            <h2>Base Simulation</h2>
            <p>This is a placeholder for the base simulation component.</p>
            <p>It will render the simulation canvas and controls.</p>
        </div>
    );
}
    

export default BaseSimulation;