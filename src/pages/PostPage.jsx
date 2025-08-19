import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, IconButton, Typography, Box } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { useParams } from "react-router";
import { API_URL } from "../shared";
import ReplyList from "../components/forum/ReplyList";
import ReplyForm from "../forms/ReplyForm";
import socket from "../socket";

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

const PostPage = ({ user }) => {
  const [post, setPost] = useState([]);
  const [replies, setReplies] = useState([]);
  const { forumId, postId } = useParams();
  const [numOflikes, setNumOflikes] = useState(post.likes);
  const [like, setLike] = useState(false);
  let params = useParams();

  const insertReply = (replies, newReply) => {
    if (!newReply.parentId) {
      return [newReply, ...replies];
    }

    return replies.map((r) => {
      if (r.id === newReply.parentId) {
        const updatedChildren = r.childreplies
          ? [...r.childreplies, newReply]
          : [newReply];
        return { ...r, childReplies: updatedChildren };
      } else if (r.childReplies && r.childReplies.length > 0) {
        return { ...r, childReplies: insertReply(r.childReplies, newReply) };
      }
      return r;
    });
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/forum/${forumId}/posts/${params.postId}`
      );
      setPost(response.data);
      //setReplies(response.data.replies || []); //
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/post/${params.postId}/reply`
      );
      setReplies(response.data);
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchReplies();

    socket.emit("join-post", { postId: params.postId });

    socket.on("reply-added", (reply) => {
      setReplies((prev) => {
        if (!Array.isArray(prev)) prev = [];
        if (prev.some((r) => r.id === reply.id)) return prev;
        return insertReply(prev, reply);
      });
    });

    return () => socket.off("reply-added");
  }, [params.postId]);

  useEffect(() => {
    if (post && post.likes !== undefined) {
      setNumOflikes(post.likes);
    }
  }, [post]);

  const handleLikeClick = async (event) => {
    event.stopPropagation();

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
        console.log("Post like status:", response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostLikeCheck();
  }, [post.id, post.userId]);

  return (
    <Card sx={{ margin: 2, padding: 2, backgroundColor: "#48cae4" }}>
      <CardContent>
        <Typography color="#1c344cff" variant="h5" component="div" gutterBottom>
          {post.title}
        </Typography>

        <Typography color="#1c344cff" variant="body1" sx={{ mb: 1 }}>
          {post.content}
        </Typography>

        <Typography color="#1c344cff" variant="body2" sx={{ mb: 2 }}>
          by {post.user?.username} -{" "}
          <IconButton aria-label="ThumbUp" onClick={handleLikeClick}>
            <ThumbUpIcon sx={{ color: "#1c344cff" }}></ThumbUpIcon>
          </IconButton>{" "}
          - {numOflikes} likes - {timeAgo(new Date(post.createdAt))}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <ReplyList
            replies={replies}
            postId={post.id}
            userId={user?.id}
            onReplyAdded={fetchReplies}
          />
        </Box>

        <Box>
          <ReplyForm
            postId={post.id}
            userId={user?.id}
            onReplyAdded={fetchReplies}
            autoClose={false}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostPage;
