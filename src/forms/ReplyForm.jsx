import {
  Box,
  Button,
  FormControl,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_URL } from "../shared";
import axios from "axios";

const ReplyForm = ({ postId, userId, parentId = null, onReplyAdded }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/post/${postId}/reply`, {
        content,
        userId,
        postId,
        parentId,
      });
      setContent("");
      if (onReplyAdded) onReplyAdded();
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
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
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
          <Button type="submit" variant="contained" color="primary" disabled={!content.trim()}>
            Reply
          </Button>
        </Box>
      </FormControl>
    </div>
  );
};

export default ReplyForm;
