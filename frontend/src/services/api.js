const API_URL = 'http://localhost:8000/api';  // Make sure this is your Django API URL

// Create Video Post API
export const createVideoPost = async (videoData) => {
  try {
    const response = await fetch(`${API_URL}/videos/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include token for authenticated requests
      },
      body: JSON.stringify(videoData),
    });
    return response.json();
  } catch (error) {
    console.error('Error creating video post:', error);
  }
};

// Get user dashboard data
export const getUserDashboard = async () => {
  try {
    const response = await fetch(`${API_URL}/user-dashboard/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
  }
};

// Get admin dashboard data
export const getAdminDashboard = async () => {
  try {
    const response = await fetch(`${API_URL}/admin-dashboard/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
  }
};
