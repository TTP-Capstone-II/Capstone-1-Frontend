import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../shared";
import "../../AppStyles.css";

function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'Just now';
}

const PostCard = ({ post }) => {
  const { forumId } = useParams();
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
        boxShadow: 3,
        width: 1250,
        backgroundColor: "var(--interface-color)",
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
          {post.likes} likes - {timeAgo(new Date(post.createdAt))}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard;