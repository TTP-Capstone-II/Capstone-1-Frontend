import React, { useState, useEffect, useRef, use } from "react";
import socket from "../socket";
import { useParams } from "react-router-dom";
import VoiceChannel from "./VoiceChannel";
import "./WhiteBoardStyles.css";

const WhiteBoard = ({ roomId, user }) => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const contextRef = useRef(null); // Reference to the canvas context
  const isDrawing = useRef(false); // Use a ref to track drawing state
  const prevPoint = useRef({ x: 0, y: 0 });
  const [inviteLink, setInviteLink] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  const [socketID, setSocketID] = useState("");
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(3);
  const [isErasing, setIsErasing] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState([]);

  const username = user.username;

  useEffect(() => {
    const link = `${window.location.origin}/whiteboard/${roomId}`;
    setInviteLink(link); // Set the invite link for the whiteboard room
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(inviteLink) // Copy the invite link to clipboard
      .then(() => {
        alert("Invite link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  const handleDraw = ({ x0, y0, x1, y1, color, size, erasing }) => {
    if (!contextRef.current) return;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x0, y0); // Move to the starting point
    contextRef.current.lineTo(x1, y1); // Draw a line to the end point

    contextRef.current.lineWidth = size;

    if (erasing) {
      contextRef.current.globalCompositeOperation = "destination-out"; // Set to erasing mode
    } else {
      contextRef.current.globalCompositeOperation = "source-over"; // Set to normal drawing mode
      contextRef.current.strokeStyle = color; // Set the stroke color
    }

    contextRef.current.stroke();
    contextRef.current.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = penColor;
    context.lineWidth = penSize;

    contextRef.current = context;

    // Join a room
    if (roomId && username) {
      socket.emit("join-room", {
        roomId,
        username,
        penColor,
      });
    }

    socket.on("my-socket-id", ({ id }) => {
      setSocketID(id);
    });

    socket.on("draw", handleDraw); // Listen for drawing events from the server

    socket.on("user-joined", (data) => {
      setJoinMessage(`${data.username} has joined the room`);
      setTimeout(() => setJoinMessage(""), 3000); // Clear after 3 sec
    });

    socket.on("update-user-list", (users) => {
      setUsersInRoom(users);
    });

    socket.on("clear-canvas", (clearedBy) => {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setJoinMessage(`Canvas cleared by ${clearedBy}`); // Show a message indicating who cleared the canvas
      setTimeout(() => setJoinMessage(""), 3000); // Clear the message after 3 seconds
    });

    return () => {
      socket.off("draw", handleDraw);
      socket.off("join-room", roomId); // Clean up the socket listeners
      socket.off("user-joined");
      socket.off("update-user-list");
      socket.off("clear-canvas");
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
      line: {
        x0,
        y0,
        x1,
        y1,
        color: isErasing ? "erase" : penColor,
        size: penSize,
        erasing: isErasing,
      },
    }); // Emit the drawing event to the server

    prevPoint.current = { x: offsetX, y: offsetY }; // Update the previous point
  }, 10);

  const stopDrawing = () => {
    isDrawing.current = false;
    contextRef.current.closePath(); // Close the current path
  };

  const clearCanvas = () => {
    const confirmClear = window.confirm(
      "This will clear the entire canvas for all participants. Are you sure?"
    );
    if (!confirmClear) return;

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    socket.emit("clear-canvas", roomId); // Notify the server to clear the canvas for all participants
  };

  const erase = () => {
    if (isErasing) {
      setIsErasing(false);
      contextRef.current.globalCompositeOperation = "source-over"; // Reset to normal drawing
    } else {
      setIsErasing(true);
      contextRef.current.globalCompositeOperation = "destination-out";
    }
  };

  return (
    <div>
      <h2>Room Code: {roomId}</h2>
      <button onClick={handleCopyLink}>Copy Invite Link</button>
      <VoiceChannel roomId={roomId} mySocketID={socketID} />
      {joinMessage && <p>{joinMessage}</p>}
      <div className="ColorPicker">
        <label>Pen Color: </label>
        <input
          type="color"
          id="penColor"
          value={penColor}
          onChange={(e) => {
            setPenColor(e.target.value);
            contextRef.current.strokeStyle = e.target.value; // Update the stroke color

            socket.emit("pen-color-change", {
              userId: socket.id,
              penColor: e.target.value,
            });
          }}
        />
      </div>
      <div className="PenSizePicker">
        <label>Pen Size: </label>
        <input
          type="range"
          min="1"
          max="10"
          value={penSize}
          onChange={(e) => {
            setPenSize(e.target.value);
            contextRef.current.lineWidth = e.target.value; // Update the line width
          }}
        />
      </div>
      <div className="EraseButton">
        <button onClick={erase}>
          {isErasing ? "Eraser : on" : "Eraser : off"}
        </button>
      </div>
      <div className="participants">
        <span>{usersInRoom.length} online</span>
        <div className="user-list">
          {usersInRoom.map((u) => (
            <div
              key={u.userId}
              className="user-avatar"
              style={{ backgroundColor: u.penColor }}
              title={u.username}
            >
              <span>{u.username[0].toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
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
