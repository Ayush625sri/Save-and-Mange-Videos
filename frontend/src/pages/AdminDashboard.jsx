import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState(''); // State to control which list to display

  useEffect(() => {
    // Fetch videos and users from the backend
    const fetchData = async () => {
      try {
        const videoResponse = await axios.get('http://localhost:8000/api/admin-dashboard/', {
          headers: { Authorization: `Token ${localStorage.getItem('auth_token')}` }
        });
        setVideos(videoResponse.data.videos);  // Assuming the response has a 'videos' array
        setUsers(videoResponse.data.users);    // Assuming the response has a 'users' array
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Error:', err);
      }
    };
    
    fetchData();
  }, []);

  const handleDeleteVideo = async (videoId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-video/${videoId}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('auth_token')}` },
      });
      setVideos(videos.filter((video) => video.id !== videoId)); // Remove the deleted video from state
    } catch (error) {
      setError('Error deleting video');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-user/${userId}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('auth_token')}` },
      });
      setUsers(users.filter((user) => user.id !== userId)); // Remove the deleted user from state
    } catch (error) {
      setError('Error deleting user');
    }
  };

  return (
    <div className="admin-dashboard p-4">
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      {/* Buttons to toggle between Manage Users and Manage Videos */}
      <div className="my-4 flex gap-4 ">
        <Button className='mx-4' variant="contained" color="primary" onClick={() => setView('users')}>
          Manage Users
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setView('videos')} className="m-4">
          Manage Videos
        </Button>
      </div>

      {/* Conditionally render Manage Users or Manage Videos based on the `view` state */}
      {view === 'users' && (
        <div className="my-4">
          <Typography variant="h6">Manage Users</Typography>
          <Grid container spacing={3}>
            {users.map((user,idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{user.username}</Typography>
                    <Typography variant="body2">{user.email}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {view === 'videos' && (
        <div className="my-4">
          <Typography variant="h6">Manage Videos</Typography>
          <Grid container spacing={3}>
            {videos.map((video, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                {console.log(video)}
                <Card>
                  <CardContent>
                    <Typography variant="h6">{video.title}</Typography>
                    <Typography variant="body2">{video.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
