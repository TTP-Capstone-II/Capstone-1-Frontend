import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Typography } from "@mui/material";

const ReplyCard = ({ author, content, createdAt }) => {
  return (
    <Card
      sx={{
        marginBottom: 2,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Typography color="text.secondary">
          {author} - {new Date(createdAt).toLocaleDateString()}
        </Typography>
        {content}
      </CardContent>
    </Card>
  );
};

export default ReplyCard;
