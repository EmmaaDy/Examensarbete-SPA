import { Link } from 'react-router-dom';
import pattern3 from '../assets/green-pattern3.png'
import topleaf from '../assets/abt-topleaf.png';
import '../styles/Events.css'

const Events = () => {
  return (
    <div className='Events'>
      <section className='event-header'>
        <h1>Events</h1>
        <h2>upcoming events</h2>
        <img src={topleaf} alt="leaf" className='events-leaf' />
      </section>

      <section className='events-row1'>

        <div className='less-stress'>
          <h3>Less Stress, More Facials</h3>
          <p className='date'>Date: Apr 10, 2025</p>
          <p>Treat yourself to a rejuvenating facial experience designed to relieve stress and refresh your skin.
            This event offers exclusive discounts and packages for facials, helping you unwind and recharge.
            Whether you're looking for a hydrating facial or an anti-aging treatment, we've got something for everyone!
            Book your spot now and take advantage of special offers for this one-day event.
          </p>
          <Link to="/booking">BOOK NOW</Link>
          <img src={pattern3} alt="bg-pattern" className='events-bg' />
        </div>

        <div className='escape'>
          <h3>Escape From Every Day Life</h3>
          <p className='date'>Date: April 27, 2025</p>
          <p>Escape from the hustle and bustle of daily life with a full day of relaxation at Oceanic Aquarius.
            Enjoy a curated selection of massages, facials, saunas, and more.
            This is the perfect event to recharge and reset your body and mind in a serene and tranquil environment.
            Reserve your space for this immersive experience today!
          </p>
          <Link to="/booking">BOOK NOW</Link>
          <img src={pattern3} alt="bg-pattern" className='events-bg' />
        </div>

      </section>

      <section className='events-row2'>

        <div className='keep-calm'>
          <h3>Keep Calm And Spa On</h3>
          <p className='date'>Date: April 10, 2025</p>
          <p>Relax, unwind, and enjoy a day of pampering with our "Keep Calm and Spa On" event.
            Indulge in luxurious treatments including our signature massages, soothing saunas, and tranquil relaxation areas.
            Let the stresses of everyday life melt away as you experience the ultimate relaxation retreat.
            Don’t miss out—secure your booking today!
          </p>
          <Link to="/booking">BOOK NOW</Link>
          <img src={pattern3} alt="bg-pattern" className='events-bg' />
        </div>

        <div className='event-packages'>
          <h3>Event Packages</h3>
          <p>Choose from our exclusive event packages or let us tailor a package specifically for your needs.
            Whether you're celebrating a special occasion or simply looking for a peaceful retreat,
            we offer customized experiences to suit every group size and occasion.
          </p>
          <Link to="/contact">SEND US A REQUEST</Link>
          <Link to="/event/packages">LEARN MORE ABOUT OUR EVENT PACKAGES</Link>
          <img src={pattern3} alt="bg-pattern" className='events-bg' />
        </div>

      </section>
    </div>
  );
};

export default Events;