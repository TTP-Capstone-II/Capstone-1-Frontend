import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton, Typography } from "@mui/material";
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

const ReplyCard = ({ id, userId, author, content, createdAt, numOflikes }) => {
  const [likes, setLikes] = useState(numOflikes);
  const [like, setLike] = useState(false);

  const handleClick = async () => {
    if (like === false) {
      try {
        await axios.post(`${API_URL}/api/replylikes/${id}/like/${userId}`);
        setLikes(likes + 1);
        setLike(true);
      } catch (error) {
        console.log(error);
      }
    } else if (like === true) {
      try {
        await axios.delete(`${API_URL}/api/replylikes/${id}/unlike/${userId}`);
        setLike(false);
        setLikes(likes - 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchReplyLikeCheck = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/replylikes/${id}/likes/${userId}`
        );
        setLike(response.data.liked);
        console.log("like", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchReplyLikeCheck();
  }, []);

  return (
    <Card
      sx={{
        marginBottom: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Typography color="text.secondary">
          {author} - {new Date(createdAt).toLocaleDateString()}
        </Typography>
        {content}
      </CardContent>
      <IconButton aria-label="ThumbUp" onClick={handleClick}>
        <ThumbUpIcon></ThumbUpIcon>
        <Typography color="text.secondary">{likes}</Typography>
        <Typography variant="body2" color="text.secondary">
          &emsp; {timeAgo(new Date(createdAt))}
        </Typography>
      </IconButton>
    </Card>
  );
};

export default ReplyCard;
