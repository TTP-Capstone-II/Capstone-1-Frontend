import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FreeFallMotion } from "../topics/FreeFall";

const FreeFallInterface = ({ userInput, setUserInput }) => {
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

    const calculations = FreeFallMotion({
      gravity: userInput.gravity,
      initialVelocity: userInput.initialVelocity,
      finalVelocity: userInput.finalVelocity,
      initialHeight: userInput.initialHeight,
      finalHeight: userInput.finalHeight,
      time: userInput.time,
      target: userInput.target,
    });
    setResults(calculations);
  }, [
    userInput.target,
    userInput.gravity,
    userInput.initialVelocity,
    userInput.finalVelocity,
    userInput.initialHeight,
    userInput.finalHeight,
    userInput.time,
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
        disabled={userInput.target === "gravity"}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">s</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Initial velocity"
        type="number"
        name="initialVelocity"
        value={userInput.initialVelocity}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        disabled={userInput.target === "initialVelocity"}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Final velocity"
        type="number"
        name="finalVelocity"
        value={userInput.finalVelocity}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        disabled={userInput.target === "finalVelocity"}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m/s</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Initial height"
        type="number"
        name="initialHeight"
        value={userInput.initialHeight}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        disabled={userInput.target === "initialHeight"}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Final height"
        type="number"
        name="finalHeight"
        value={userInput.finalHeight}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        disabled={userInput.target === "finalHeight"}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Time"
        type="number"
        name="time"
        value={userInput.time}
        variant="outlined"
        fullWidth
        inputProps={{ step: "0.01" }} //change soon
        disabled={userInput.target === "time"}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">s</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      {/*<Button 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
      >
        Enter
      </Button> */}

      <InputLabel id="target-label" sx={{ mt: 2 }}>
        Calculate
      </InputLabel>
      <Select
        labelId="target-label"
        label="Calculate"
        name="target"
        value={userInput.target || ""}
        onChange={(e) => setUserInput({ ...userInput, target: e.target.value })}
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="finalVelocity">Final Velocity</MenuItem>
        <MenuItem value="finalHeight">Final Height</MenuItem>
        <MenuItem value="time">Fall Time</MenuItem>
        <MenuItem value="initialVelocity">Start Velocity</MenuItem>
        <MenuItem value="initialHeight">Start Height</MenuItem>
        <MenuItem value="gravity">Gravity</MenuItem>
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

export default FreeFallInterface;