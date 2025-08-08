import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../shared";


const PostCard = ({ post }) => {
  const {forumId} = useParams();
  const [forums, setForums] = useState([]);
  const [posts, setPosts] = useState([]);
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
        marginBottom: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {post.title}
        </Typography>
        <Typography color="text.secondary">
          {post.user?.username} - {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.likes} likes
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard;