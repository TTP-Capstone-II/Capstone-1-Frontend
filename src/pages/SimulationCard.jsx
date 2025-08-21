import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../AppStyles.css";

const SimulationCard = ({ simulation, username, forumTitle, topic, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${topic}`, { state: { simulation } });
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        cursor: "pointer",
        height: "300px",
        width: "350px",
        "&:hover": {
          boxShadow: 4,
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "var(--buttons)",
      }}
    >
      <CardContent>
        <Typography variant="h6" color="var(--text)">
          {forumTitle}
        </Typography>
        <Typography variant="caption" color="var(--text)">
          {topic}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-wrap",
            color: "var(--text)",
            wordBreak: "break-word",
            mt: 1,
          }}
        >
          Created by: {username}
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{ mt: 2 }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimulationCard;
