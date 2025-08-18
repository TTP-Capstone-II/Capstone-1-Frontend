import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Paper,
    Typography,
    Modal,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FreeFallMotion } from "../topics/FreeFall";
import { API_URL } from "../shared";
import axios from "axios";

const SandboxInterface = ({
    userInput,
    setUserInput,
    user,
    simulation,
    onCreateShape,
    objects,
    onUpdateObject,
    onDeleteObject,
}) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [shapeType, setShapeType] = useState("rectangle");
    const [forum, setForum] = useState("");
    const [results, setResults] = useState(null);

    const [shapeData, setShapeData] = useState({
        x: 500,
        y: 100,
        width: 50,
        height: 50,
        radius: 25, // For circles
        mass: 1,
        angle: 0,
        color: "#4a90e2",
        isStatic: false,
        type: "rectangle",
    });

    const handleChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;
        setShapeData((prev) => ({
            ...prev,
            [name]: inputType === "checkbox" ? checked : parseFloat(value),
        }));
    };

    const handleCreate = () => {
        onCreateShape({ ...shapeData, type: shapeType });
        setCreateModalOpen(false);
    };

    const handleUserInputChange = (e) => {
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

        if (!userInput?.target) return;

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
                backgroundColor: "#F5D259",
            }}
        >
            {/* Create Buttons */}
            <Button
                variant="contained"
                onClick={() => {
                    setShapeType("rectangle");
                    setShapeData({
                        x: 500,
                        y: 100,
                        width: 50,
                        height: 50,
                        mass: 1,
                        angle: 0,
                        color: "#4a90e2",
                        isStatic: false,
                        type: "rectangle",
                    });
                    setCreateModalOpen(true);
                }}
                sx={{ backgroundColor: "#073e7b", '&:hover': { backgroundColor: '#042851' }, }}
            >
                Create Square
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                    setShapeType("circle");
                    setShapeData({
                        x: 500,
                        y: 100,
                        radius: 25,
                        mass: 1,
                        angle: 0,
                        color: "#4a90e2",
                        isStatic: false,
                        type: "circle",
                    });
                    setCreateModalOpen(true);
                }}
                sx={{ backgroundColor: "#073e7b", '&:hover': { backgroundColor: '#042851' }, }}
            >
                Create Circle
            </Button>

            {/* Create Modal */}
            <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Create a {shapeType === "circle" ? "Circle" : "Square"}
                    </Typography>

                    {/* Common Fields */}
                    {["x", "y", "mass"].map((field) => (
                        <TextField
                            key={field}
                            fullWidth
                            margin="dense"
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            name={field}
                            type="number"
                            value={shapeData[field]}
                            onChange={handleChange}
                        />
                    ))}

                    {/* Shape-Specific Fields */}
                    {shapeType === "circle" ? (
                        <TextField
                            fullWidth
                            margin="dense"
                            label="Radius"
                            name="radius"
                            type="number"
                            value={shapeData.radius}
                            onChange={handleChange}
                        />
                    ) : (
                        <>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Width"
                                name="width"
                                type="number"
                                value={shapeData.width}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Height"
                                name="height"
                                type="number"
                                value={shapeData.height}
                                onChange={handleChange}
                            />
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Angle"
                                name="angle"
                                type="number"
                                value={shapeData.angle}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    {/* Color and Static */}
                    <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 2 }}>
                        <TextField
                            label="Color"
                            type="color"
                            name="color"
                            value={shapeData.color}
                            onChange={handleChange}
                            sx={{ width: 100 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isStatic"
                                    checked={!!shapeData.isStatic}
                                    onChange={handleChange}
                                />
                            }
                            label="Static"
                        />
                    </Box>

                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreate}>
                        Add {shapeType === "circle" ? "Circle" : "Square"}
                    </Button>
                </Box>
            </Modal>

            {/* Objects Accordion */}
            <Typography variant="h6" sx={{ mt: 2 }}>
                Objects:
            </Typography>

            {objects.map((obj) => (
                <Accordion sx={{backgroundColor: "#E7BB1A"}}key={obj.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box>
                            <Typography>{obj.name}</Typography>
                            <Typography variant="body2" sx={{ color: "black" }}>
                                Type: {obj.data.type}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {["x", "y", "mass"].map((field) => (
                            <TextField
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                type="number"
                                name={field}
                                value={obj.data[field]}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    onUpdateObject(obj.id, {
                                        ...obj.data,
                                        [field]: value === "" ? "" : parseFloat(value),
                                    });
                                }}
                            />
                        ))}

                        {obj.data.type === "circle" ? (
                            <TextField
                                label="Radius"
                                type="number"
                                name="radius"
                                value={obj.data.radius}
                                onChange={(e) =>
                                    onUpdateObject(obj.id, {
                                        ...obj.data,
                                        radius: parseFloat(e.target.value),
                                    })
                                }
                            />
                        ) : (
                            <>
                                {["width", "height", "angle"].map((field) => (
                                    <TextField
                                        key={field}
                                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                                        type="number"
                                        name={field}
                                        value={obj.data[field]}
                                        onChange={(e) =>
                                            onUpdateObject(obj.id, {
                                                ...obj.data,
                                                [field]: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                ))}
                            </>
                        )}

                        <TextField
                            label="Color"
                            type="color"
                            value={obj.data.color || "#4a90e2"}
                            onChange={(e) =>
                                onUpdateObject(obj.id, {
                                    ...obj.data,
                                    color: e.target.value,
                                })
                            }
                            sx={{ width: 100 }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!obj.data.isStatic}
                                    onChange={(e) =>
                                        onUpdateObject(obj.id, {
                                            ...obj.data,
                                            isStatic: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Static"
                        />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => onDeleteObject(obj.id)}
                            sx={{ mt: 1 }}
                        >
                            Delete
                        </Button>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Paper>
    );
};

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

export default SandboxInterface;
