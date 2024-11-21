import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    first_name: localStorage.getItem('first_name') || '',
    last_name: localStorage.getItem('last_name') || '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    try {
      console.log(localStorage.getItem('auth_token'))
      const response = await axios.put(
        'http://localhost:8000/api/profile/update/',
        {
          username: profile.username,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('auth_token')}`, // Send token for authentication
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Profile updated successfully.');
        // Optionally, update localStorage with new values
        localStorage.setItem('username', profile.username);
        localStorage.setItem('email', profile.email);
        localStorage.setItem('first_name', profile.first_name);
        localStorage.setItem('last_name', profile.last_name);
      } else {
        setErrorMessage('Failed to update profile.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the profile.');
    }
  };

  return (
    <div className="profile-container p-4 w-1/3 m-auto mt-5 shadow-xl pb-10">
      <Typography variant="h4" className="text-center">My Profile</Typography>

      {errorMessage && <Typography color="error" className="my-2">{errorMessage}</Typography>}
      {successMessage && <Typography color="success" className="my-2">{successMessage}</Typography>}

      <form className="flex flex-col w-1/2 mt-5 mx-auto gap-2">
        <TextField
          label="Username"
          variant="outlined"
          value={profile.username}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
          fullWidth
          className="my-4"
        />
        <TextField
          label="Email"
          variant="outlined"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          fullWidth
          className="my-4"
        />
        <TextField
          label="First Name"
          variant="outlined"
          value={profile.first_name}
          onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
          fullWidth
          className="my-4"
        />
        <TextField
          label="Last Name"
          variant="outlined"
          value={profile.last_name}
          onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
          fullWidth
          className="my-4"
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Profile;
