import '../styles/About.css';
import topleaf from '../assets/abt-topleaf.png';
import relaxed from '../assets/abt-relaxedtop.png';

const About = () => {
  return (
    <div className='about'>
      <section className='about-header'>
        <h1>About Oceanic Aquarius</h1>
      </section>

      <section className='story'>
        <img src={topleaf} alt="story-leaf" className="story-leaf" />
        <h3>Our story</h3>
        
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
    </div>
  );
};

export default About;
  