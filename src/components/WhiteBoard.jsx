import React, {useEffect, useRef} from "react";

const WhiteBoard = () => {
    const canvasRef = useRef(null); // Reference to the canvas element
    const contextRef = useRef(null); // Reference to the canvas context

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 3;

        contextRef.current = context;
    }, []);
}

export default WhiteBoard;