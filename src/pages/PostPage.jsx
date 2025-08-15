import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { API_URL } from "../shared";
import ReplyList from "../components/forum/ReplyList";
import ReplyForm from "../forms/ReplyForm";
import socket from "../socket";

const PostPage = ({ user }) => {
  const [post, setPost] = useState([]);
  const [replies, setReplies] = useState([]);
  const { forumId, postId } = useParams();
  let params = useParams();

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

    socket.on("new-reply", (reply) => {
      setReplies((prev) => {
        if (prev.some((r) => r.id === reply.id)) return prev;
        return [...prev, reply];
      });
    });

    return () => {
      socket.off("new-reply");
    };
  }, [params.postId]);

  return (
    <div className="forum-page">
      <h1>Post</h1>
      <div>{post.title}</div>
      <div>{post.content}</div>
      <ReplyList
        replies={replies}
        postId={post.id}
        userId={user?.id}
        onReplyAdded={fetchReplies}
      />
      <ReplyForm
        postId={post.id}
        userId={user?.id}
        onReplyAdded={fetchReplies}
      />
    </div>
  );
};

export default PostPage;
