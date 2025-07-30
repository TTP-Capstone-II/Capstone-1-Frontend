import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, MenuItem, Popper, Paper, Fade } from '@mui/material';
import "./NavBarStyles.css";

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

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block', position: 'relative', zIndex: 1500 }}
        >
            <Button
                id="dropdown-button"
                aria-controls={open ? 'dropdown-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                className="nav-link"
                sx={{ textTransform: 'none' }}
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
                                position: 'relative',
                                zIndex: 1500,
                            }}
                        >
                            <MenuItem component={NavLink} to="/free-fall" onClick={handleMenuItemClick}>
                                FreeFall
                            </MenuItem>
                            <MenuItem component={NavLink} to="/intertia" onClick={handleMenuItemClick}>
                                Inertia
                            </MenuItem>
                            <MenuItem component={NavLink} to="/projectile-motion" onClick={handleMenuItemClick}>
                                Projectile motion
                            </MenuItem>
                            <MenuItem component={NavLink} to="/friction" onClick={handleMenuItemClick}>
                                Friction
                            </MenuItem>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
}
