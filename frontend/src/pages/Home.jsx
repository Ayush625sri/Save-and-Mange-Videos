import React from 'react';
import { Typography } from '@mui/material';
import VideoList from '../components/VideoList'; // This will display all videos

const Home = () => {
  return (
    <div className="home-container p-4">
      <Typography variant="h3" gutterBottom className="text-center">
        {/* Welcome to Video Stream */}
      </Typography>
      <div className="video-list mt-4">
        <VideoList /> {/* Display all video posts */}
      </div>
    </div>
  );
};

export default Home;
