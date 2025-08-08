import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";
import axios from "axios";
import { API_URL } from "../shared";


const SimulationCard = ({ post }) => {
  const navigate = useNavigate();

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
  const handleClick = () => {
    const postId = post.id;
    navigate(`/forum/${forumId}/posts/${postId}`);
  }

  return (
    <Card
      sx={{
        width: "350px",
        marginBottom: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          simulation title
        </Typography>
        <Typography color="text.secondary">
          User Name
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Delete
        </Typography>
      </CardContent>
    </Card>
  );
}

export default SimulationCard;