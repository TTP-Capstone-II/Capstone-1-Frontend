import React, { useState, useEffect, useRef, use } from "react";
import socket from "../socket";
import { useParams } from "react-router-dom";

const WhiteBoard = ({ roomId, user }) => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const contextRef = useRef(null); // Reference to the canvas context
  const isDrawing = useRef(false); // Use a ref to track drawing state
  const prevPoint = useRef({ x: 0, y: 0 });
  const [inviteLink, setInviteLink] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  const username = user.username; 

  useEffect(() => {
    const link = `${window.location.origin}/whiteboard/${roomId}`;
    setInviteLink(link); // Set the invite link for the whiteboard room
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink) // Copy the invite link to clipboard
      .then(() => {
        alert("Invite link copied to clipboard!"); 
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err); 
      });
  };

  const handleDraw = ({ x0, y0, x1, y1 }) => {
    if (!contextRef.current) return; 

    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0); // Move to the starting point
    contextRef.current.lineTo(x1, y1); // Draw a line to the end point
    contextRef.current.stroke();
    contextRef.current.closePath(); 
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 3;

    contextRef.current = context;

    // Join a room
    if (roomId && username) {
      socket.emit("join-room", {roomId, username} );
    }

    socket.on("draw", handleDraw); // Listen for drawing events from the server

    socket.on("user-joined", (joinedUsername) => {
        setJoinMessage(`${joinedUsername} has joined the room`);
        setTimeout(() => setJoinMessage(""), 3000); // Clear after 3 sec
      });

    return () => {
      socket.off("draw", handleDraw);
      socket.off("join-room", roomId); // Clean up the socket listeners
      socket.off("user-joined");
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = nativeEvent; // Get the mouse position relative to the canvas
    contextRef.current.beginPath(); // Start a new path
    contextRef.current.moveTo(offsetX, offsetY); // Move the path to the starting point
    prevPoint.current = { x: offsetX, y: offsetY }; // Store the starting point
  };

  const draw = throttle(({ nativeEvent }) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = nativeEvent;
    const { x: x0, y: y0 } = prevPoint.current;
    const x1 = offsetX;
    const y1 = offsetY;

    contextRef.current.lineTo(x1, y1); // Draw a line to the current mouse position
    contextRef.current.stroke(); // Render the stroke

    socket.emit("draw", {
        roomId,
        line: { x0, y0, x1, y1 },
    }); // Emit the drawing event to the server

    prevPoint.current = { x: offsetX, y: offsetY }; // Update the previous point
  },10);

  const stopDrawing = () => {
    isDrawing.current = false;
    contextRef.current.closePath(); // Close the current path
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  return (
    <div>
        <h2>Room Code: {roomId}</h2>
      <button onClick={handleCopyLink}>Copy Invite Link</button>
      {joinMessage && <p>{joinMessage}</p>} 
      <canvas
        ref={canvasRef} // Reference to the canvas element
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />
      <button onClick={clearCanvas}>Clear Canvas</button>
    </div>
  );
};

function throttle(callback, delay) {
  let previousCall = 0;
  return (...args) => {
    const now = new Date().getTime();
    if (now - previousCall >= delay) {
      previousCall = now;
      callback(...args);
    }
  };
}

export default WhiteBoard;
