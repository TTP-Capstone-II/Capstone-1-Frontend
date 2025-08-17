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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MathJaxContext } from "better-react-mathjax";
import { Friction } from "../topics/Friction";
import { API_URL } from "../shared";
import axios from "axios";
import { 
  FormulaDisplay, 
  getFrictionFormulasForTarget 
} from "../../utils/latexTemplates";

const FrictionInterface = ({ userInput, setUserInput, user, simulation }) => {
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [forum, setForum] = useState("");
  const [showFormulas, setShowFormulas] = useState(true);
  const [showBaseFormula, setShowBaseFormula] = useState(true);
  const [formulas, setFormulas] = useState([]);

  const mathJaxConfig = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]]
    }
  };

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

  // Function to get the appropriate function name based on target
  const getFunctionName = (target) => {
    const targetMap = {
      frictionForce: 'calculateFrictionForce',
      normalForce: 'calculateNormalForce',
      netForce: 'calculateNetForce',
      parallelForce: 'calculateParallelForce',
      acceleration: 'calculateAcceleration',
      time: 'calculateTime',
      distance: 'calculateDistance'
    };
    
    const mapped = targetMap[target];
    if (!mapped) {
      console.warn(`Unknown target: ${target}, using as-is`);
      return target;
    }
    
    return mapped;
  };

  // Function to generate formulas for display
  const generateFormulas = (target, userInput, results) => {
    if (!target || !results) {
      console.warn('Missing target or results for formula generation');
      return [];
    }
  
    try {
      if (target === 'all') {
        // Generate formulas for all calculations
        const allFormulas = [];
        const targets = ['normalForce', 'frictionForce', 'parallelForce', 'netForce', 'acceleration', 'distance', 'time'];
        
        targets.forEach(t => {
          try {
            const functionName = getFunctionName(t);
            let targetResult;
            
            // Handle different result structures
            if (typeof results === 'object' && results !== null) {
              targetResult = results[t] ?? results;
            } else {
              targetResult = results;
            }
            
            // Skip if no result for this target
            if (targetResult === undefined || targetResult === null) return;
            
            const formulaData = getFrictionFormulasForTarget(functionName, userInput, targetResult);
            if (formulaData && formulaData.length > 0) {
              allFormulas.push(...formulaData);
            }
          } catch (error) {
            console.warn(`Error generating formula for ${t}:`, error);
          }
        });
        
        return allFormulas;
      } else {
        // Generate formula for specific target
        const functionName = getFunctionName(target);
        let targetResult;
        
        // Handle different result structures more robustly
        if (typeof results === 'object' && results !== null) {
          targetResult = results[target] ?? results;
        } else {
          targetResult = results;
        }
        
        return getFrictionFormulasForTarget(functionName, userInput, targetResult);
      }
    } catch (error) {
      console.error('Error in generateFormulas:', error);
      return [];
    }
  };

  useEffect(() => {
    if (simulation) {
      setForum(simulation.forumTitle || "");
    }

    // Add validation for required inputs
    if (!userInput.target || 
        userInput.gravity === undefined || 
        userInput.mass === undefined ||
        userInput.friction === undefined ||
        userInput.angle === undefined) {
      console.log('Missing required inputs, skipping calculation');
      setResults(null);
      setFormulas([]);
      return;
    }

    try {
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

      // Generate formulas with proper parameter mapping
      const formulaData = generateFormulas(userInput.target, {
        mass: userInput.mass,
        gravity: userInput.gravity,
        angle: userInput.angle,
        frictionCoefficient: userInput.friction,
        time: userInput.time,
        distance: userInput.distance,
        // Add calculated intermediate values if needed
        normalForce: calculations?.normalForce,
        frictionForce: calculations?.frictionForce,
        parallelForce: calculations?.parallelForce,
        netForce: calculations?.netForce,
        acceleration: calculations?.acceleration
      }, calculations);
      
      setFormulas(formulaData);

    } catch (error) {
      console.error('Error in friction calculation:', error);
      setResults(null);
      setFormulas([]);
    }
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
    <MathJaxContext config={mathJaxConfig}>
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
      <TextField
        label="Distance"
        type="number"
        name="distance"
        value={userInput.distance || ""}
        variant="outlined"
        inputProps={{ step: "0.01", min: 0 }}
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
        value={userInput.time || ""}
        variant="outlined"
        inputProps={{ step: "0.01", min: 0 }}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">s</InputAdornment>,
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
        <MenuItem value="frictionForce">Friction Force</MenuItem>
        <MenuItem value="normalForce">Normal Force</MenuItem>
        <MenuItem value="netForce">Net Force</MenuItem>
        <MenuItem value="parallelForce">Parallel Force</MenuItem>
        <MenuItem value="acceleration">Acceleration</MenuItem>
        <MenuItem value="time">Time</MenuItem>
        <MenuItem value="distance">Distance</MenuItem>
        <MenuItem value="all">All</MenuItem>
      </Select>

      {/* Formula Display Controls */}
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showFormulas}
                onChange={(e) => setShowFormulas(e.target.checked)}
                size="small"
              />
            }
            label="Show Formulas"
          />
          {showFormulas && (
            <FormControlLabel
              control={
                <Switch
                  checked={showBaseFormula}
                  onChange={(e) => setShowBaseFormula(e.target.checked)}
                  size="small"
                />
              }
              label="Show Base Formula"
            />
          )}
        </Box>

        {/* Results Section */}
        <Typography variant="h6" sx={{ mt: 2 }}>
          Results:
        </Typography>

        {/* Formula Display Section */}
        {showFormulas && formulas.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Mathematical Steps
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 1 }}>
              {formulas.map((formula, index) => (
                <FormulaDisplay
                  key={index}
                  formulaKey={formula.key}
                  values={formula.values}
                  result={formula.result}
                  topic="friction"
                  showBaseFormula={showBaseFormula}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Raw Results Display */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Raw Results
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ 
              whiteSpace: "pre-wrap", 
              wordWrap: "break-word",
              fontSize: '12px',
              margin: 0,
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px'
            }}>
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
          </AccordionDetails>
        </Accordion>

        {/* Quick Results Summary */}
        {results && (
          <Box sx={{ mt: 1, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Quick Summary:
            </Typography>
            {userInput.target === 'all' ? (
              <Box>
                {results.normalForce && <Typography variant="body2">Normal Force: {Number(results.normalForce).toFixed(2)} N</Typography>}
                {results.frictionForce && <Typography variant="body2">Friction Force: {Number(results.frictionForce).toFixed(2)} N</Typography>}
                {results.parallelForce && <Typography variant="body2">Parallel Force: {Number(results.parallelForce).toFixed(2)} N</Typography>}
                {results.netForce && <Typography variant="body2">Net Force: {Number(results.netForce).toFixed(2)} N</Typography>}
                {results.acceleration && <Typography variant="body2">Acceleration: {Number(results.acceleration).toFixed(2)} m/s²</Typography>}
                {results.distance && <Typography variant="body2">Distance: {Number(results.distance).toFixed(2)} m</Typography>}
                {results.time && <Typography variant="body2">Time: {Number(results.time).toFixed(2)} s</Typography>}
              </Box>
            ) : (
              <Typography variant="body2">
                {Number(results).toFixed(2)} {getUnit(userInput.target)}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </MathJaxContext>
  );
};

// Helper function to get appropriate units
const getUnit = (target) => {
  const units = {
    frictionForce: 'N',
    normalForce: 'N',
    netForce: 'N',
    parallelForce: 'N',
    acceleration: 'm/s²',
    time: 's',
    distance: 'm'
  };
  return units[target] || '';
};

export default FrictionInterface;