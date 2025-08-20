import React, { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/forum/PostCard";
import { Card, CardContent, Typography, Button, Paper } from "@mui/material";
import { API_URL } from "../shared";
import { useNavigate } from "react-router-dom";

const IndividualForum = () => {
  const {forumId} = useParams();
  const [forumName, setForumName] = useState(""); 
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/forum/${forumId}/posts/new-post`);
  }

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/forum/${forumId}/posts`);
      setForumName(response.data.forumName);
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="forum-page">
      <h1>{forumName} Posts</h1>
      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Button variant="contained" sx={{
        backgroundColor: "var(--buttons)",
        color: "#fff",
        '&:hover': { backgroundColor: "var(--buttons-hover)" },
      }} onClick={handleClick}>
        New Post
      </Button>
    </div>
  );
};

export default IndividualForum;
