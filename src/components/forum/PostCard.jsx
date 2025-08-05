import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";

const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const handleClick = () => {
      const postId = post.id;
      navigate(`/forum/:forumId/posts/${postId}`);
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