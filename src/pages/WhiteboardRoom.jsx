import React from "react";
import { useParams, Link } from "react-router-dom";
import WhiteBoard from "../components/WhiteBoard";

const WhiteboardRoom = () => {
    const { roomId } = useParams();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Whiteboard</h1>

      <Link to="/" style={{ textDecoration: "underline", color: "blue" }}>
        ⬅ Back to Home
      </Link>

      <div >
        <WhiteBoard roomId={roomId}/>
      </div>
    </div>
  );
};

export default WhiteboardRoom;
