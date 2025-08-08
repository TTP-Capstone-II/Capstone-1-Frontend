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

const InertiaInterface = ({ userInput, setUserInput }) => {
    const [results, setResults] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: parseFloat(value),
        });
    };

    useEffect(() => {
        if (!userInput.target) return;

        const calculations = FreeFallMotion({
            gravity: userInput.gravity,
            square1_mass: userInput.square1_mass,
            square1_initialAcceleration: userInput.square1_initialAcceleration,
            square1_finalVelocity: userInput.square1_finalVelocity,
            square1_initialPosition: userInput.square1_initialPosition,
            square1_finalPosition: userInput.square1_finalPosition,
            square2_mass: userInput.square2_mass,
            square2_initialAcceleration: userInput.square2_initialAcceleration,
            square2_finalVelocity: userInput.square2_finalVelocity,
            square2_initialPosition: userInput.square2_initialPosition,
            square2_finalPosition: userInput.square2_finalPosition,
            time: userInput.time,
        });
        setResults(calculations);
    }, [
        userInput.gravity,
        userInput.square1_mass,
        userInput.square1_initialAcceleration,
        userInput.square1_finalVelocity,
        userInput.square1_initialPosition,
        userInput.square1_finalPosition,
        userInput.square2_mass,
        userInput.square2_initialAcceleration,
        userInput.square2_finalVelocity,
        userInput.square2_initialPosition,
        userInput.square2_finalPosition,
        userInput.square1_finalVelocity,
        userInput.time,
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
                label="Square 1 mass"
                type="number"
                name="square1_mass"
                value={userInput.square1_mass}
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
                label="Square 1 initial velocity"
                type="number"
                name="square1_initialAcceleration"
                value={userInput.square1_initialAcceleration}
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
                label="Square 1 final velocity"
                type="number"
                name="square1_finalVelocity"
                value={userInput.square1_finalVelocity}
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
                label="Square 1 initial position"
                type="number"
                name="square1_initialPosition"
                value={userInput.square1_initialPosition}
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
                label="Square 1 final position"
                type="number"
                name="square1_finalPosition"
                value={userInput.square1_finalPosition}
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
                label="Square 2 mass"
                type="number"
                name="square2_mass"
                value={userInput.square2_mass}
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
                label="Square 2 initial velocity"
                type="number"
                name="square2_initialAcceleration"
                value={userInput.square2_initialAcceleration}
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
                label="Square 2 final velocity"
                type="number"
                name="square2_finalVelocity"
                value={userInput.square2_finalVelocity}
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
                label="Square 2 initial position"
                type="number"
                name="square2_initialPosition"
                value={userInput.square2_initialPosition}
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
                label="Square 2 final position"
                type="number"
                name="square2_finalPosition"
                value={userInput.square2_finalPosition}
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

export default InertiaInterface;