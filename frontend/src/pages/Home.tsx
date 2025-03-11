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
          {/* Text part */}
          <div className="home-our-services-text">
            <h2>Our Services</h2>
            <h3>Take A Deep Breath And Just Enjoy Life</h3>
            <p>Nunc quis eleifend lectus. Donec id semper ligula, ut laoreet orci. Donec tempor vestibulum quam non gravida.</p>
            <Link to="/services">View More</Link>
          </div>

          {/* Image part */}
          <div className="home-service-image">
            <img src={serviceImage10} alt="Service 10" />
          </div>
        </div>

        {/* Other service images */}
        <div className="home-service-images">
          <img src={serviceImage1} alt="Service 1" />
          <img src={serviceImage2} alt="Service 2" />
          <img src={serviceImage3} alt="Service 3" />
        </div>
      </section>
    
      {/* About Us Section */}
      <section className="home-about-us">
        <h2>About Us</h2>
        <p>A Healthy Body Is A Guest-Chamber For The Soul</p>
        <h3>“Go On – Treat Yourself”</h3>
        <p>Nunc quis eleifend lectus. Donec id semper ligula, ut laoreet orci. Donec tempor vestibulum quam non gravida. Sed eleifend, erat at pulvinar hendrerit, diam dui dignissim diam, non congue nibh sem eget sapien.</p>
        <Link to="/about">View More</Link>

        {/* Bilder under "About Us" */}
        <div className="home-about-images">
          <img src={serviceImage4} alt="About Us" />
        </div>
      </section>

      {/* Our Rooms & Treatments Section */}
      <section className="home-rooms-treatments">
        <h2>Our Rooms & Treatments</h2>
        <p>A Room for Every Moment of Calm</p>
        <h3>“Discover spaces that inspire relaxation, connection, and self-care.”</h3>
        <p>Nunc quis eleifend lectus. Donec id semper ligula, ut laoreet orci. Donec tempor vestibulum quam non gravida. Sed eleifend, erat at pulvinar hendrerit, diam dui dignissim diam, non congue nibh sem eget sapien.</p>
        <Link to="/rooms-and-treatments">View More</Link>

        {/* Bilder under "Rooms & Treatments" */}
        <div className="home-room-images">
          <img src={serviceImage5} alt="Sauna" />
          <img src={serviceImage6} alt="Outdoor Sauna" />
          <img src={serviceImage7} alt="Massage" />
          <img src={serviceImage8} alt="Facial" />
          <img src={serviceImage9} alt="Pool" />
        </div>
      </section>

      {/* Events Section */}
      <section className="home-events">
        <h2>Events</h2>
        <p>Explore our upcoming events</p>
        <div>
          <h4>Apr 10, 2025</h4>
          <p>Nunc quis eleifend lectus. Donec id semper ligula, ut laoreet orci. Donec tempor vestibulum quam non gravida.</p>
        </div>
        <div>
          <h4>Apr 27, 2025</h4>
          <p>Less Stress, More Facials – “Go On – Treat Yourself”</p>
          <p>Escape from Everyday Life. Keep Calm and Spa On</p>
        </div>

        {/* Länkar för att utforska events */}
        <Link to="/events">Explore</Link>
        <Link to="/event/packages" className="home-event-packages-link">Event Packages</Link>
      </section>
    </div>
  );
};

export default Home;
