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

const FreeFallInterface = ({ userInput, setUserInput, runSimulation }) => {
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: parseFloat(value),
    });
  };

  const validateInputs = () => {
    const {
      gravity,
      initialVelocity,
      finalVelocity,
      initialHeight,
      finalHeight,
      time,
      target,
    } = userInput;

    if (!target) return "Please select a value to calculate.";

    // Common helper
    const isNum = (val) => typeof val === "number" && !isNaN(val);

    // Validation per target
    switch (target) {
      case "finalVelocity":
        if (
          !isNum(gravity) ||
          !isNum(initialVelocity) ||
          (!isNum(time) && !isNum(initialHeight) && !isNum(finalHeight))
        ) {
          return "To calculate final velocity, you need gravity, initial velocity, and either time OR both heights.";
        }
        break;

      case "time":
        if (
          !isNum(gravity) ||
          !isNum(initialVelocity) ||
          (!isNum(finalVelocity) &&
            (!isNum(initialHeight) || !isNum(finalHeight)))
        ) {
          return "To calculate time, you need gravity, initial velocity, and either final velocity OR both heights.";
        }
        break;

      case "finalHeight":
        if (
          !isNum(initialHeight) ||
          !isNum(initialVelocity) ||
          !isNum(time) ||
          !isNum(gravity)
        ) {
          return "To calculate final height, you need initial height, initial velocity, gravity, and time.";
        }
        break;

      case "initialVelocity":
        if (!isNum(finalVelocity) || !isNum(gravity) || !isNum(time)) {
          return "To calculate initial velocity, you need final velocity, gravity, and time.";
        }
        break;

      case "initialHeight":
        if (
          !isNum(finalHeight) ||
          !isNum(initialVelocity) ||
          !isNum(time) ||
          !isNum(gravity)
        ) {
          return "To calculate initial height, you need final height, initial velocity, gravity, and time.";
        }
        break;

      case "gravity":
        if (!isNum(finalVelocity) || !isNum(initialVelocity) || !isNum(time)) {
          return "To calculate gravity, you need initial velocity, final velocity, and time.";
        }
        break;

      case "All":
        return null; // Assume calculation handles missing values
    }

    return null; // ✅ Valid
  };

  const runSimulation = () => {
    const error = validateInputs();
    if (error) {
      setResults(error); // Show error in the result box
      return;
    }

    const handleStart = () => {
      const error = validateInputs();
      if (error) {
        setResults(error);
        return;
      }

      const result = runSimulation(); // 🔁 Call parent to compute & trigger simulation
      setResults(result);
    };

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
  };

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
      <Button
        variant="contained"
        color="primary"
        onClick={handleStart}
        sx={{ mt: 2 }}
      >
        Start Simulation
      </Button>
      ;
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
