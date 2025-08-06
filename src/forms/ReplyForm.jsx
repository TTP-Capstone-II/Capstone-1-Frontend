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
import { useNavigate, useParams } from "react-router-dom";

const ReplyForm = () => {
  const [replyData, setReplyData] = useState({
    content: "",
    userId: "",
    postId: "",
    likes: 0,
  });
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {}, []);

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
      <h1>New Reply</h1>
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
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Content
            </Typography>
            <TextareaAutosize
              minRows={5}
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
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </FormControl>
    </div>
  );
};

export default ReplyForm;
