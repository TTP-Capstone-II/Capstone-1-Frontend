import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/forum/PostCard";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";
import { API_URL } from "../shared";
import "../AppStyles.css";

const HomeForum = () => {
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
        <div className="forum-page">
            <h1 style={{justifyContent: "center"}}>All Forums</h1>
            <div className="forum-list">
                {forums.map((forum) => (
                    <Link 
                        to={`/forum/${forum.id}/posts`} 
                        key={forum.id} 
                        className="forum-card" 
                        style={{ textDecoration: 'none' }}
                    >
                        <Card
                            sx={{
                                marginBottom: 2,
                                cursor: "pointer",
                                "&:hover": {
                                    boxShadow: 3,
                                },
                                width: 1250,
                                backgroundColor: "var(--interface-color)",
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {forum.name}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {forum.description}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {forum.numOfPosts} Posts
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomeForum;
