import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Button, MenuItem, Popper, Paper, Fade } from "@mui/material";
import "./NavBarStyles.css";
import "../AppStyles.css";

export default function Dropdown() {
  const [anchorEl, setAnchorEl] = useState(null);
  const containerRef = useRef(null);
  const closeTimer = useRef(null);

  const handleMouseEnter = (event) => {
    clearTimeout(closeTimer.current);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  const handleMenuItemClick = () => {
    clearTimeout(closeTimer.current);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const menuItemStyles = {
    color: "var(--navbar-color)",
    backgroundColor: "#var(--navbar-color)",
    "&:hover": {
      backgroundColor: "var(--navbar-color)",
      color: "var(--navbar-text)",
    },
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block", position: "relative", zIndex: 1500 }}
    >
      <Button
        id="dropdown-button"
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        className="nav-link"
        sx={{ textTransform: "none", color: "var(--navbar-text)", fontSize: "1rem" }}
      >
        Simulation Topics
      </Button>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        disablePortal={true}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              id="dropdown-menu"
              elevation={3}
              sx={{
                position: "relative",
                zIndex: 1500,
                backgroundColor: "var(--navbar-text)",
              }}
            >
              <MenuItem
                component={NavLink}
                to="/free-fall"
                onClick={handleMenuItemClick}
                sx={menuItemStyles}
              >
                FreeFall
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/inertia"
                onClick={handleMenuItemClick}
                sx={menuItemStyles}
              >
                Inertia
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/projectile-motion"
                onClick={handleMenuItemClick}
                sx={menuItemStyles}
              >
                Projectile motion
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/friction"
                onClick={handleMenuItemClick}
                sx={menuItemStyles}
              >
                Friction
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/torque"
                onClick={handleMenuItemClick}
                sx={menuItemStyles}
              >
                Torque
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/sandbox"
                onClick={handleMenuItemClick}
                sx={menuItemStyles}
              >
                Sandbox
              </MenuItem>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
