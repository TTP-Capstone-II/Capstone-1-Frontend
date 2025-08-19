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
import { ProjectileMotion } from "../topics/ProjectileMotion";
import { API_URL } from "../shared";
import axios from "axios";
import FormulaDisplay from "../../utils/formulaDisplay";

const ProjectileMotionInterface = ({ userInput, setUserInput, user, simulation }) => {
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [forum, setForum] = useState("");
  const [showFormulas, setShowFormulas] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/simulation`, {
        userId: user.id,
        forumTitle: forum,
        topic: "projectile-motion",
        storedValues: userInput,
      });

      const savedSim = response.data;
      console.log("Simulation saved:", savedSim);

      setForum("");
      setOpen(false);
    } catch (error) {
      console.error("Error saving simulation:", error.response?.data || error.message);
    }
  };

  const handlePatch = async () => {
    try {
      const response = await axios.patch(`${API_URL}/api/simulation/${simulation.id}`, {
        storedValues: userInput,
        forumTitle: forum,
        topic: "projectile-motion",
      });

      console.log("Simulation updated:", response.data);
      setOpen(false);
    } catch (error) {
      console.error("Error updating simulation:", error.response?.data || error.message);
    }
  };

  const handleSaveOrUpdate = (e) => {
    e.preventDefault();

    if (simulation) {
      handlePatch();
    } else {
      handleSave(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({
      ...userInput,
      [name]: value === "" ? "" : parseFloat(value) || 0,
    });
  };

  useEffect(() => {
    if (simulation) {
      setForum(simulation.forumTitle || "");
    }

    if (!userInput.target) return;

    const calculations = ProjectileMotion({
      gravity: userInput.gravity,
      initialVelocity: userInput.initialVelocity,
      launchAngle: userInput.launchAngle,
      initialHeight: userInput.initialHeight,
      target: userInput.target,
    });
    setResults(calculations);
  }, [
    userInput?.target,
    userInput?.gravity,
    userInput?.initialVelocity,
    userInput?.launchAngle,
    userInput?.initialHeight,
    simulation,
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
      <Button onClick={handleOpen}>Save</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to save this simulation?
          </Typography>
          <TextField
            label="Simulation title"
            value={forum}
            onChange={(e) => setForum(e.target.value)}
            fullWidth
          />
          <Button id="modal-modal-description" sx={{ mt: 2 }} onClick={handleSaveOrUpdate}>
            {simulation ? "Update Simulation" : "Save Simulation"}
          </Button>
        </Box>
      </Modal>
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
        label="Initial velocity"
        type="number"
        name="initialVelocity"
        value={userInput.initialVelocity}
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
        label="Launch angle"
        type="number"
        name="launchAngle"
        value={userInput.launchAngle}
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
        label="Initial height"
        type="number"
        name="initialHeight"
        value={userInput.initialHeight}
        variant="outlined"
        inputProps={{ step: "0.01" }} //change soon
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">m</InputAdornment>,
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
        <FormulaDisplay
          topic="projectile-motion"
          target={userInput.target}
          results={results}
          userInput={userInput}
        />
      )}
      <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="subtitle1">Calculated Results:</Typography>
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {results
            ? JSON.stringify(
                results,
                (key, value) => (typeof value === "number" ? Number(value.toFixed(2)) : value),
                2
              )
            : "No results yet"}
        </pre>
      </Box>
    </Paper>
  );
};

export default ProjectileMotionInterface;
