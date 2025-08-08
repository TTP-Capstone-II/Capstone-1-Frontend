import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, Button, Box, Paper, Container, Avatar } from "@mui/material";
import { API_URL } from "../shared";
import SimulationCard from "./SimulationCard";

const Profile = ({ user }) => {
    const [forums, setForums] = useState([]);

    const fetchForums = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/forum`);
            setForums(response.data);
            console.log("Fetched forums:", response.data);
        } catch (error) {
            console.error("Error fetching forums:", error);
        }
    };


    useEffect(() => {
        fetchForums();
    }, []);

    return (
        <Container className="forum-page">
            <Paper>
                <Card elevation={6} square={false} component="section" sx={{
                    p: 2, border: '1px solid grey', display: 'flex',
                    justifyContent: 'center', height: "300px", margin: 16, gap: 20,
                }}>
                    <CardContent sx={{justifyContent: 'center', display: 'row', margin: 3}}>
                        <Typography align="center">{user?.username}</Typography>
                        <Avatar alt="profile_picture" src="https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png" sx={{ width: 80, height: 80}}/>
                    </CardContent>
                </Card>
                <Box elevation={6} square={false} component="section" sx={{ p: 2, border: '1px solid grey' }}>My Simulations</Box>
                <Card>
                    <CardContent sx={{display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center'}}>
                        <SimulationCard />
                        <SimulationCard />
                        <SimulationCard />
                    </CardContent>
                </Card>
            </Paper>
        </Container>
    );
};

export default Profile;
