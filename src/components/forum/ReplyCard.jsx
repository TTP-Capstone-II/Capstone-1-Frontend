import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton, Typography, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { API_URL } from "../../shared";
import ReplyForm from "../../forms/ReplyForm";
import "../../AppStyles.css";

//Function for timestamps
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

const ReplyCard = ({ reply, userId, onReplyAdded, depth = 0 }) => {
  const {
    id,
    user,
    content,
    createdAt,
    likes,
    childReplies = [],
    postId,
  } = reply;
  const [numOflikes, setNumOflikes] = useState(likes);
  const [like, setLike] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleClick = async () => {
    if (like === false) {
      try {
        await axios.post(`${API_URL}/api/replylikes/${id}/like/${userId}`);
        setNumOflikes(numOflikes + 1);
        setLike(true);
      } catch (error) {
        console.log(error);
      }
    } else if (like === true) {
      try {
        await axios.delete(`${API_URL}/api/replylikes/${id}/unlike/${userId}`);
        setLike(false);
        setNumOflikes(numOflikes - 1);
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
  }, [id, userId]);

return (
  <>
    <Card sx={{ marginBottom: 2, cursor: "pointer", "&:hover": { boxShadow: 3 }, ml: depth * 4, backgroundColor: "var(--background-canvas)" }}>
      <CardContent>
        <Typography color="var(--text)">
          {user?.username || "Loading..."} - {new Date(createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" color="var(--text)" sx={{ whiteSpace: "pre-wrap", mt: 1, mb: 2 }}> 
          {content}
        </Typography>
      </CardContent>
        <IconButton aria-label="ThumbUp" onClick={handleClick}>
          <ThumbUpIcon></ThumbUpIcon>
          <Typography color="var(--text)">{numOflikes}</Typography>
          <Typography variant="body2" color="var(--text)">
            &emsp; {timeAgo(new Date(createdAt))}
          </Typography>
        </IconButton>

        <Button
          size="small"
          onClick={() => setShowReplyForm(!showReplyForm)}
          sx={{ ml: 2, color: "var(--buttons)" }}
        >
          {showReplyForm ? "Cancel" : "Reply"}
        </Button>

        {showReplyForm && (
          <ReplyForm
            postId={postId}
            userId={userId}
            parentId={id}
            onReplyAdded={() => {
              setShowReplyForm(false);
              onReplyAdded && onReplyAdded();
            }}
          />
        )}
      </Card>

      {childReplies.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {childReplies.map((child) => (
            <ReplyCard
              key={child.id}
              reply={child}
              userId={userId}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </Box>
      )}
    </>
  );
};

export default ReplyCard;
