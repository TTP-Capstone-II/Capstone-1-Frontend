import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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
      }}
    >
      <CardContent>
        <Typography variant="h6">
          {forumTitle}
        </Typography>
        <Typography variant="caption">
          {topic}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            mt: 1,
          }}
        >
          {JSON.stringify(simulation.storedValues, null, 2)}
        </Typography>

        <Button
          variant="outlined"
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
