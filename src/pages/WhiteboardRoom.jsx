import React from "react";
import { useParams, Link } from "react-router-dom";
import WhiteBoard from "../components/WhiteBoard";
import "../AppStyles.css";

const WhiteboardRoom = ({user}) => {
    const { roomId } = useParams();

  return (
    <div style={{ padding: "1rem" }}>
      <Link to="/" style={{ textDecoration: "underline", color: "var(--buttons)" }}>
        ⬅ Back to Home
      </Link>

      <div >
        <WhiteBoard roomId={roomId} user={user}/>
      </div>
    </div>
  );
};

export default WhiteboardRoom;
