import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { API_URL } from "../shared";

const PostPage = () => {
    const [post, setPost] = useState([]);
    const {forumId} = useParams();
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
            <h1>Post</h1>
            <div>{post.title}</div>
            <div>{post.content}</div>
        </div>
    );
};

export default PostPage;
