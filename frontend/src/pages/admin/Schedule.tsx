import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/AdminDashboard.css'; 

const Schedule: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate(); 

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-content">
        <div className="admin-dashboard-navbar">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="admin-dashboard-menu-toggle-button"
          >
            ☰
          </button>
        </div>
        <div className={`admin-dashboard-sidebar ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={() => navigate('/admin/dashboard')}>Dashboard</li>
            <li onClick={() => navigate('/admin/schedule')}>Schedule</li>
            <li onClick={() => navigate('/admin/booking')}>Booking</li>
            <li onClick={() => navigate('/admin/notifications')}>Notifications</li>
            <li onClick={() => navigate('/admin/settings')}>Settings</li>
          </ul>
        </div>
        <div className={`admin-dashboard-main-content ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="admin-dashboard-centered-content">
          <h1>Schedule</h1>
          </div>
          <p>This is the schedule page.</p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
