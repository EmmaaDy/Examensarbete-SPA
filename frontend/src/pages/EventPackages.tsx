import { Link } from 'react-router-dom';
import '../styles/EventPackages.css'
import pattern3 from '../assets/green-pattern3.png'
import leaf from '../assets/leaf.png';
import topleaf from '../assets/abt-topleaf.png'; 
import bath from '../assets/relaxing-bath.png';
import beverage from '../assets/events-beverage.png'
import setup from '../assets/events-spa-setup.png'

const EventPackages = () => {
    return (
      <div className="Event-packages">
        <section className='event-packages-header'>
          <h1>our event packages</h1>
          <p>At Oceanic Aquarius, we offer a range of customizable event packages to make your special day truly unforgettable.
            Whether you're planning a bridal shower, corporate retreat, birthday celebration, or just a day of relaxation with friends,
            we can tailor the perfect experience for your group.
          </p>
          <img src={leaf} alt="leaf" className='events-packages-headerleaf' />
        </section>

        <section className='events-packages-row1'>

          <div className='custom'>
            <h3>Custom Spa Day Package</h3>
            <h4 className='description'>Perfect for small to large groups, this package offers a selection of our most popular treatments.
              Choose from relaxing massages, invigorating facials, detoxifying saunas, and more.
            </h4>
            <p>Duration: Full-day or Half-day package
                <ul>Inclusions:
                  <li>Choose from 3–5 different treatments (massage, facial, sauna, etc.)</li>
                  <li>Access to relaxation lounges and bubble pool</li>
                  <li>Light snacks and beverages</li>
                </ul>
                Ideal for: Bridal showers, Birthdays, or corporate relaxation days.

                <div>Price: Starting at [price] SEK per person</div>
              </p>
            <Link to="/contact">CONTACT US TO BOOK THIS PACKAGE</Link>
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
          </div>

          <div className='corporate'>
            <h3>Corporate Wellness Retreat</h3>
            <h4 className='description'>Recharge your team with a corporate wellness retreat designed to relieve stress and foster team-building.
              Our professional therapists will guide your group through a series of rejuvenating treatments and team-building activities.
            </h4>
            <p>Duration: Full-day or Half-day package
                <ul>Inclusions:
                  <li>Group meditation and relaxation sessions</li>
                  <li>Team-building massage and facial treatments</li>
                  <li>Private indoor/outdoor sauna experiences</li>
                  <li>Healthy refreshments and lunch</li>
                </ul>
                Perfect for: Team-building events, Stress relief, Corporate incentives.

                <div>Price: Starting at [price] SEK per person</div>
              </p>
            <Link to="/contact">CONTACT US TO BOOK THIS PACKAGE</Link>
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
          </div>
           <img src={topleaf} alt="leaf" className='event-packages-leaf' /> 
        </section>

        <section className='events-packages-row2'>
          <div className='luxury'>
            <h3>Luxury Wellness Day</h3>
            <h4 className='description'>Pamper yourself and your loved ones with a day of pure luxury.
              Our luxury package includes premium treatments that will leave you feeling refreshed and completely relaxed.</h4>
            <p>Duration: Full-Day Experience
                <ul>Inclusions:
                  <li>A combination of signature massages (E.G., Himalayan Salt massage, Deep Tissue)</li>
                  <li>Anti-ageing and hydrating facials</li>
                  <li>Access to the bubble pool  relax area</li>
                  <li>Exclusive access to private sauna experiences</li>
                  <li>Champagne or luxury beverages served</li>
                </ul>
                Ideal for: Special celebrations, Anniversaries, Luxury getaways.

                <div>Price: Starting at [price] SEK per person</div>
              </p>
            <Link to="/contact">CONTACT US TO BOOK THIS PACKAGE</Link>
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
          </div>

          <div className='custom-spa-day'>
            <h3>Custom Spa Day Package</h3>
            <h4 className='description'>Perfect for small to large groups, this package offers a selection of our most popular treatments.
              Choose from relaxing massages, invigorating facials, detoxifying saunas, and more.
            </h4>
            <p>Duration: Full-day or Half-day Package
                <ul>Inclusions:
                  <li>Choose from 3-5 different treatments (Massage, Facial, Sauna, Etc.)</li>
                  <li>Access to relaxation lounges and bubble pool</li>
                  <li>Private indoor/outdoor sauna experiences</li>
                  <li>Light snacks and beverages</li>
                </ul>
                Perfect for: Bridal showers, Birthdays, or Corporate relaxation days.

              <div>Price: Starting at [price] SEK per person</div>
            </p>
            <Link to="/contact">CONTACT US TO BOOK THIS PACKAGE</Link>
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
          </div>
        </section>

        <section className='events-packages-row3'>
        <div className='customizable'>
            <h3>Customizable Packages</h3>
            <h4 className='description'>If you don’t see what you’re looking for, we can create a fully customizable event package just for you.
              Simply tell us what you need, and we’ll work with you to build the perfect experience based on your group size, preferred treatments,
              and any special requests.
            </h4>
            <p>
                <ul>
                  <li>Personalized treatments and services</li>
                  <li>Group sizes from 4 to 20+ guests</li>
                  <li>Flexible scheduels to fit your needs</li>
                </ul>
                Prices vary based on customization
            </p>
            <Link to="/contact">CONTACT US TO CUSTOMIZE YOUR EVENT</Link>
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
            
          </div>
          <img src={topleaf} alt="leaf" className='event-packages-leaf2'/> 
          <img src={bath} alt="bath" className='events-packages-bath' />
        </section>
        
        <section className='events-packages-row4'>
          
          <div className='booking-your-event'>
            <h3>Booking Your Event</h3>
            <h4 className='description'>To book or inquire about any of our event packages, please contact us using the form below or reach out directly.
              Our team will be happy to discuss your needs and help you plan an event that is perfectly tailored to your group.
            </h4>
            <Link to="/contact">CONTACT US TO BOOK YOUR EVENT</Link>
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
          </div>

          <div className='events-pictures'>
            <img src={beverage} alt="beverage" className='event-picture1' />
            <img src={setup} alt="spa-setup" className='event-picture2' />
            <img src={pattern3} alt="bg-pattern" className='events-packages-bg' />
          </div>
        </section>
      </div>
  );
  };
  
  export default EventPackages;