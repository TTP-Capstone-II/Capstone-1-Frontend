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
import socket from "../socket";

const ReplyForm = ({
  postId,
  userId,
  parentId = null,
  autoClose = true,
  onReplyAdded,
}) => {
  const [content, setContent] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: newReply } = await axios.post(
        `${API_URL}/api/post/${postId}/reply`,
        {
          content,
          userId,
          postId,
          parentId,
        }
      );
      
      socket.emit("new-reply", {
        ...newReply,
        room: `post_${postId}`,
      });

      setContent("");
      if (autoClose) setIsOpen(false);

      //if (onReplyAdded) onReplyAdded();
    } catch (error) {
      console.error("error posting reply", error);
    }
  };

  return (
    isOpen && (
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
                onChange={(e) => setContent(e.target.value)}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!content.trim()}
            >
              Reply
            </Button>
          </Box>
        </FormControl>
      </div>
    )
  );
};

export default ReplyForm;
