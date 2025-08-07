import React, {useEffect, useRef} from "react";

const WhiteBoard = () => {
    const canvasRef = useRef(null); // Reference to the canvas element
    const contextRef = useRef(null); // Reference to the canvas context
    const isDrawing = useRef(false); // Use a ref to track drawing state

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

    const startDrawing = ({nativeEvent}) => {
        isDrawing.current = true;
        const {offsetX, offsetY} = nativeEvent; // Get the mouse position relative to the canvas
        contextRef.current.beginPath(); // Start a new path
        contextRef.current.moveTo(offsetX, offsetY); // Move the path to the starting point
    }

    const draw = ({nativeEvent}) => {
        if (!isDrawing.current) return; 
        const {offsetX, offsetY} = nativeEvent; 
        contextRef.current.lineTo(offsetX, offsetY); // Draw a line to the current mouse position
        contextRef.current.stroke(); // Render the stroke
    }

    const stopDrawing = () => {
        isDrawing.current = false;
        contextRef.current.closePath(); // Close the current path
    }

    const clearCanvas = () => {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); 
    }


    return (
        <div>
            <canvas
                ref={canvasRef} // Reference to the canvas element
                onMouseDown={startDrawing} 
                onMouseMove={draw} 
                onMouseUp={stopDrawing} 
                onMouseLeave={stopDrawing} 
                style={{border: "1px solid black", cursor: "crosshair"}} 
            />
            <button onClick={clearCanvas}>Clear Canvas</button>
        </div>
    );
}

export default WhiteBoard;