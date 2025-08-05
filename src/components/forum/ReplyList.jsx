import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ReplyCard from "./ReplyCard";
import { Box } from "@mui/material";

const ReplyList = () => {
  const replies = [
    {
      id: 1,
      author: "example",
      content: "example content",
      createdAt: "example created at",
    },
    {
      id: 2,
      author: "title",
      content: "example content",
      createdAt: "example created at",
    },
    {
      id: 3,
      author: "example title",
      content: "example content",
      createdAt: "example created at",
    },
  ];

  return (
    <Box>
      {replies.map((reply) => (
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
