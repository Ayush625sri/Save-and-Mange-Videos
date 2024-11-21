import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Menu, MenuItem } from '@mui/material';

const NavBar = ({loginStatus}) => {
  const [anchorEl, setAnchorEl] = useState(null); // For managing dropdown menu
  const [authAnchorEl, setAuthAnchorEl] = useState(null); // For managing Login/Register dropdown
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  // Check authentication and user type on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsAuthenticated(true); // User is authenticated
      setIsAdmin(adminStatus);  // Check if user is an admin
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [loginStatus]);

  const handleAccountMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the Account dropdown menu
  };

  const handleAuthMenuClick = (event) => {
    setAuthAnchorEl(event.currentTarget); // Open the Login/Register dropdown menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the Account dropdown menu
    setAuthAnchorEl(null); // Close the Login/Register dropdown menu
  };

  const handleLogout = () => {
    // Clear token or authentication info (e.g., localStorage, cookies)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false); // Mark user as logged out
    navigate('/login'); // Redirect to login page after logout
    handleMenuClose();
  };

  const redirectToDashboard = () => {
    if (isAdmin) {
      navigate('/admin-dashboard');
    } else {
      navigate('/user-dashboard');
    }
  };

  return (
    <AppBar position="sticky" sx={{ alignItems: 'center' }}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={redirectToDashboard}>
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profile
            </Button>
            <Button color="inherit" onClick={handleAccountMenuClick}>
              Account
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={handleAuthMenuClick}>
              Account
            </Button>
            <Menu
              anchorEl={authAnchorEl}
              open={Boolean(authAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
              <MenuItem onClick={() => navigate('/register')}>Register</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
