import React, {useState} from "react";
import { TextField, Button, Paper, Typography, InputAdornment } from "@mui/material";

const ProjectileMotionInterface = ({userInput, setUserInput}) => {

    const handleInputChange = (e) => { 
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: parseFloat(value) 
        });
    }

    //add function to handle form submission (add info to a prop that goes to where it's needed for calculations)

  return (
    <Paper 
      elevation={3} 
      sx={{
        marginTop: 7,
        width: 300,
        height: '100%',
        padding: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto'
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
        value={userInput.initialheight}
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
      />*/}

      <Button 
        variant="contained" 
        color="primary"
        sx={{ mt: 2 }}
      >
        Enter
      </Button>
    </Paper>
  );
};

export default ProjectileMotionInterface;