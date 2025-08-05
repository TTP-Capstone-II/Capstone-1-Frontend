import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/forum/PostCard"; 
import { API_URL } from "../shared"; 

const ForumPage = () => {
  const [posts, setPosts] = useState([]);
  const forumId = 1;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/forum/${forumId}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="forum-page">
      <h1>Forum Posts</h1>
      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default ForumPage;
