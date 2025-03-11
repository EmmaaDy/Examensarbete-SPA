import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/AdminPanel.css'; 

const AdminPanel: React.FC = () => {
  const [adminID, setAdminID] = useState<string>(''); 
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate(); // useNavigate hook for navigation

  // Function to handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      adminID,
      adminPassword,
      isCreateAdmin: false, 
    };

    try {
      const response = await fetch('https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 200) {
        // If login is successful, save JWT token in localStorage
        localStorage.setItem('jwtToken', data.token);
        // Redirect user to Admin Dashboard
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(data.error || 'Login failed!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className="admin-panel-container">
      <div className="admin-panel-background"></div>
      <h1 className="panel-title">Panel Oceanic Aquarius</h1>
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Admin ID"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default AdminPanel;
