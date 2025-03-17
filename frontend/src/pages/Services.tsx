import { Link } from 'react-router-dom';
import '../styles/Services.css';
import serviceImage10 from '../assets/green.png';
import indoorSauna from '../assets/sauna.png';
import outdoorSauna from '../assets/OutdoorSauna.png';
import faceCare from '../assets/face.png';
import himalayanSaltMassage from '../assets/himalayan-salt-massage.png';
import massageRoom from '../assets/massage.png';
import bubblePool from '../assets/pool.png';
import Slider from 'react-slick';

import massageImage from '../assets/MassageTreatments.png';
import faceImage from '../assets/FaceTreatments.png';
import bodyCareImage from '../assets/BodyCareTreatments.png';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Services = () => {
  const settings = {
    dots: true,           
    infinite: true,       
    speed: 500,          
    autoplay: true,       
    autoplaySpeed: 4500,  
    pauseOnHover: false,   
    slidesToShow: 3,      
    slidesToScroll: 1,    
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1,  
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  return (
    <div className="services">
      {/* Welcome Section */}
      <section className="services-welcome">
        <h1>Services</h1>
      </section>

      {/* Our Services Section */}
      <section className="services-our-services">
        <div className="services-our-services-container">
          <div className="services-our-services-text">
            <h2>Our Services</h2>
            <h3>Your Journey to Relaxation Starts Here</h3>
            <p>
              Nunc quis eleifend lectus. Donec id semper ligula, ut laoreet orci.
              Donec tempor vestibulum quam non gravida.
            </p>
            <Link to="/booking" className="services-view-more-link">
              View More
            </Link>
          </div>

          <div className="services-our-services-image">
            <img src={serviceImage10} alt="Service" />
          </div>
        </div>
      </section>

      {/* Rooms & Treatments Section with Carousel */}
      <section className="services-rooms-treatments">
        <p>Our Rooms & Treatments</p>
        <h2>Relax, Refresh, Recharge</h2>
        <Slider {...settings}>
          <div className="services-room-card">
            <img src={indoorSauna} alt="Indoor Sauna" />
            <h3>Indoor Sauna</h3>
            <p>
              Escape into the soothing heat of our indoor sauna. Perfect for deep
              relaxation and detoxification, leaving your body and mind refreshed.
            </p>
            <Link to="/booking" className="services-book-link">Book</Link>
          </div>
          <div className="services-room-card">
            <img src={outdoorSauna} alt="Outdoor Sauna" />
            <h3>Outdoor Sauna</h3>
            <p>
              Immerse yourself in nature while enjoying the warmth of our outdoor sauna. Breathe fresh air and feel the stress melt away.
            </p>
            <Link to="/booking" className="services-book-link">Book</Link>
          </div>
          <div className="services-room-card">
            <img src={faceCare} alt="Face Care Treatment" />
            <h3>Face Care Treatment</h3>
            <p>
              Rejuvenate and refresh your skin with our tailored face treatments. Nourish, hydrate, and restore your natural glow.
            </p>
            <Link to="/booking" className="services-book-link">Book</Link>
          </div>
          <div className="services-room-card">
            <img src={himalayanSaltMassage} alt="Himalayan Salt Massage" />
            <h3>Himalayan Salt Massage</h3>
            <p>
              Experience the soothing benefits of a Himalayan Salt Massage. Warm salt stones help detoxify, relax muscles, and rejuvenate your body with their natural healing properties.
            </p>
            <Link to="/booking" className="services-book-link">Book</Link>
          </div>
          <div className="services-room-card">
            <img src={massageRoom} alt="Massage Room" />
            <h3>Massage Room</h3>
            <p>
              Unwind with our soothing massages, tailored to relieve tension and bring complete relaxation to your body and mind.
            </p>
            <Link to="/booking" className="services-book-link">Book</Link>
          </div>
          <div className="services-room-card">
            <img src={bubblePool} alt="Bubble Pool & Relax Area" />
            <h3>Bubble Pool & Relax Area</h3>
            <p>
              Step into serenity with our luxurious bubble pool and peaceful relaxation area. A perfect way to unwind and recharge after a busy day.
            </p>
            <Link to="/booking" className="services-book-link">Book</Link>
          </div>
        </Slider>
      </section>

      {/* New Text Section */}
      <section className="services-text-section">
      <h2>"Give Your Body A Little Love, It Deserves It"</h2>
      <div className="services-treatments-container">
        <div className="services-treatment-card">
          <div className="services-treatment-image">
            <img src={massageImage} alt="Massage Treatments" />
            <div className="services-treatment-text">
              <h3>Massage Treatments</h3>
              <p>60 Minutes</p>
              <p>£75</p>
            </div>
          </div>
          <Link to="/booking" className="services-explore-link">Explore More</Link>
        </div>
        <div className="services-treatment-card">
          <div className="services-treatment-image">
            <img src={faceImage} alt="Face Treatments" />
            <div className="services-treatment-text">
              <h3>Face Treatments</h3>
              <p>60 Minutes</p>
              <p>£70</p>
            </div>
          </div>
          <Link to="/booking" className="services-explore-link">Explore More</Link>
        </div>
        <div className="services-treatment-card">
          <div className="services-treatment-image">
            <img src={bodyCareImage} alt="Body Care Treatments" />
            <div className="services-treatment-text">
              <h3>Body Care Treatments</h3>
              <p>60 Minutes</p>
              <p>£80</p>
            </div>
          </div>
          <Link to="/booking" className="services-explore-link">Explore More</Link>
        </div>
      </div>
    </section>


    </div>
  );
};

export default Services;
