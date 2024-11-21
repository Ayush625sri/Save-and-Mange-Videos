
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const VideoCard = ({ video }) => {
  // Function to get YouTube embed URL from video URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]; // Get video ID from URL
    return `https://www.youtube.com/embed/${videoId}`; // YouTube embed URL format
  };

  // Check if the video URL is a YouTube URL
  const isYouTubeVideo = video && video.video_url.includes('youtube.com/watch');

  return (
    <Card>
      <Box component="div" height="250px" overflow="hidden">
        {isYouTubeVideo ? (
          <iframe
            width="100%"
            height="100%"
            src={getYouTubeEmbedUrl(video.video_url)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Typography variant="body2" color="error" align="center">
            Invalid or unavailable video
          </Typography>
        )}
      </Box>
      <CardContent>
        <Typography variant="h6">{video.title}</Typography>
        <Typography variant="body2" color="textSecondary">
          {video.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {video.publisher_name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
