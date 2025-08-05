import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ReplyCard from "./ReplyCard";

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
    <List>
      {replies.map((reply) => (
        <ListItem key={reply.id}>
          <ReplyCard
            author={reply?.author}
            content={reply?.content}
            createdAt={reply?.createdAt}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ReplyList;
