import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Box, TextareaAutosize, InputLabel, Select, MenuItem, Typography, FormControl } from '@mui/material';
import { useParams, useNavigate } from "react-router";
import { API_URL } from "../shared";

const NewPostPage = ({ user }) => {
    const [post, setPost] = useState([]);
    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    let params = useParams();
    const { forumId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/api/forum/${forumId}/posts`, {
                title,
                userId: user.id,
                content,
            });

            setTitle("");
            setTopic("");
            setContent("");
            navigate(`/forum/${forumId}/posts`);
        } catch (err) {
            console.error("Failed to create post: ", err);
        }
    };

    return (
        <div className="forum-page">
            <h1>New Post</h1>
            <FormControl>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}
                >
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                    />

                    <Box>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Content</Typography>
                        <TextareaAutosize
                            minRows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                fontSize: '1rem',
                                padding: '10px',
                                borderColor: '#c4c4c4',
                                borderRadius: '4px',
                                resize: 'vertical'
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

export default NewPostPage;
