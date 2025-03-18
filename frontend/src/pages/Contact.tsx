import '../styles/Contact.css'
import pattern3 from '../assets/green-pattern3.png'
import leaf from '../assets/leaf.png';
import location from '../assets/locatiom-map.png'

const Contact = () => {
    return (
      <div className="contact">
        <section className="contact-header">
          <h1>Contact</h1>
        </section>

        <div className="contact-bg-pattern">
          <img src={pattern3} alt="" />
        </div>

        <section className="contact-get-in-touch">
          <h2>get in touch!</h2>
          <p className="p1">
            We love hearing from our customers. Whether you have questions about our services, 
            want to book a treatment, or need assistance with planning your next visit, we're here to help!
          </p>
          <p className="p2">Reach Out To Us Using The Form Below Or Contact Us Directly.</p>
        </section>

        <section className="contact-opening-hours">
          <p className="p1">Opening Hours</p>
          <p className="p2">Monday – Friday: 8:30 AM – 6:00 PM <br /> Saturday – Sunday: 9:00 AM – 5:00 PM</p>
          <img src={leaf} alt="decorative leaf" className="contact-leaf" />
        </section>

        <section className="contact-section">
          <div className="map-container">
            <h2>Find Us on the Map</h2>
            <p>Visit us in person!</p>
            <div className="map-placeholder">
              <img src={location} alt="location-map" className='contact-map' />
            </div>
          </div>

          <div className="contact-form">
            <h2>Contact Form</h2>
            <p><em>
              Have a Question Or Want To Book?<br />
              Fill Out The Form Below,<br />
              And We'll Get Back To You As Soon As Possible.
            </em></p>

            <form className='form'>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Message"></textarea>
              <button type="submit">SEND MESSAGE</button>
            </form>
          </div>
        </section>
      </div>
    );
};

export default Contact;