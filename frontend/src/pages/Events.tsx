import { Link } from 'react-router-dom';

const Events = () => {
  return (
    <div>
      <h1>Upcoming Events</h1>
      <p>Check out our exciting events happening soon.</p>

      {/* Lägg till en länk till EventPackages */}
      <p>
        Want to see more? Check out our <Link to="/event/packages">Event Packages</Link> for exclusive offers and details!
      </p>
    </div>
  );
};

export default Events;
