
export const isAuthenticated = () => {
    // Check if auth_token is stored in localStorage
    const token = localStorage.getItem('auth_token');
    
    // If auth_token exists, the user is authenticated
    return token ? true : false;
  };
  

  export const isAdmin = () => {
    // Retrieve the isAdmin value from localStorage
    const isAdmin = localStorage.getItem('isAdmin');
    
    // Return true if the user is an admin, otherwise false
    return isAdmin === 'true';
  };
  