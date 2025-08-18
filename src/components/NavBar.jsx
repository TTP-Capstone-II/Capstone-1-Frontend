import React from "react";
import { NavLink, Link } from "react-router-dom";
import Dropdown from "./Dropdown.jsx";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout, checkingAuth }) => {
  console.log("Navbar user:", user);
  return (
    <nav className="navbar" style={{ backgroundColor: "#F19648" }}>
      <div className="nav-brand">
        <NavLink to="/">Capstone II</NavLink>
      </div>

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
