import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';

const Login = ({setLoginStatus}) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already authenticated, redirect them to the homepage
    if (isAuthenticated()) {
      navigate('/'); // Or to the dashboard if desired
    }
  }, [navigate]);

  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the credentials before sending to API (you can also add client-side validation)
    if (!credentials.username || !credentials.password) {
      setErrorMessage('Both username and password are required.');
      return;
    }

    try {
      // Sending the login request to the backend API
      const response = await axios.post('http://localhost:8000/api/login/', credentials, {
        withCredentials: true, // To ensure cookies are sent with the request
      });

      // If login is successful, save the is_admin status in localStorage
      if (response.data.detail === 'Login successful.') {
        localStorage.setItem('auth_token', response.data.auth_token)
        localStorage.setItem('isAdmin', response.data.is_admin.toString()); // Store admin status
        localStorage.setItem('username', credentials.username); // Optionally store username as well
        setLoginStatus(prev => !prev); 
        navigate('/'); // Redirect to homepage or dashboard
      } else {
        setErrorMessage('Invalid credentials.');
      }
    } catch (error) {
      // If there's an error in the request
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-container p-4 w-1/3 m-auto mt-5 shadow-xl pb-10">
      <Typography variant="h4" className='text-center'>Login</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <form onSubmit={handleSubmit} className='flex flex-col w-1/2 mt-5 mx-auto gap-2'>
        <TextField
          label="Username"
          variant="outlined"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          fullWidth
          className="my-4"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          fullWidth
          className="my-4"
        />
        <Link to="/register" className="text-right text-xs mb-2">Register Here!</Link>
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>

      </form>
    </div>
  );
};

export default Login;
