import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Box, TextareaAutosize, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useParams } from "react-router";
import { API_URL } from "../shared";

const NewPostPage = () => {
    const [post, setPost] = useState([]);
    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [content, setContent] = useState("");
    const forumId = 1;
    let params = useParams();
    const fetchPost = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/forum/${forumId}/posts/${params.postId}`);
            setPost(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div className="forum-page">
            <h1>New Post</h1>
            <Box
                component="form"
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}
            >
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                />

                <Box>
                    <InputLabel id="topic-label">Forum Topic</InputLabel>
                    <Select
                        labelId="topic-label"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="FreeFall">FreeFall</MenuItem>
                        <MenuItem value="Inertia">Inertia</MenuItem>
                        <MenuItem value="Torque">Torque</MenuItem>
                        <MenuItem value="Friction">Friction</MenuItem>
                    </Select>
                </Box>

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
        </div>
    );
};

export default NewPostPage;
