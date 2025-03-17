import { Link } from 'react-router-dom';
import '../styles/Booking.css';

const Booking = () => {
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

      {/* Massage Treatments Section */}
      <section className="booking-section">
        <h2>Massage Treatments</h2>
        <div className="booking-card">
          <h3>Relaxing Spa Massage</h3>
          <p>A soothing full-body massage to release tension and stress. Can be booked individually, for a couple.</p>
          <p><strong>Price:</strong> 60 min – 75 £</p>
          <button className="booking-button">Book</button>
        </div>
        <div className="booking-card">
          <h3>Himalayan Salt Massage</h3>
          <p>Detox and rejuvenate with a warm Himalayan salt stone massage.</p>
          <p><strong>Price:</strong> 60 min – 85 £</p>
          <button className="booking-button">Book</button>
        </div>
        <div className="booking-card">
          <h3>Deep Tissue Massage</h3>
          <p>Focused massage to relieve deep muscle tension and pain.</p>
          <p><strong>Price:</strong> 60 min – 80 £</p>
          <button className="booking-button">Book</button>
        </div>
      </section>

      {/* Body Care Treatments Section */}
      <section className="booking-section">
        <h2>Body Care Treatments</h2>
        <div className="booking-card">
          <h3>Body Scrub & Hydration</h3>
          <p>Exfoliate and revitalize your skin with a full-body scrub and hydration.</p>
          <p><strong>Price:</strong> 45 min – 80 £</p>
          <button className="booking-button">Book</button>
        </div>
        <div className="booking-card">
          <h3>Aromatherapy Wrap</h3>
          <p>Relax and detox in a luxurious aromatic body wrap.</p>
          <p><strong>Price:</strong> 60 min – 50 £</p>
          <button className="booking-button">Book</button>
        </div>
      </section>

      {/* Face Care Treatment Section */}
      <section className="booking-section">
        <h2>Face Care Treatments</h2>
        <div className="booking-card">
          <h3>Hydrating Facial</h3>
          <p>Nourish and hydrate your skin with our gentle face treatment.</p>
          <p><strong>Price:</strong> 45 min – 70 £</p>
          <button className="booking-button">Book</button>
        </div>
        <div className="booking-card">
          <h3>Anti-Aging Facial</h3>
          <p>Smooth fine lines and rejuvenate your skin with premium products.</p>
          <p><strong>Price:</strong> 60 min – 75 £</p>
          <button className="booking-button">Book</button>
        </div>
      </section>

      {/* Sauna Experiences Section */}
      <section className="booking-section">
        <h2>Sauna Experiences</h2>
        <div className="booking-card">
          <h3>Indoor Sauna Session</h3>
          <p>Enjoy a private and cozy sauna experience indoors. Can be booked individually, for a couple, or for a group of 6.</p>
          <p><strong>Price:</strong> 60 min – 50 £</p>
          <button className="booking-button">Book</button>
        </div>
        <div className="booking-card">
          <h3>Outdoor Sauna Experience</h3>
          <p>Immerse in nature with our outdoor sauna, perfect for relaxation. Can be booked individually, for a couple, or for a group of 6.</p>
          <p><strong>Price:</strong> 60 min – 60 £</p>
          <button className="booking-button">Book</button>
        </div>
      </section>

      {/* Relax & Bubble Pool Section */}
      <section className="booking-section">
        <h2>Relax & Bubble Pool</h2>
        <div className="booking-card">
          <h3>Bubble Pool & Relax Area</h3>
          <p>Unwind in our luxurious bubble pool and relaxation lounge. Can be booked by groups of up to 10 people.</p>
          <p><strong>Price:</strong> 90 min – 70 £</p>
          <button className="booking-button">Book</button>
        </div>
      </section>

      {/* Events Section */}
      <section className="booking-section-events">
        <h2>Events</h2>
        <div className="booking-card-events">
          <h3>Customizable Event Packages</h3>
          <p>Plan your perfect event with our tailored packages, perfect for any occasion.</p>
          <Link to="/event/packages" className="booking-link-events">Learn More About Our Event Packages</Link>
          </div>
      </section>

    </div>
  );
};

export default Booking;
