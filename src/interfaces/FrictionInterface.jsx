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
import { Friction } from "../topics/Friction";
import { API_URL } from "../shared";
import axios from "axios";
import "../AppStyles.css";
import FrictionFormulaDisplay from "../../utils/frictionFormulaDisplay";

const FrictionInterface = ({ userInput, setUserInput, user, simulation }) => {
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
        topic: "friction",
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
        topic: "friction",
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

    const calculations = Friction({
      gravity: userInput.gravity,
      mass: userInput.mass,
      friction: userInput.friction,
      angle: userInput.angle,
      target: userInput.target,
      time: userInput.time,
      distance: userInput.distance,
    });
    setResults(calculations);
  }, [
    userInput.target,
    userInput.gravity,
    userInput.mass,
    userInput.friction,
    userInput.angle,
    userInput.time,
    userInput.distance,
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
        backgroundColor: "var(--interface-color)",
      }}
    >
      <Button variant="contained" sx={{ backgroundColor: "var(--buttons)", color: "#fff", '&:hover': { backgroundColor: "var(--buttons-hover)" }, }} onClick={handleOpen}>Save</Button>
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
          backgroundColor: 'var(--interface-color)',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" color="var(--text)">
            Are you sure you want to save this simulation?
          </Typography>
          <TextField
            label="Simulation title"
            value={forum}
            onChange={(e) => setForum(e.target.value)}
            fullWidth
            InputProps={{
              style: {
                color: "var(--text)",
                backgroundColor: "var(--interface-color)",
              },
            }}
            InputLabelProps={{
              style: {
                color: "var(--text)",
              },
            }}
          />
          <Button id="modal-modal-description" sx={{ mt: 2, backgroundColor: "var(--buttons)", color: "#fff", '&:hover': { backgroundColor: "var(--buttons-hover)" }, }} onClick={handleSaveOrUpdate}>
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
        inputProps={{
          step: "0.01",
          style: {
            color: "var(--text)",
            backgroundColor: "var(--interface-color)",
          },
        }}
        InputLabelProps={{
          style: {
            color: "var(--text)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: 'var(--text)' }}>s</span>
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
      />
      <TextField
        label="Mass"
        type="number"
        name="mass"
        value={userInput.mass}
        variant="outlined"
        inputProps={{
          step: "0.01",
          style: {
            color: "var(--text)",
            backgroundColor: "var(--interface-color)",
          },
        }}
        InputLabelProps={{
          style: {
            color: "var(--text)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: 'var(--text)' }}>s</span>
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
      />
      <TextField
        label="Angle"
        type="number"
        name="angle"
        value={userInput.angle}
        variant="outlined"
        inputProps={{
          step: "0.01",
          style: {
            color: "var(--text)",
            backgroundColor: "var(--interface-color)",
          },
        }}
        InputLabelProps={{
          style: {
            color: "var(--text)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: 'var(--text)' }}>s</span>
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
      />
      <TextField
        label="Friction"
        type="number"
        name="friction"
        value={userInput.friction}
        variant="outlined"
        inputProps={{
          step: "0.01",
          style: {
            color: "var(--text)",
            backgroundColor: "var(--interface-color)",
          },
        }}
        InputLabelProps={{
          style: {
            color: "var(--text)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: 'var(--text)' }}>s</span>
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
      />
      <TextField
        label="Distance"
        type="number"
        name="distance"
        value={userInput.distance || ""}
        variant="outlined"
        inputProps={{
          step: "0.01",
          style: {
            color: "var(--text)",
            backgroundColor: "var(--interface-color)",
          },
        }}
        InputLabelProps={{
          style: {
            color: "var(--text)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: 'var(--text)' }}>s</span>
            </InputAdornment>
          ),
        }}
        onChange={handleInputChange}
      />
      <TextField
        label="Time"
        type="number"
        name="time"
        value={userInput.time || ""}
        variant="outlined"
        inputProps={{
          step: "0.01",
          style: {
            color: "var(--text)",
            backgroundColor: "var(--interface-color)",
          },
        }}
        InputLabelProps={{
          style: {
            color: "var(--text)",
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <span style={{ color: 'var(--text)' }}>s</span>
            </InputAdornment>
          ),
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
        sx={{ mt: 2, backgroundColor: "var(--interface-color)", color: "var(--text)" }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "var(--interface-color)",
              color: "var(--text)",
            }
          }
        }}
      >
        <MenuItem value="frictionForce">Friction Force</MenuItem>
        <MenuItem value="normalForce">Normal Force</MenuItem>
        <MenuItem value="netForce">Net Force</MenuItem>
        <MenuItem value="parallelForce">Parallel Force</MenuItem>
        <MenuItem value="acceleration">Acceleration</MenuItem>
        <MenuItem value="time">Time</MenuItem>
        <MenuItem value="distance">Distance</MenuItem>
        <MenuItem value="all">All</MenuItem>
      </Select>

      <FormControlLabel
        control={
          <Switch
            checked={showFormulas}
            onChange={() => setShowFormulas(!showFormulas)}
            color="primary"
          />
        }
        sx={{
          color: 'var(--text)',
          '& .MuiSwitch-root': {
            color: 'var(--text)',
          },
        }}
        label="Show Formulas"
      />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Results:
      </Typography>
      {showFormulas && results && userInput?.target && (
        <FrictionFormulaDisplay
          topic="friction"
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

export default FrictionInterface;
