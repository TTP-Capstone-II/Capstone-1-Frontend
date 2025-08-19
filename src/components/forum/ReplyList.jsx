import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ReplyCard from "./ReplyCard";
import { Box } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../shared";

const ReplyList = ({ postId, userId, replies: propReplies, onReplyAdded }) => {
  const [replies, setReplies] = useState([]);

  const fetchReplies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/post/${postId}/reply`);
      setReplies(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (postId && !propReplies) {
      fetchReplies();
    }
  }, [postId, propReplies]);

  const currentReplies = propReplies || replies;

  const sampleReplies = [
    {
      id: 1,
      author: "Joyous",
      content: "Best poster ever!",
      createdAt: "1-5-2025",
    },
    {
      id: 2,
      author: "Johnny",
      content: "Good post. Delete it now",
      createdAt: "8-5-2025",
    },
    {
      id: 3,
      author: "Marsack",
      content: "I",
      createdAt: "9-5-2025",
    },
  ];

  return (
    <Box
      sx={{
        width: 700,
        borderRadius: 1,
      }}
    >
      {currentReplies.map((reply) => (
        <ReplyCard
          key={reply.id}
          reply={reply}
          userId={userId}
          numOflikes={reply?.likes}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </Box>
  );
};

export default ReplyList;
