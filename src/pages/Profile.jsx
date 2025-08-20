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
} from "@mui/material";
import { API_URL } from "../shared";
import SimulationCard from "./SimulationCard";
import "../AppStyles.css";

const Profile = ({ user }) => {
    const [simulations, setSimulations] = useState([]);
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

    useEffect(() => {
        if (user?.id) {
            fetchSimulations();
        }
    }, [user]);

    return (
        <Container sx={{ width: 1250, backgroundColor: "var(--interface-color)", marginTop: 4, boxShadow: 3, padding: 2, borderRadius: 1 }}>
            <Card elevation={6} square={false} component="section" sx={{
                p: 2, border: '1px solid grey', display: 'flex',
                justifyContent: 'center', height: "300px", margin: 16, gap: 20, marginTop: 4, backgroundColor: "var(--interface-box)", boxShadow: 3, borderRadius: 2
            }}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    <Typography align="center">{user?.username}</Typography>
                    <Avatar align="center" alt="profile_picture" src="https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png" sx={{ width: 80, height: 80 }} />
                </CardContent>
            </Card>

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
        </Container>
    );
};

export default Profile;
