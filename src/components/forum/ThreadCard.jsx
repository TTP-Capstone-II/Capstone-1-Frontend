import React, {useNavigate} from "react";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";

const ThreadCard = ({ thread }) => {
    const navigate = useNavigate();
  return (
    <Card
      sx={{
        marginBottom: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
      onClick={() => navigate(`/forum/thread/${thread.id}`)}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {thread.title}
        </Typography>
        <Typography color="text.secondary">
          {thread.author} - {new Date(thread.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {thread.likes} likes
        </Typography>
      </CardContent>
    </Card>
  );
}