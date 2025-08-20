import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "../AppStyles.css";

const WhiteboardLanding = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const generateRoomId = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const createRoom = () => {
    const newRoomId = generateRoomId();
    navigate(`/whiteboard/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/whiteboard/${roomId}`);
    } else {
      alert("Please enter a valid room ID.");
    }
  };

  return (
    <div className="whiteboard-page">
      {/* Top-left back link */}
      <div className="top-left">
        <Link to="/" className="back-link">
          ⬅ Back to Home
        </Link>
      </div>

      {/* Top-center title */}
      <h1 className="page-title">Collaborative Whiteboard</h1>

      {/* Centered content (below title) */}
      <div className="center-content">
        <Typography>
          Create a new whiteboard room or join an existing one.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--buttons)",
            color: "#fff",
            '&:hover': { backgroundColor: "var(--buttons-hover)" },
          }}
          onClick={createRoom}
          style={{ margin: "10px 0" }}
        >
          Create New Room
        </Button>

        <Typography>OR</Typography>

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ padding: "8px", width: "200px", marginRight: "10px" }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--buttons)",
              color: "#fff",
              '&:hover': { backgroundColor: "var(--buttons-hover)" },
            }}
            onClick={joinRoom}
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );



};

export default WhiteboardLanding;
