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
import { Torque } from "../topics/Torque";

const TorqueInterface = ({ userInput, setUserInput }) => {
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

    const calculations = Torque({});
    setResults(calculations);
  }, []);

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
        label="Torque"
        type="number"
        name="torque"
        value={userInput.torque}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">N·m</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Angular velocity"
        type="number"
        name="angularVelocity"
        value={userInput.angularVelocity}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Angular Acceleration"
        type="number"
        name="angularAcceleration"
        value={userInput.angularAcceleration}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m/s^2</InputAdornment>,
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
        label="Force"
        type="number"
        name="force"
        value={userInput.force}
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
        <MenuItem value="range">Range</MenuItem>
        <MenuItem value="timeOfFlight">Time of Flight</MenuItem>
        <MenuItem value="maxHeight">Maximum Height</MenuItem>
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

export default TorqueInterface;
