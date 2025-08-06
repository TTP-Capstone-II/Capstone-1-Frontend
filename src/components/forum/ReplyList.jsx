import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ReplyCard from "./ReplyCard";
import { Box } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../shared";

const ReplyList = () => {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchReplies = () => {
      const response = axios.await(`${API_URL}/api/post/reply`);
      setReplies(response.data);
    };

    fetchReplies;
  }, []);

  const sampleReplies = [
    {
      id: 1,
      author: "Joyous",
      content: "Worst poster ever!",
      createdAt: "1-5-2025",
    },
    {
      id: 2,
      author: "Johnny",
      content: "Bad post. Delete it now",
      createdAt: "8-5-2025",
    },
    {
      id: 3,
      author: "Marsack",
      content: "I hate this",
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
      {sampleReplies.map((reply) => (
        <ReplyCard
          key={reply.id}
          author={reply?.author}
          content={reply?.content}
          createdAt={reply?.createdAt}
        />
      ))}
    </Box>
  );
};

export default ReplyList;
