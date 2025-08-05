import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/forum/PostCard";
import { API_URL } from "../shared";

const HomeForum = () => {
    const [forums, setForums] = useState([]);

    const fetchForums = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/forum`);
            setForums(response.data);
            console.log("Fetched forums:", response.data);
        } catch (error) {
            console.error("Error fetching forums:", error);
        }
    };


    useEffect(() => {
        fetchForums();
    }, []);

    return (
        <div className="forum-page">
            <h1>All Forums</h1>
             <div className="forum-list">
                {forums.map((forum) => (
                    <Link to={`/forum/${forum.id}/posts`} key={forum.id} className="forum-card">
                        <h2>{forum.name}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomeForum;
