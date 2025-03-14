import { Link } from 'react-router-dom';
import '../styles/About.css';
import topleaf from '../assets/abt-topleaf.png';
import relaxed from '../assets/abt-relaxedtop.png';
import visionpic from '../assets/vision-pic.png'

const About = () => {
  return (
    <div className='about'>
      <section className='about-header'>
        <h1>About Oceanic Aquarius</h1>
      </section>

      <section className='story'>
        <img src={topleaf} alt="story-leaf" className="story-leaf" />
        <h3>Our Story</h3>
        
        <div className='story-content'>
          <p>
            Welcome to Oceanic Aquarius, a sanctuary where water, nature, and serenity come together 
            to create an unforgettable wellness experience. Our journey began with a simple but powerful 
            vision: to provide a peaceful oasis where you can escape the stresses of everyday life and 
            reconnect with your true self. Inspired by the healing power of water and the calming essence 
            of the ocean, Oceanic Aquarius is dedicated to offering a transformative journey for your mind, 
            body, and soul.
          </p>
          <img src={relaxed} alt="abt-relaxed" className="story-image" />
        </div>
      </section>
      <section className='vision'>
        <div className='vision-content'>
          <img src={visionpic} alt="visionpic" className='vision-pic' />
          <div className='visiontext'>
            <h3 className="vision-header">Our Vision</h3>
            <p>At Oceanic Aquarius, we believe in the therapeutic power of nature and the importance of self-care.
              Our vision is to create an environment that helps you relax, recharge, and renew, offering a holistic experience
              that nourishes your inner and outer well-being. Whether you're seeking relaxation, rejuvenation, or simply a moment of peace,
              we are here to guide you on your wellness journey.
            </p>
          </div>
        </div>
      </section>
      <section className='choose'>
          <h3 className='choose-header'>Why Choose Us?</h3>
          <p>At Oceanic Aquarius, your well-being is our top priority. We combine the ancient healing practices
            with modern wellness techniques to provide you with a truly rejuvenating experience. Our expert therapists and serene surroundings
            will leave you feeling refreshed, revitalized, and connected to your inner peace. Join Us at Oceanic Aquarius
            Whether you're visiting for a relaxing massage, a rejuvenating facial, or simply to unwind in our serene rooms,
            Oceanic Aquarius is here to offer you a space where you can escape, relax, and recharge. Book your experience with us today
            and step into a world of tranquility.
            Contact Us
            Ready to experience Oceanic Aquarius? Feel free to reach out to us with any questions or to book your next treatment.
            We look forward to welcoming you soon.</p>
        </section>
        <div className='button'>
        <Link to="/booking" className='book-button'>BOOK</Link>
        </div>
    </div>
  );
};

export default About;
  