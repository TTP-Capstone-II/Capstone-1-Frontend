import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { API_URL } from "../../shared";

const ReplyCard = ({ author, content, createdAt, postId }) => {
  const [likes, setLikes] = useState(0);

  const handleClick = async () => {
    setLikes(likes + 1);
    try {
      await axios.patch(`${API_URL}/api/post/${postId}/reply`, {
        likes: likes,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      </IconButton>
    </Card>
  );
};

export default ReplyCard;
