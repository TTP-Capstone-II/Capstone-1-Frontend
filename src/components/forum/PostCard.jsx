import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton, Typography, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { API_URL } from "../../shared";

function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}

const PostCard = ({ post }) => {
  const { forumId } = useParams();
  const [forums, setForums] = useState([]);
  const [posts, setPosts] = useState([]);
  const [numOflikes, setNumOflikes] = useState(post.likes);
  const [like, setLike] = useState(false);
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
  };

  const handleLikeClick = async () => {
    if (like === false) {
      try {
        await axios.post(
          `${API_URL}/api/postlikes/${post.id}/like/${post.userId}`
        );
        setNumOflikes(numOflikes + 1);
        setLike(true);
      } catch (error) {
        console.log(error);
      }
    } else if (like === true) {
      try {
        await axios.delete(
          `${API_URL}/api/postlikes/${post.id}/unlike/${post.userId}`
        );
        setLike(false);
        setNumOflikes(numOflikes - 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchPostLikeCheck = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/postlikes/${post.id}/likes/${post.userId}`
        );
        setLike(response.data.liked);
        console.log("like", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostLikeCheck();
  }, [post.id, post.userId]);

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
          {post.user?.username} -{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
        <IconButton
          aria-label="ThumbUp"
          onClick={(e) => {
            e.stopPropagation();
            handleLikeClick();
          }}
        >
          <ThumbUpIcon></ThumbUpIcon> &nbsp;
          <Typography variant="body2" color="text.secondary">
            {numOflikes} likes - {timeAgo(new Date(post.createdAt))}
          </Typography>
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default PostCard;
