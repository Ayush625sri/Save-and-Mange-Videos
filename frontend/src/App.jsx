import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import VideoList from "./components/VideoList";
import VideoDetail from "./pages/VideoDetail";
import NavBar from "./components/Navbar";
import { isAuthenticated, isAdmin } from "./utils/auth"; // import auth checks
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuthenticated();
      if (authStatus) {
        const adminStatus = await isAdmin();
        setIsUserAdmin(adminStatus);
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <div className="App">
        <NavBar loginStatus={loginStatus}  />
        <Routes>
          <Route path="/login" element={<Login setLoginStatus={setLoginStatus}  />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/user-dashboard"
            element={
              isAuthenticated() ? <UserDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              isAdmin ? <AdminDashboard /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/videos"
            element={
              isAuthenticated() ? <VideoList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/videos/:id"
            element={
              isAuthenticated() ? <VideoDetail /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
