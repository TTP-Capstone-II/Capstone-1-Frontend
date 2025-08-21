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
import { API_URL } from "../shared";
import { Inertia } from "../topics/Inertia";
import axios from "axios";
import InertiaFormulaDisplay from "../../utils/InertiaFormulaDisplay";
import "../AppStyles.css";

const InertiaInterface = ({ userInput, setUserInput, user, simulation }) => {
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
                topic: "inertia",
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
                topic: "inert",
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

        const calculations = Inertia({
            gravity: userInput.gravity,
            square1_mass: userInput.square1_mass,
            square1_initialAcceleration: userInput.square1_initialAcceleration,
            square1_initialPosition: userInput.square1_initialPosition,
            square2_mass: userInput.square2_mass,
            square2_initialAcceleration: userInput.square2_initialAcceleration,
            square2_initialPosition: userInput.square2_initialPosition,
            time: userInput.time,
            target: userInput.target,
        });
        setResults(calculations);
    }, [
        userInput.gravity,
        userInput.square1_mass,
        userInput.square1_initialAcceleration,
        userInput.square1_initialPosition,
        userInput.square2_mass,
        userInput.square2_initialAcceleration,
        userInput.square2_initialPosition,
        userInput.time,
        userInput.target,
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
                label="Square 1 mass"
                type="number"
                name="square1_mass"
                value={userInput.square1_mass}
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
                label="Square 1 initial velocity"
                type="number"
                name="square1_initialAcceleration"
                value={userInput.square1_initialAcceleration}
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
                label="Square 1 initial position"
                type="number"
                name="square1_initialPosition"
                value={userInput.square1_initialPosition}
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
                label="Square 2 mass"
                type="number"
                name="square2_mass"
                value={userInput.square2_mass}
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
                label="Square 2 initial velocity"
                type="number"
                name="square2_initialAcceleration"
                value={userInput.square2_initialAcceleration}
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
                label="Square 2 initial position"
                type="number"
                name="square2_initialPosition"
                value={userInput.square2_initialPosition}
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
                <MenuItem value="finalVelocity">Final Velocities</MenuItem>
                <MenuItem value="momentum">Momentum (before collision)</MenuItem>
                <MenuItem value="kineticEnergy">Kinetic Energy (before collision)</MenuItem>
                <MenuItem value="time">Time to collision</MenuItem>
                <MenuItem value="positionsAfterT">Positions after a set amount of seconds</MenuItem>
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
                <InertiaFormulaDisplay
                    topic="inertia"
                    target={userInput.target}
                    results={results}
                    userInput={userInput}
                />
            )}
            <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="subtitle1">Calculated Results:</Typography>
                {results ? (
                    <>
                        {results.v1Final && (
                            <Typography variant="body2">
                                Final Velocity (Square 1): {Number(results.v1Final).toFixed(2)} m/s
                            </Typography>
                        )}
                        {results.v2Final && (
                            <Typography variant="body2">
                                Final Velocity (Square 2): {Number(results.v2Final).toFixed(2)} m/s
                            </Typography>
                        )}
                        {results.momentum1 && (
                            <Typography variant="body2">
                                Momentum (Square 1): {Number(results.momentum1).toFixed(2)} kg·m/s
                            </Typography>
                        )}
                        {results.momentum2 && (
                            <Typography variant="body2">
                                Momentum (Square 2): {Number(results.momentum2).toFixed(2)} kg·m/s
                            </Typography>
                        )}
                        {results.kineticEnergy1 && (
                            <Typography variant="body2">
                                Kinetic Energy (Square 1): {Number(results.kineticEnergy1).toFixed(2)} J
                            </Typography>
                        )}
                        {results.kineticEnergy2 && (
                            <Typography variant="body2">
                                Kinetic Energy (Square 2): {Number(results.kineticEnergy2).toFixed(2)} J
                            </Typography>
                        )}
                        {results.timeToCollision && Number.isFinite(Number(results.timeToCollision)) && (
                            <Typography variant="body2">
                                Time to Collision: {Number(results.timeToCollision).toFixed(2)} s
                            </Typography>
                        )}
                        {results.position1 && (
                            <Typography variant="body2">
                                Position (Square 1): {Number(results.position1).toFixed(2)} m
                            </Typography>
                        )}
                        {results.position2 && (
                            <Typography variant="body2">
                                Position (Square 2): {Number(results.position2).toFixed(2)} m
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

export default InertiaInterface;