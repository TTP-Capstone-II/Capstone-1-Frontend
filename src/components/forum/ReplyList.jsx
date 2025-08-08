import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ReplyCard from "./ReplyCard";
import { Box } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../shared";

<<<<<<< Updated upstream
const ReplyList = ({ postId }) => {
=======
const ReplyList = ({ postId, userId }) => {
>>>>>>> Stashed changes
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/post/${postId}/reply`);
        setReplies(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReplies();
  }, [postId]);

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
      {replies.map((reply) => (
        <ReplyCard
          key={reply.id}
<<<<<<< Updated upstream
          author={reply?.user.username}
          content={reply?.content}
          createdAt={reply?.createdAt}
=======
          id={reply.id}
          userId={userId}
          author={reply?.user.username}
          content={reply?.content}
          createdAt={reply?.createdAt}
          numOflikes={reply?.likes}
>>>>>>> Stashed changes
        />
      ))}
    </Box>
  );
};

export default ReplyList;
