import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";

const ReplyCard = ({ author, content, createdAt }) => {
  return (
    <Card>
      <CardHeader>
        <label>Author: {author}</label>
        <label>Created At: {createdAt}</label>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
};

export default ReplyCard;
