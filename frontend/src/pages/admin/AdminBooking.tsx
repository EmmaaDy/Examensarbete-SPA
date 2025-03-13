import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';
import '../../styles/AdminBooking.css'; 


const AdminBooking: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    treatmentId: '',
    treatmentName: '',
    description: '',
    price: 0,
    duration: 0,
    category: '',
    name: '',       
    email: '',
    phone: '',      
    date: '',
    time: '',
    payAtSalon: true,  
    paymentMethod: 'Pay at Salon', 
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate(); 

  const [treatments, setTreatments] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/treatments')
      .then((response) => response.json())
      .then((data) => setTreatments(data))
      .catch((error) => console.error('Error fetching treatments:', error));
  }, []);

  const handleTreatmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const treatmentId = e.target.value;
    const treatment = treatments.find((t) => t.treatmentId === treatmentId);

    if (treatment) {
      setFormData({
        ...formData,
        treatmentId: treatment.treatmentId,
        treatmentName: treatment.treatmentName,
        description: treatment.description,
        price: treatment.price,
        duration: treatment.duration,
        category: treatment.category,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validera tiden
    const timeParts = formData.time.split('-');
    if (timeParts.length !== 2) {
      setErrorMessage('Invalid time format. Please use HH:MM-HH:MM.');
      setIsSubmitting(false);
      return;
    }

    const formattedFormData = {
      ...formData,
      time: formData.time, 
    };

    // Logga data för felsökning
    console.log('Sending booking data:', formattedFormData);

    try {
      const response = await fetch('https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFormData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Booking created successfully!');
        navigate('/admin/dashboard'); 
      } else {
        setErrorMessage(data.message || 'Something went wrong!');
      }
    } catch (error) {
      setErrorMessage('Network error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1>Create Booking</h1>
          </div>
          
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="admin-booking-form-container">
          <div className="admin-booking-form-title">Create Booking</div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="admin-booking-form-group">
            <label>Treatment</label>
            <select
              name="treatmentId"
              value={formData.treatmentId}
              onChange={handleTreatmentChange}
              required
            >
              <option value="">Select Treatment</option>
              {treatments.map((treatment) => (
                <option key={treatment.treatmentId} value={treatment.treatmentId}>
                  {treatment.treatmentName}
                </option>
              ))}
            </select>
          </div>

          {formData.treatmentName && (
            <div className="admin-booking-form-group">
              <p><strong>Description:</strong> {formData.description}</p>
              <p><strong>Price:</strong> ${formData.price}</p>
              <p><strong>Duration:</strong> {formData.duration} minutes</p>
            </div>
          )}

          <div className="admin-booking-form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-booking-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-booking-form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-booking-form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-booking-form-group">
            <label>Time</label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
              placeholder="HH:MM-HH:MM"
            />
          </div>

          <div className="admin-booking-form-group">
            <label>
              <input
                type="checkbox"
                name="payAtSalon"
                checked={formData.payAtSalon}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payAtSalon: e.target.checked,
                  })
                }
                disabled
              />
              Pay at Salon
            </label>
          </div>

          <div className="admin-booking-btn-group">
          <button type="submit" disabled={isSubmitting} className="admin-booking-btn">
            {isSubmitting ? 'Submitting...' : 'Create Booking'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')} 
            className="admin-cancel-btn"
          >
            Cancel Booking
          </button>
        </div>

        </form>

        </div>
      </div>
    </div>
  );
};

export default AdminBooking;
