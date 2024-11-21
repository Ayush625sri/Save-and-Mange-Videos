import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [video, setVideo] = useState({
    title: '',
    description: '',
    video_url: '',
    publisher_name: '', // Added publisher_name field
  });

  const [thumbnail, setThumbnail] = useState(null); // Store the selected file
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]); // Store the uploaded file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation check (ensure title, video URL, and publisher name are provided)
    if (!video.title || !video.video_url || !video.publisher_name) {
      setError('Title, video URL, and publisher name are required');
      return;
    }

    // Create FormData object to handle both text and file data
    const formData = new FormData();
    formData.append('title', video.title);
    formData.append('description', video.description);
    formData.append('video_url', video.video_url);
    formData.append('publisher_name', video.publisher_name); // Append publisher_name to formData
    if (thumbnail) {
      formData.append('thumbnail', thumbnail); // Append the file if it's selected
    }

    try {
      // Make POST request to create a new video post
      const response = await axios.post(
        'http://localhost:8000/api/create-video/',
        formData, // Send FormData object
        {
          headers: {
            Authorization: `Token ${localStorage.getItem('auth_token')}`, // Add token if needed
            'Content-Type': 'multipart/form-data', // Set content type for file upload
          },
        }
      );

      // Handle successful response
      if (response.status === 201) {
        setSuccessMessage('Video post created successfully!');
        setError('');
        // Redirect to profile or video list after successful post creation
        navigate('/');
      }
    } catch (error) {
      // Handle error response
      setError('Error creating video post');
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4 w-1/2 mx-auto mt-5 shadow-xl pb-10">
      <Typography variant="h5" className="text-center">Create a New Video Post</Typography>

      {error && <Typography color="error" className="my-2">{error}</Typography>}
      {successMessage && <Typography color="success" className="my-2">{successMessage}</Typography>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Title"
          variant="outlined"
          value={video.title}
          onChange={(e) => setVideo({ ...video, title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          variant="outlined"
          value={video.description}
          onChange={(e) => setVideo({ ...video, description: e.target.value })}
          fullWidth
        />
        <TextField
          label="Video URL"
          variant="outlined"
          value={video.video_url}
          onChange={(e) => setVideo({ ...video, video_url: e.target.value })}
          fullWidth
        />
        <TextField
          label="Publisher Name"
          variant="outlined"
          value={video.publisher_name}
          onChange={(e) => setVideo({ ...video, publisher_name: e.target.value })}
          fullWidth
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange} // Handle thumbnail file selection
          className="my-4"
        />
        <Button type="submit" variant="contained" color="primary">
          Create Post
        </Button>
      </form>
    </div>
  );
};

export default UserDashboard;
