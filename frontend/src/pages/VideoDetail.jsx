import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button } from '@mui/material';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    // Fetch video details by ID
    fetch(`/api/videos/${id}`)
      .then((response) => response.json())
      .then((data) => setVideo(data))
      .catch((error) => console.error('Error fetching video:', error));
  }, [id]);

  if (!video) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className="video-detail">
      <Typography variant="h4">{video.title}</Typography>
      <iframe src={video.url} title={video.title} width="100%" height="500" />
      <Typography variant="body1">{video.description}</Typography>
      <Button variant="contained" color="primary">
        Like
      </Button>
    </div>
  );
};

export default VideoDetail;
