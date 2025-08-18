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
  Modal,
  Box,
} from "@mui/material";
import { FreeFallMotion } from "../topics/FreeFall";
import { API_URL } from "../shared";
import axios from "axios";

const FreeFallInterface = ({ userInput, setUserInput, user, simulation }) => {
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [forum, setForum] = useState("");
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/simulation`, {
        userId: user.id,
        forumTitle: forum,
        topic: "free-fall",
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
        topic: "free-fall",
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
      [name]: parseFloat(value),
    });
  };

  useEffect(() => {
    if (simulation) {
      setForum(simulation.forumTitle || "");
    }
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

    setUserInput(prev => ({
    ...prev,
    ...Object.fromEntries(
      Object.entries(calculations).filter(([k, v]) => v !== undefined && v !== null)
    )
  }));
  }, [
    userInput.target,
    userInput.gravity,
    userInput.initialVelocity,
    userInput.finalVelocity,
    userInput.initialHeight,
    userInput.finalHeight,
    userInput.time,
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
            endAdornment: <InputAdornment position="end">m/s²</InputAdornment>,
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
        label="Final velocity"
        type="number"
        name="finalVelocity"
        value={userInput.finalVelocity}
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

      <TextField
        label="Final height"
        type="number"
        name="finalHeight"
        value={userInput.finalHeight}
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
        label="Time"
        type="number"
        name="time"
        value={userInput.time}
        variant="outlined"
        fullWidth
        inputProps={{ step: "0.01" }} //change soon
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