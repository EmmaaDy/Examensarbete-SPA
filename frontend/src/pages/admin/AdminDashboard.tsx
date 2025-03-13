import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';

interface Booking {
  bookingId: string;
  treatmentName: string;
  customerName: string;
  room: string;
  time: string;
  date: string;
  price: number;
  status: string;
  paymentMethod: string;
  staffName: string;
}

const getTodayDate = () => new Date();

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(getTodayDate());
  const [openBookingId, setOpenBookingId] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'confirm' | 'cancel' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if JWT token exists in localStorage
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      // If no token exists, redirect user to login page
      navigate('/admin');
    } else {
      setIsAuthenticated(true);
      fetchBookings(selectedDate.toISOString().split('T')[0]);
    }
  }, [navigate, selectedDate]);

  const fetchBookings = async (date: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(
        `https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/admin/bookings?date=${date}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        const processedBookings = data.bookings.map((booking: any) => ({
          bookingId: booking.bookingId.S,
          treatmentName: booking.treatmentName.S,
          customerName: booking.name.S,
          room: booking.category.S,
          time: booking.time.S,
          date: booking.date.S,
          price: parseFloat(booking.price.N),
          status: booking.status ? booking.status.S : 'Pending',
          paymentMethod: booking.paymentMethod ? booking.paymentMethod.S : 'Not Specified',
          staffName: booking.staffName ? booking.staffName.S : 'Not Assigned', 
        }));
        setBookings(processedBookings);
      } else {
        setErrorMessage('Failed to load bookings.');
      }
    } catch (error) {
      setErrorMessage('Network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (direction: 'next' | 'prev') => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(currentDate);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    try {
      const response = await fetch(
        `https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/admin/bookings/status/${bookingId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId, status: newStatus }),
        }
      );

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        setOpenBookingId(null); 
        setStatusType(null);   
      } else {
        console.error('Failed to update booking status.');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const toggleStatusOptions = (bookingId: string, type: 'confirm' | 'cancel') => {
    if (openBookingId === bookingId && statusType === type) {
      setOpenBookingId(null); 
      setStatusType(null);
    } else {
      setOpenBookingId(bookingId); 
      setStatusType(type);
    }
  };

  const handleLogout = () => { 
    localStorage.removeItem('jwtToken');
    navigate('/admin');
  };

  return (
    <div className="admin-dashboard">
      {isAuthenticated ? (
        <div className="admin-dashboard-content">
          <div className="admin-dashboard-navbar">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="admin-dashboard-menu-toggle-button">
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
              <h1>Welcome to the Dashboard</h1>
              <p>Manage and track all bookings for the selected date. Update the status as necessary.</p>
            </div>

            <div className="admin-dashboard-date-navigation">
              <button onClick={() => handleDateChange('prev')}>Previous Day</button>
              <div>
                <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date as Date)} dateFormat="yyyy-MM-dd" />
              </div>
              <button onClick={() => handleDateChange('next')}>Next Day</button>
            </div>

            {isLoading && <p>Loading bookings...</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="admin-dashboard-schedule">
              <h3>All Bookings</h3>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Customer Name</th>
                    <th>Treatment Type</th>
                    <th>Room</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Staff Member</th> 
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter((b) => b.date === selectedDate.toISOString().split('T')[0]).length > 0 ? (
                    bookings
                      .filter((b) => b.date === selectedDate.toISOString().split('T')[0])
                      .map((booking) => (
                        <tr key={booking.bookingId}>
                          <td>{booking.time}</td>
                          <td>{booking.customerName}</td>
                          <td>{booking.treatmentName}</td>
                          <td>{booking.room}</td>
                          <td>£{booking.price.toFixed(2)}</td>
                          <td>{booking.status}</td>
                          <td>{booking.paymentMethod}</td>
                          <td>{booking.staffName}</td> 
                          <td>
                            <button onClick={() => toggleStatusOptions(booking.bookingId, 'confirm')}>✔️</button>
                            <button onClick={() => toggleStatusOptions(booking.bookingId, 'cancel')}>❌</button>
                            {openBookingId === booking.bookingId && (
                              <div>
                                {statusType === 'confirm' && (
                                  <div>
                                    <button onClick={() => updateBookingStatus(booking.bookingId, 'Confirmed')}>Confirmed</button>
                                    <button onClick={() => updateBookingStatus(booking.bookingId, 'Completed')}>Completed</button>
                                  </div>
                                )}
                                {statusType === 'cancel' && (
                                  <div>
                                    <button onClick={() => updateBookingStatus(booking.bookingId, 'Cancelled')}>Cancelled</button>
                                    <button onClick={() => updateBookingStatus(booking.bookingId, 'No Show')}>No Show</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={9}>No bookings available for {selectedDate.toISOString().split('T')[0]}.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button onClick={handleLogout} className="admin-dashboard-logout-btn">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
