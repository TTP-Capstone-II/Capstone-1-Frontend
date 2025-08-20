import React from "react";
import { NavLink, Link } from "react-router-dom";
import Dropdown from "./Dropdown.jsx";
import "./NavBarStyles.css";
import { Button } from "@mui/material";

const NavBar = ({ user, onLogout, checkingAuth, theme, setTheme }) => {
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to="/">Capstone II</NavLink>
      </div>
      <Button onClick={toggleTheme} className="nav-link" style={{ marginLeft: "1rem" }}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </Button>

      <div className="nav-links">
        {checkingAuth ? (
          <span className="loading-text">Loading...</span>
        ) : user ? (
          <div className="user-section">
            <span className="username">Welcome, {user.username}!</span>
            <Dropdown />
            <NavLink to="/whiteboard" className="nav-link">
              Whiteboard
            </NavLink>
            <NavLink to="/forum" className="nav-link">
              Forum
            </NavLink>
            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/signup" className="nav-link">
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};


export default NavBar;
