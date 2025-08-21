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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { FreeFallMotion } from "../topics/FreeFall";
import { API_URL } from "../shared";
import axios from "axios";
import "../AppStyles.css";
import FreeFallFormulaDisplay from "../../utils/FreeFallFormulaDisplay";

const FreeFallInterface = ({ userInput, setUserInput, user, simulation }) => {
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
        label="Initial velocity"
        type="number"
        name="initialVelocity"
        value={userInput.initialVelocity}
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
        label="Final velocity"
        type="number"
        name="finalVelocity"
        value={userInput.finalVelocity}
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
        label="Initial height"
        type="number"
        name="initialHeight"
        value={userInput.initialHeight}
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
        label="Final height"
        type="number"
        name="finalHeight"
        value={userInput.finalHeight}
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
        value={userInput.time}
        variant="outlined"
        fullWidth
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

      <InputLabel id="target-label" sx={{ mt: 2, backgroundColor: "var(--interface-color)" }}>
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
        sx={{ mb: 2, backgroundColor: "var(--interface-color)", color: "var(--text)" }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "var(--interface-color)",
              color: "var(--text)",
            }
          }
        }}
      >
        <MenuItem value="finalVelocity">Final Velocity</MenuItem>
        <MenuItem value="finalHeight">Final Height</MenuItem>
        <MenuItem value="time">Fall Time</MenuItem>
        <MenuItem value="initialVelocity">Start Velocity</MenuItem>
        <MenuItem value="initialHeight">Start Height</MenuItem>
        <MenuItem value="gravity">Gravity</MenuItem>
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
        <FreeFallFormulaDisplay
          topic="freeFall"
          target={userInput.target}
          results={results}
          userInput={userInput}
        />
      )}
      <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
        <Typography variant="subtitle1">Calculated Results:</Typography>
        {results ? (
          <>
            {results.finalVelocity && (
              <Typography variant="body2">
                Final Velocity: {Number(results.finalVelocity).toFixed(2)} m/s
              </Typography>
            )}
            {results.finalHeight && (
              <Typography variant="body2">
                Final Height: {Number(results.finalHeight).toFixed(2)} m
              </Typography>
            )}
            {results.time && (
              <Typography variant="body2">
                Fall Time: {(Array.isArray(results.time) ? results.time.map(t => Number(t).toFixed(2)).filter(t => t > 0).join(", ") : Number(results.time).toFixed(2))} s
              </Typography>
            )}
            {results.initialVelocity && (
              <Typography variant="body2">
                Initial Velocity: {Number(results.initialVelocity).toFixed(2)} m/s
              </Typography>
            )}
            {results.initialHeight && (
              <Typography variant="body2">
                Initial Height: {Number(results.initialHeight).toFixed(2)} m
              </Typography>
            )}
            {results.gravity && (
              <Typography variant="body2">
                Gravity: {Number(results.gravity).toFixed(2)} m/s²
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

export default FreeFallInterface;