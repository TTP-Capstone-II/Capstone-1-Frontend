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
import axios from "axios";
import { API_URL } from "../shared";
import TorqueFormulaDisplay from "../../utils/TorqueFormulaDisplay";
import "../AppStyles.css";

const TorqueInterface = ({ userInput, setUserInput, user, simulation }) => {
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
        topic: "torque",
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
        topic: "torque",
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
        label="Torque"
        type="number"
        name="torque"
        value={userInput.torque}
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
        label="Inertia"
        type="number"
        name="inertia"
        value={userInput.inertia}
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
        label="Angular Acceleration"
        type="number"
        name="angularAcceleration"
        value={userInput.angularAcceleration}
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
        label="Distance from Pivot"
        type="number"
        name="distanceFromPivot"
        value={userInput.distanceFromPivot}
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
        label="Length"
        type="number"
        name="length"
        value={userInput.length}
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
        label="Force"
        type="number"
        name="force"
        value={userInput.force}
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
