import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ReplyCard from "./ReplyCard";

const ReplyList = () => {
  const data = [
    {
      id: 1,
      author: "example title",
      content: "example content",
      createdAt: "example created at",
    },
    {
      id: 2,
      author: "example title",
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
      <ListItem>
        {data.map((reply) => (
          <ReplyCard
            key={reply.id}
            author={reply.author}
            content={reply.content}
            createdAt={reply.createdAt}
          />
        ))}
      </ListItem>
    </List>
  );
};

export default ReplyList;
