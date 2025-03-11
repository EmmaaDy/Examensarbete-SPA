import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if JWT token exists in localStorage
    const token = localStorage.getItem('jwtToken');
    if (!token) {

      // If no token exists, redirect user to login page
      navigate('/admin');
    } else {
      
      // If token exists, set user as authenticated
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove JWT token from localStorage
    localStorage.removeItem('jwtToken');
    // Redirect to login page
    navigate('/admin');
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome to the Admin Dashboard</h1>
          <p>You are logged in successfully.</p>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
