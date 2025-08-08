import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Simulation from "./components/Simulation";
import Simulations from "./pages/Simulations";
<<<<<<< Updated upstream
=======
import { API_URL, SOCKETS_URL, NODE_ENV } from "./shared";
import { io } from "socket.io-client";
import socket from "./socket";
>>>>>>> Stashed changes
import FreeFall from "./pages/FreeFall";
import ProjectileMotion from "./pages/ProjectileMotion";
import IndividualForum from "./pages/IndividualForum";
import HomeForum from "./pages/HomeForum";
import PostPage from "./pages/PostPage";
import NewPostPage from "./pages/NewPostPage";
import Friction from "./pages/Friction";
import Inertia from "./pages/Inertia";
<<<<<<< Updated upstream
import { API_URL } from "./shared";
import Torque from "./pages/Torque";
import ReplyList from "./components/forum/ReplyList";
=======
import Torque from "./pages/Torque";
import ReplyList from "./components/forum/ReplyList";
import WhiteboardRoom from "./pages/WhiteboardRoom";
import WhiteboardLanding from "./pages/WhiteboardLanding";


>>>>>>> Stashed changes

const App = () => {
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch {
      console.log("Not authenticated");
      setUser(null);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔗 Connected to socket");
    });
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // Logout from our backend
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/free-fall" element={<FreeFall />} />
          <Route path="/projectile-motion" element={<ProjectileMotion />} />
          <Route path="/torque" element={<Torque />} />
          <Route path="/friction" element={<Friction />} />
          <Route path="/inertia" element={<Inertia />} />
          <Route exact path="/" element={<Home />} />
          <Route path="/forum" element={<HomeForum />} />
          <Route path="/forum/:forumId/posts" element={<IndividualForum />} />
<<<<<<< Updated upstream
          <Route path="/forum/:forumId/posts/:postId" element={<PostPage />} />
          <Route path="/forum/:forumId/posts/new-post" element={<NewPostPage user={user}/>} />
=======
          <Route
            path="/forum/:forumId/posts/:postId"
            element={<PostPage user={user} />}
          />
          <Route
            path="/forum/:forumId/posts/new-post"
            element={<NewPostPage user={user} />}
          />
          <Route path="/whiteboard" element={<WhiteboardLanding />} />
          <Route path="/whiteboard/:roomId" element={<WhiteboardRoom  user={user}/>} />
>>>>>>> Stashed changes
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
