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
import { ProjectileMotion } from "../topics/ProjectileMotion";
import { API_URL } from "../shared";
import axios from "axios";
import { 
  FormulaDisplay, 
  getProjectileMotionFormulasForTarget 
} from "../../utils/latexTemplates";

const ProjectileMotionInterface = ({ userInput, setUserInput, user, simulation }) => {
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
      [name]: parseFloat(value),
    });
  };

  // Function to get the appropriate function name based on target
  const getFunctionName = (target) => {
    const targetMap = {
      range: 'calcRange',
      timeOfFlight: 'calcTimeOfFlight',
      maxHeight: 'calcMaxHeight',
      velocityComponents: 'calcVelocityComponents'
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
      if (target === 'All') {
        // Generate formulas for all calculations
        const allFormulas = [];
        const targets = ['range', 'timeOfFlight', 'maxHeight', 'velocityComponents'];
        
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
            
            const formulaData = getProjectileMotionFormulasForTarget(functionName, userInput, targetResult);
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
        
        return getProjectileMotionFormulasForTarget(functionName, userInput, targetResult);
      }
    } catch (error) {
      console.error('Error in generateFormulas:', error);
      return [];
    }
  };

  // FIXED useEffect in your ProjectileMotionInterface component
useEffect(() => {
  if (simulation) {
    setForum(simulation.forumTitle || "");
  }

  // FIX: Add validation for required inputs
  if (!userInput.target || 
      userInput.initialVelocity === undefined || 
      userInput.launchAngle === undefined ||
      userInput.gravity === undefined ||
      userInput.initialHeight === undefined) {
    console.log('Missing required inputs, skipping calculation');
    setResults(null);
    setFormulas([]);
    return;
  }

  try {
    const calculations = ProjectileMotion({
      gravity: userInput.gravity,
      initialVelocity: userInput.initialVelocity,
      launchAngle: userInput.launchAngle,
      initialHeight: userInput.initialHeight,
      target: userInput.target,
    });
    
    setResults(calculations);

    // FIX: Use consistent parameter names
    const formulaData = generateFormulas(userInput.target, {
      velocity: userInput.initialVelocity,        // Keep this
      initialVelocity: userInput.initialVelocity, // Add this for consistency
      angle: userInput.launchAngle,               // FIX: Use correct mapping
      launchAngle: userInput.launchAngle,         // Add this for consistency
      gravity: userInput.gravity,
      initialHeight: userInput.initialHeight
    }, calculations);
    
    setFormulas(formulaData);

  } catch (error) {
    console.error('Error in projectile motion calculation:', error);
    setResults(null);
    setFormulas([]);
  }

}, [
  userInput.target,
  userInput.gravity,
  userInput.initialVelocity,
  userInput.launchAngle,
  userInput.initialHeight,
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

      {/*  <TextField
        label="Final position"
        type="number"
        name="finalPosition"
        value={userInput.finalPosition}
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
      <Button 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
      >
        Enter
      </Button>
      */}
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
                  topic="projectile-motion"
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
            {userInput.target === 'All' ? (
              <Box>
                {results.range && <Typography variant="body2">Range: {Number(results.range).toFixed(2)} m</Typography>}
                {results.timeOfFlight && <Typography variant="body2">Time of Flight: {Number(results.timeOfFlight).toFixed(2)} s</Typography>}
                {results.maxHeight && <Typography variant="body2">Max Height: {Number(results.maxHeight).toFixed(2)} m</Typography>}
                {results.vx && results.vy && (
                  <Typography variant="body2">
                    Velocity Components: vₓ = {Number(results.vx).toFixed(2)} m/s, vᵧ = {Number(results.vy).toFixed(2)} m/s
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body2">
                {userInput.target === 'velocityComponents' && results.vx && results.vy
                  ? `vₓ = ${Number(results.vx).toFixed(2)} m/s, vᵧ = ${Number(results.vy).toFixed(2)} m/s`
                  : `${Number(results).toFixed(2)} ${getUnit(userInput.target)}`
                }
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </MathJaxContext>
  );
};

//Helper function to get appropriate units
const getUnit = (target) => {
  const units = {
    range: 'm',
    timeOfFlight: 's',
    maxHeight: 'm',
    velocityComponents: 'm/s'
  };
  return units[target] || '';
};


export default ProjectileMotionInterface;
