import {
  Box,
  Button,
  FormControl,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { API_URL } from "../shared";
import axios from "axios";

const ReplyForm = ({ postId }) => {
  const [replyData, setReplyData] = useState({
    content: "",
    userId: "",
    postId: postId,
    likes: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/post/${postId}/reply`,
        replyData
      );
      console.log("Post reply resposne:", response);
    } catch (error) {
      console.error("error posting reply", error);
    }
  };

  return (
    <div className="reply-page">
      <FormControl>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 600,
          }}
        >
          <Box>
            <TextareaAutosize
              minRows={2}
              value={replyData.content}
              onChange={(e) =>
                setReplyData({ ...replyData, content: e.target.value })
              }
              style={{
                width: "100%",
                fontSize: "1rem",
                padding: "10px",
                borderColor: "#c4c4c4",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Reply
          </Button>
        </Box>
      </FormControl>
    </div>
  );
};

export default ReplyForm;
