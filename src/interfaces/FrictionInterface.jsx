import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Select,
  InputAdornment,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import { Friction } from "../topics/Friction";

const ProjectileMotionInterface = ({ userInput, setUserInput }) => {
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: parseFloat(value),
    });
  };

  useEffect(() => {
    if (!userInput.target) return;

    const calculations = ProjectileMotion({
      gravity: userInput.gravity,
      mass: userInput.mass,
      friction: userInput.friction,
      angle: userInput.angle,
      target: userInput.target,
    });
    setResults(calculations);
  }, [
    userInput.target,
    userInput.gravity,
    userInput.mass,
    userInput.friction,
    userInput.angle,
  ]);

  return (
    <Paper
      elevation={3}
      sx={{
        marginTop: 7,
        width: 300,
        height: "100%",
        padding: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
      }}
    >
      <TextField
        label="Acceleration due to gravity (g)"
        type="number"
        name="gravity"
        value={userInput.gravity}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">s</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Mass"
        type="number"
        name="mass"
        value={userInput.mass}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Angle"
        type="number"
        name="angle"
        value={userInput.angle}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">°</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Friction"
        type="number"
        name="friction"
        value={userInput.friction}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">N</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />
      <InputLabel id="target-label">Calculate</InputLabel>
      <Select
        label="Calculate"
        name="target"
        value={userInput.target}
        onChange={(e) => setUserInput({ ...userInput, target: e.target.value })}
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
      >
        <MenuItem value="range">Friction Force</MenuItem>
        <MenuItem value="timeOfFlight">Acceleration</MenuItem>
        <MenuItem value="maxHeight">Distance</MenuItem>
        <MenuItem value="velocityComponents">Velocity Components</MenuItem>
        <MenuItem value="All">All</MenuItem>
      </Select>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Results:
      </Typography>
      <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {results
          ? JSON.stringify(
              results,
              (key, value) => {
                if (typeof value === "number") {
                  return Number(value.toFixed(2));
                }
                return value;
              },
              2
            )
          : "No results yet"}
      </pre>
    </Paper>
  );
};

export default ProjectileMotionInterface;
