import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminDashboard.css';

const Schedule: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<any[]>([]); // Schedule data
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);  // Available times
  const [lunchTimes, setLunchTimes] = useState<string[]>([]);  // Lunch times
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [selectedEmployee, setSelectedEmployee] = useState<string>(''); // Track selected employee
  const employees: string[] = ['Victoria', 'Emma', 'Olivia', 'Isabella']; // List of employees (static for now)
  const navigate = useNavigate();

  // Fetch JWT token from local storage
  const token = localStorage.getItem('jwtToken');  // Ensure token is saved during login

  const fetchSchedule = async (employee: string) => {
    if (!token) {
      setError('Authorization token is missing');
      return;
    }

    setLoading(true);  // Start loading

    try {
      const response = await axios.get(
        `https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/admin/schedule/${employee}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Send token in header
          },
        }
      );

      // Check if the response data exists before updating state
      if (response.data) {
        setSchedule(response.data.schedule || []);
        setAvailableTimes(response.data.schedule.filter((slot: any) => slot.isAvailable).map((slot: any) => slot.time));
        setLunchTimes(response.data.schedule.filter((slot: any) => !slot.isAvailable && slot.time >= '12:00' && slot.time < '13:00').map((slot: any) => slot.time));  // Set lunch times
      } else {
        setError('No data received from the API');
      }
      setError(null);  // Clear any previous errors
    } catch (error) {
      setError('Could not fetch schedule data');
      console.error('Error fetching schedule data:', error);  // Improved error logging
    } finally {
      setLoading(false);  // End loading
    }
  };

  // Handle when an employee is selected
  const handleEmployeeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const employee = event.target.value;
    setSelectedEmployee(employee);
    fetchSchedule(employee);  // Fetch schedule for selected employee
  };

  useEffect(() => {
    if (selectedEmployee) {
      fetchSchedule(selectedEmployee); // Fetch schedule if employee is already selected
    }
  }, [selectedEmployee]);

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

          <div>
            <label htmlFor="employee-select">Select Employee: </label>
            <select
              id="employee-select"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
            >
              <option value="">-- Select an employee --</option>
              {employees.map((employee, index) => (
                <option key={index} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>

          {error && <p>{error}</p>}

          {/* Loading State */}
          {loading && <p>Loading...</p>}

          {/* Show available times */}
          <div>
            <h3>Available Times:</h3>
            {Array.isArray(availableTimes) && availableTimes.length > 0 ? (
              <ul>
                {availableTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            ) : (
              <p>No available times.</p>
            )}
          </div>

          {/* Show lunch times */}
          <div>
            <h3>Lunch Times:</h3>
            {Array.isArray(lunchTimes) && lunchTimes.length > 0 ? (
              <ul>
                {lunchTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul>
            ) : (
              <p>No lunch times.</p>
            )}
          </div>

          {/* Show bookings */}
          {!error && Array.isArray(schedule) && schedule.length > 0 ? (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Treatment Name</th>
                  <th>Customer Name</th>
                  <th>Room</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th>Time</th>
                  <th>Duration (mins)</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking.bookingId}</td>
                    <td>{booking.treatmentName}</td>
                    <td>{booking.customerName}</td>
                    <td>{booking.room}</td>
                    <td>{booking.price}</td>
                    <td>{booking.status}</td>
                    <td>{booking.paymentMethod}</td>
                    <td>{booking.time}</td>
                    <td>{booking.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No schedule found for this employee.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
