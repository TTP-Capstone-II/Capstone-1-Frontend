import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Container,
  Avatar,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { API_URL } from "../shared";
import SimulationCard from "./SimulationCard";
import { useRef } from "react";

const Profile = ({ user }) => {
  const [simulations, setSimulations] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fetchSimulations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/simulation/${user.id}`);
      setSimulations(response.data);
    } catch (error) {
      console.error("Error fetching simulations:", error);
    }
  };

  const handleDelete = async (simId) => {
    try {
      await axios.delete(`${API_URL}/api/simulation/${simId}`);
      setSimulations((prev) => prev.filter((sim) => sim.id !== simId));
    } catch (error) {
      console.error("Failed to delete simulation:", error);
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  const handleAvatarClick = () => setOpen(true);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!preview) return;
    try {
      const response = await axios.post(`${API_URL}/api/upload`, {
        image_url: preview,
      });

      await axios.patch(`${API_URL}/api/users/${user.id}`, {
        profile_image: response.data.url,
      });

      setAvatar(response.data.url);
      setOpen(false);
      setPreview(null);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchSimulations();
    }
  }, [user]);

  useEffect(() => {
    console.log(user);

    const fetchUserAvatar = async () => {
      try {
        const resAvatar = await axios.get(`${API_URL}/api/users/${user.id}`);
        console.log(resAvatar);
        setAvatar(resAvatar.data.profile_image);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.id) {
      fetchUserAvatar();
    }
  }, [setAvatar]);

  return (
    <Container>
      <Paper>
        <Card
          elevation={6}
          square={false}
          component="section"
          sx={{
            p: 2,
            border: "1px solid grey",
            display: "flex",
            justifyContent: "center",
            height: "300px",
            margin: 16,
            gap: 20,
          }}
        >
          <CardContent
            sx={{ justifyContent: "center", display: "row", margin: 3 }}
          >
            <Typography align="center">{user?.username}</Typography>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <IconButton onClick={handleAvatarClick}>
              <Avatar
                alt="profile_picture"
                src={avatar || user?.profile_image}
                sx={{ width: 80, height: 80 }}
              />
            </IconButton>
          </CardContent>
        </Card>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogContent>
            <Box display="flex" justifyContent="center">
              <Avatar
                alt="profile_picture"
                src={preview || user?.profile_image}
                sx={{ width: 200, height: 200 }}
              />
            </Box>
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "center", flexDirection: "column" }}
          >
            <Button variant="outlined" onClick={handleChangePicture}>
              Change Picture
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1 }}
              onClick={handleImageUpload}
              disabled={!preview}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            My Simulations
          </Typography>

          <Grid container spacing={3}>
            {simulations.map((sim) => (
              <Grid key={sim.id}>
                <SimulationCard
                  simulation={sim}
                  username={user.username}
                  forumTitle={sim.forumTitle || "Unknown Forum"}
                  topic={sim.topic}
                  onDelete={() => handleDelete(sim.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
