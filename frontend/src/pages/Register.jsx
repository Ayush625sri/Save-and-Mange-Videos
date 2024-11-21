import React, { useEffect, useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";

const Register = () => {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already authenticated, redirect them to the homepage
    if (isAuthenticated()) {
      navigate('/'); // Or to the dashboard if desired
    }
  }, [navigate]);
  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation to check if all fields are filled
    if (!userDetails.username || !userDetails.password || !userDetails.email) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Send a POST request to the backend API to register the user
      const response = await axios.post(
        "http://localhost:8000/api/register/",
        userDetails,
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      
      // If registration is successful, redirect to login page
      if (response.status === 201) {
        navigate("/login");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle errors during the registration process
      setErrorMessage(
        "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <div className="register-container p-4 w-1/3 m-auto mt-5 shadow-xl pb-10">
      <Typography variant="h4" className="text-center">
        Register
      </Typography>
      {errorMessage && (
        <Typography color="error" className="text-center">
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col w-1/2 mt-5 mx-auto gap-2">
        <TextField
          label="Username"
          variant="outlined"
          value={userDetails.username}
          onChange={(e) =>
            setUserDetails({ ...userDetails, username: e.target.value })
          }
          fullWidth
          className="my-4"
        />
        <TextField
          label="Email"
          variant="outlined"
          value={userDetails.email}
          onChange={(e) =>
            setUserDetails({ ...userDetails, email: e.target.value })
          }
          fullWidth
          className="my-4"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={userDetails.password}
          onChange={(e) =>
            setUserDetails({ ...userDetails, password: e.target.value })
          }
          fullWidth
          className="my-4"
        />
        
        {/* Link to Login page */}
        <Link to="/login" className="text-right text-xs mb-2">
          Login!
        </Link>

        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
