import { Link } from 'react-router-dom';

import serviceImage1 from '../assets/1.png';
import serviceImage2 from '../assets/2.png';
import serviceImage3 from '../assets/3.png';
import serviceImage4 from '../assets/03.png';

import serviceImage5 from '../assets/sauna.png';
import serviceImage6 from '../assets/OutdoorSauna.png';
import serviceImage7 from '../assets/massage.png';
import serviceImage8 from '../assets/face.png';
import serviceImage9 from '../assets/pool.png';

import serviceImage10 from '../assets/green.png';

import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Welcome Section */}
      <section className="home-welcome">
        <h1>Welcome to Oceanic Aquarius</h1>
      </section>

      {/* Our Services Section */}
      <section className="home-our-services">
        <div className="home-our-services-container">
          <div className="home-our-services-text">
            <h2>Our Services</h2>
            <h3>Take A Deep Breath And Just Enjoy Life</h3>
            <p>Discover a world of relaxation and rejuvenation. Explore our range of spa treatments designed to soothe your body and mind. Let us take care of you – because you deserve it.</p>
            <Link to="/services">View Services</Link>
          </div>

          <div className="home-service-image">
            <img src={serviceImage10} alt="Service 10" />
          </div>
        </div>

       {/* Other service images */}
        <div className="home-service-images">
          <div className="image-row">
            <img src={serviceImage1} alt="Service 1" />
            <div className="home-service-images-background-container">
              <img src={serviceImage3} alt="Service 3" /> 
            </div>
          </div>
          <div className="image-row">
            <img src={serviceImage2} alt="Service 2" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="home-about-us">
        <div className="home-about-us-container">
          <div className="home-about-us-text">
            <h2>About Us</h2>
            <h3>A Healthy Body Is A Guest-Chamber For The Soul</h3>
            <p>
            Our philosophy is built on the belief that true well-being starts with self-care. At Oceanic Aquarius, 
            we are dedicated to creating a serene space where you can relax, 
            recharge, and reconnect with yourself. Learn more about our journey and commitment to holistic wellness.
            </p>
            <Link to="/about">View About us</Link>
          </div>
        </div>
        <div className="home-about-images">
          <hr className="line-before-image" />
          <img src={serviceImage4} alt="About Us" />
          <hr className="line-after-image" />
        </div>
      </section>

      {/* Our Rooms & Treatments Section */}
      <section className="home-rooms-treatments">
        <div className="home-rooms-treatments-container">
          <div className="home-rooms-treatments-text">
            <h2>Our Rooms & Treatments</h2>
            <h3>A Room for Every Moment of Calm</h3>
            <p>“Discover spaces that inspire relaxation, connection, and self-care.”</p>
            <p>
            Step into a world of tranquility where every space is designed for your ultimate relaxation. 
            From soothing spa treatments to serene rooms, we offer the perfect retreat for mind and body. 
            Explore our offerings and book your experience today.
            </p>
            <Link to="/booking">View Our Room & Treatments</Link>
          </div>

          {/* Image part */}
            <div className="home-rooms-treatments-image-container">
              <h4 className="home-rooms-treatments-image-title">Sauna</h4> 
              <img src={serviceImage5} alt="Sauna" className="home-rooms-treatments-image" />
              <Link to="/booking" className="home-rooms-treatments-book-button-link">
                Book Now
              </Link>
            </div>
            </div>

        {/* Images under Rooms & Treatments */}
        <div className="home-room-images">
          <div className="home-room-image-container">
            <img src={serviceImage6} alt="Outdoor Sauna" />
            <div className="home-room-image-overlay">
              <h3>Outdoor Sauna</h3>
              <Link to="/booking" className="home-room-book-button-link">
                Book Now
              </Link>
            </div>
          </div>
          <div className="home-room-image-container">
            <img src={serviceImage7} alt="Massage" />
            <div className="home-room-image-overlay">
              <h3>Massage</h3>
              <Link to="/booking" className="home-room-book-button-link">
                Book Now
              </Link>
            </div>
          </div>
          <div className="home-room-image-container">
            <img src={serviceImage8} alt="Facial" />
            <div className="home-room-image-overlay">
              <h3>Facial</h3>
              <Link to="/booking" className="home-room-book-button-link">
                Book Now
              </Link>
            </div>
          </div>
          <div className="home-room-image-container">
            <img src={serviceImage9} alt="Pool" />
            <div className="home-room-image-overlay">
              <h3>Pool</h3>
              <Link to="/booking" className="home-room-book-button-link">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="home-events">
        <h2>Events</h2>
        <p>Explore our upcoming events</p>
        <div className="home-event-item-container">
          <div className="home-event-item">
            <p>Apr 10, 2025</p>
            <h1>Less Stress, More Facials</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a nisi nec lectus interdum porttitor.</p>
            <Link to="/events" className="explore-link">Explore &gt;</Link>
          </div>

          <div className="home-event-item">
            <p>Apr 10, 2025</p>
            <h1>Keep Calm and Spa On</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a nisi nec lectus interdum porttitor.</p>
            <Link to="/events" className="explore-link">Explore &gt;</Link>
          </div>

          <div className="home-event-item">
            <p>Apr 27, 2025</p>
            <h1>Escape from Everyday Life</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent a nisi nec lectus interdum porttitor.</p>
            <Link to="/events" className="explore-link">Explore &gt;</Link>
          </div>
        </div>

        {/* Link to explore events */}
        <Link to="/event/packages" className="home-event-packages-link">View Events</Link>
      </section>
    </div>
  );
};

export default Home;
