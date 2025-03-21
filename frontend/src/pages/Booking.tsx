import { useState, useEffect } from 'react';
import '../styles/Booking.css';
import { Link } from 'react-router-dom';

type Treatment = {
  treatmentId: string;
  treatmentName: string;
  description: string;
  room: string;
  category: string;
  employee: string;
  price: number;
  duration: number;
};

type FormData = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  treatmentId: string;
  treatmentName: string;
  description: string;
  room: string;
  category: string;
  employee: string;
  comment: string;
  numberOfPeople: number;
};

const Booking = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    treatmentId: '',
    treatmentName: '',
    description: '',
    room: '',
    category: '',
    employee: '',
    comment: '',
    numberOfPeople: 1, // Default to 1 person
  });

  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>(''); // State to store the error message

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch(
          'https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/treatments'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch treatments');
        }
        const data = await response.json();
        setTreatments(data);
        console.log('Fetched treatments:', data);
      } catch (error) {
        console.error('Error fetching treatments:', error);
      }
    };

    fetchTreatments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTreatmentSelection = (treatmentId: string) => {
    const selectedTreatment = treatments.find(
      (treatment) => treatment.treatmentId === treatmentId
    );

    if (selectedTreatment) {
      setFormData({
        ...formData,
        treatmentId: selectedTreatment.treatmentId,
        treatmentName: selectedTreatment.treatmentName,
        description: selectedTreatment.description,
        room: selectedTreatment.room,
        category: selectedTreatment.category,
        employee: selectedTreatment.employee,
      });
    }
  };

  const handleRemoveTreatment = () => {
    setFormData({
      ...formData,
      treatmentId: '',
      treatmentName: '',
      description: '',  
      room: '',
      category: '',
      employee: '',
    });
  };

  // Function to determine max people per category
  const getMaxPeopleForCategory = (category: string) => {
    switch (category) {
      case 'Pool':
      case 'Sauna':
        return 10; 
      case 'Massage':
        return 2;   
      case 'Body Treatment':
      case 'Facial Care':
        return 1;   
      default:
        return 10;  
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const selectedTreatment = treatments.find(
      (treatment) => treatment.treatmentId === formData.treatmentId
    );

    const maxPeople = getMaxPeopleForCategory(formData.category);

    // Check if the number of people exceeds the allowed maximum for this category
    if (formData.numberOfPeople > maxPeople) {
      setErrorMessage(`The maximum number of people for this category (${formData.category}) is ${maxPeople}.`);
      return;
    }

    const bookingDetails = {
      treatmentId: formData.treatmentId,
      treatmentName: formData.treatmentName,
      description: formData.description,
      room: formData.room,
      category: formData.category,
      employee: formData.employee,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      price: selectedTreatment?.price ? selectedTreatment.price * formData.numberOfPeople : 0,
      duration: selectedTreatment?.duration || 0,
      comment: formData.comment,
      numberOfPeople: formData.numberOfPeople,
    };

    console.log('Booking Details:', bookingDetails);

    try {
      const response = await fetch(
        'https://uymonst7eb.execute-api.eu-north-1.amazonaws.com/bookings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingDetails),
        }
      );

      const responseBody = await response.json();

      if (!response.ok) {
        console.error('Server error:', responseBody);
        setErrorMessage(`Booking failed: ${responseBody.message}`);
        return;
      }

      console.log('Booking response:', responseBody);
      alert(`Booking successful! Confirmation: ${responseBody.bookingId}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrorMessage('Booking failed. Please try again later.');
    }
  };

  const groupedTreatments = treatments.reduce((groups, treatment) => {
    const { category } = treatment;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(treatment);
    return groups;
  }, {} as { [key: string]: Treatment[] });

  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxPeople = getMaxPeopleForCategory(formData.category);
    const value = Math.min(Number(e.target.value), maxPeople);
    setFormData({
      ...formData,
      numberOfPeople: value,
    });
  };

  useEffect(() => {
    console.log('Selected category:', formData.category);
  }, [formData.category]);

  return (
    <div className="booking">
      <section className="booking-welcome">
        <h1>Booking</h1>
      </section>

      <div className="booking-message">
        Not sure which treatment is right for you? Give us a call or send us a message—we're happy to guide you!
        <br />
        <a href="/contact" className="booking-contact-link">Contact Us Today!</a>
      </div>

      <section className="booking-section">
        <div className="treatments-list">
          {Object.keys(groupedTreatments).length === 0 ? (
            <p>Loading treatments...</p>
          ) : (
            Object.keys(groupedTreatments).map((category) => (
              <div key={category} className="category-group">
                <h3 className="booking-category-name">{category}</h3>
                {groupedTreatments[category].map((treatment) => (
                  <div key={treatment.treatmentId} className="booking-card">
                    <h4 className="booking-treatment-name">{treatment.treatmentName}</h4>
                    <p>{treatment.description}</p> 
                    <p><strong>Price:</strong> {treatment.duration} min – {treatment.price} £</p>
                    <button
                      onClick={() => handleTreatmentSelection(treatment.treatmentId)}
                      className="booking-button"
                    >
                      Book
                    </button>

                    {formData.treatmentId === treatment.treatmentId && (
                      <div className="selected-treatment">
                        <p><strong>Selected Treatment:</strong> {formData.treatmentName}</p>
                        <button onClick={handleRemoveTreatment} className="remove-treatment-button">
                          Remove Treatment
                        </button>
                      </div>
                    )}

                    {formData.treatmentId === treatment.treatmentId && (
                      <div className="booking-form-section">
                        <h2>Your Details</h2>
                        <form onSubmit={handleBookingSubmit} className="booking-form">
                          <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                          <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                          />
                          <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                          />
                          <input
                            type="number"
                            name="numberOfPeople"
                            placeholder="Number of People"
                            value={formData.numberOfPeople}
                            onChange={handleNumberOfPeopleChange}
                            min="1"
                            max={getMaxPeopleForCategory(formData.category)} 
                          />
                          <textarea
                            name="comment"
                            placeholder="Enter a comment (e.g. additional people for the booking)"
                            value={formData.comment}
                            onChange={handleInputChange}
                            rows={4}
                            style={{ resize: 'none' }} 
                          />
                          
                          {errorMessage && (
                            <div className="error-message">
                              <p>{errorMessage}</p>
                            </div>
                          )}
                          
                          <button type="submit">Book Now</button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}

              </div>
            ))
          )}
        </div>
      </section>
      <section className="booking-section-events">
        <h2>Events</h2>
        <div className="booking-card-events">
          <h3>Customizable Event Packages</h3>
          <Link to="/event/packages" className="booking-link-events">Learn More About Our Event Packages</Link>
        </div>
      </section>
    </div>
  );
};

export default Booking;
