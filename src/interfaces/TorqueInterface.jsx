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
  Modal,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Torque } from "../topics/Torque";
import TorqueFormulaDisplay from "../../utils/TorqueFormulaDisplay";

const TorqueInterface = ({ userInput, setUserInput }) => {
  const [results, setResults] = useState(null);
  const [showFormulas, setShowFormulas] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: parseFloat(value),
    });
  };

  useEffect(() => {
    if (!userInput.target) return;

    const calculations = Torque({
      torque: userInput.torque,
      inertia: userInput.inertia,
      angularAcceleration: userInput.angularAcceleration,
      distanceFromPivot: userInput.distanceFromPivot,
      angle: userInput.angle,
      force: userInput.force,
      target: userInput.target,
    });
    setResults(calculations);
  }, [
    userInput.torque,
    userInput.inertia,
    userInput.angularAcceleration,
    userInput.distanceFromPivot,
    userInput.length,
    userInput.angle,
    userInput.force,
    userInput.target,
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
        label="Inertia"
        type="number"
        name="inertia"
        value={userInput.inertia}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">kg*m^2</InputAdornment>
            ),
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
        label="Distance from Pivot"
        type="number"
        name="distanceFromPivot"
        value={userInput.distanceFromPivot}
        variant="outlined"
        inputProps={{ step: "10" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
          },
        }}
        onChange={handleInputChange}
      />

      <TextField
        label="Length"
        type="number"
        name="length"
        value={userInput.length}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
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
        <MenuItem value="torque">Torque</MenuItem>
        <MenuItem value="angularAcceleration">Angular Acceleration</MenuItem>
        <MenuItem value="distanceFromPivot">Distance from Pivot</MenuItem>
        <MenuItem value="angle">Angle</MenuItem>
        <MenuItem value="force">Force</MenuItem>
        <MenuItem value="All">All</MenuItem>
      </Select>

      <FormControlLabel
        control={
          <Switch
            checked={showFormulas}
            onChange={() => setShowFormulas(!showFormulas)}
            color="primary"
          />
        }
        label="Show Formulas"
      />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Results:
      </Typography>
      {showFormulas && results && userInput?.target && (
        <TorqueFormulaDisplay
          topic="torque"
          target={userInput.target}
          results={results}
          userInput={userInput}
        />
      )}
      <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="subtitle1">Calculated Results:</Typography>
        {results ? (
          <>
            {results.torque && (
              <Typography variant="body2">
                Torque: {Number(results.torque).toFixed(2)} N·m
              </Typography>
            )}
            {results.angularAcceleration && (
              <Typography variant="body2">
                Angular Acceleration: {Number(results.angularAcceleration).toFixed(2)} rad/s²
              </Typography>
            )}
            {results.distanceFromPivot && (
              <Typography variant="body2">
                Distance from Pivot: {Number(results.distanceFromPivot).toFixed(2)} m
              </Typography>
            )}
            {results.angle && Number.isFinite(Number(results.angle)) && (
              <Typography variant="body2">
                Angle: {Number(results.angle).toFixed(2)} °
              </Typography>
            )}
            {results.angle && !Number.isFinite(Number(results.angle)) && (
              <Typography variant="body2">
                Angle: Invalid (check inputs)
              </Typography>
            )}
            {results.force && (
              <Typography variant="body2">
                Force: {Number(results.force).toFixed(2)} N
              </Typography>
            )}
            {!Object.keys(results).length && (
              <Typography variant="body2">No valid results</Typography>
            )}
          </>
        ) : (
          <Typography variant="body2">No results yet</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TorqueInterface;
