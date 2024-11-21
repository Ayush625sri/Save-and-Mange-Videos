import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import VideoCard from './VideoCard'; // Component to display each video

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch video data from your backend or API using Axios
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/videos/');
        setVideos(response.data); // Set the video data to the state
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (<>
      {videos.length == 0 ? <div className='text-center text-2xl font-bold'>No Videos to Show</div> : 
    <div className="video-list-container p-4">
      <Typography variant="h4" gutterBottom>
        All Videos
      </Typography>
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <VideoCard video={video} /> {/* Display each video in a card */}
          </Grid>
        ))}
      </Grid>
      </div>
    }
    </>
  );
};

export default VideoList;
