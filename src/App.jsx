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
import FreeFall from "./pages/FreeFall";
import ProjectileMotion from "./pages/ProjectileMotion";
import IndividualForum from "./pages/IndividualForum";
import HomeForum from "./pages/HomeForum";
import PostPage from "./pages/PostPage";
import NewPostPage from "./pages/NewPostPage";
import Friction from "./pages/Friction";
import Inertia from "./pages/Inertia";
import { API_URL } from "./shared";
import Torque from "./pages/Torque";
import ReplyList from "./components/forum/ReplyList";
import WhiteboardRoom from "./pages/WhiteboardRoom";
import WhiteboardLanding from "./pages/WhiteboardLanding";
import Profile from "./pages/Profile";
import socket from "./socket";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Sandbox from "./pages/Sandbox";
import LandingPage from "./pages/LandingPage";

const App = () => {
  const [user, setUser] = useState(null);
  const {
    isAuthenticated,
    user: auth0User,
    logout: auth0Logout,
    isLoading,
  } = useAuth0();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = async () => {
    setCheckingAuth(true); // Start loading

    console.log("Auth0 isAuthenticated:", isAuthenticated);
    console.log("Auth0 user:", auth0User);

    try {
      if (isAuthenticated && auth0User) {
        const response = await axios.post(
          `${API_URL}/auth/auth0-login`,
          {
            auth0Id: auth0User.sub, // 👈 This is the unique Auth0 ID
            email: auth0User.email,
            username: auth0User.name,
            picture: auth0User.picture,
          },
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
      } else {
        const response = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Not authenticated", error);
      setUser(null);
    } finally {
      setCheckingAuth(false); // Done loading
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🔗 Connected to socket");
    });
  }, []);

  // Check authentication status on app load
  useEffect(() => {
    // Only check auth if Auth0 is done loading
    if (!isLoading) {
      checkAuth();
    }
  }, [isLoading, isAuthenticated, auth0User]); // Watch all 3

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
      <NavBar user={user} onLogout={handleLogout} checkingAuth={checkingAuth} />
      <div className="app">
        <Routes>
          "
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/free-fall" element={<FreeFall user={user} />} />
          <Route path="/free-fall/:simId" element={<FreeFall user={user} />} />
          <Route
            path="/projectile-motion"
            element={<ProjectileMotion user={user} />}
          />
          <Route path="/torque" element={<Torque user={user} />} />
          <Route path="/friction" element={<Friction user={user} />} />
          <Route path="/inertia" element={<Inertia user={user} />} />
          <Route path="/sandbox" element={<Sandbox user={user} />} />
          <Route exact path="/" element={<Home user={user} />} />
          <Route path="/forum" element={<HomeForum />} />
          <Route path="/forum/:forumId/posts" element={<IndividualForum />} />
          <Route path="landing-page" element={<LandingPage />} />
          <Route
            path="/forum/:forumId/posts/:postId"
            element={<PostPage user={user} />}
          />
          <Route
            path="/forum/:forumId/posts/new-post"
            element={<NewPostPage user={user} />}
          />
          <Route path="/whiteboard" element={<WhiteboardLanding />} />
          <Route
            path="/whiteboard/:roomId"
            element={<WhiteboardRoom user={user} />}
          />
          <Route path="profile" element={<Profile user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

const Root = () => {
  return (
    <Auth0Provider
      domain="dev-w5l850kkmucq6zqz.us.auth0.com"
      clientId="cDmT65DZoqL5KVWOXj9vrLh2jFyPQxYi"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
