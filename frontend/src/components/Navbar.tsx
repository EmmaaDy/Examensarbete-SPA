import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.svg'
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/admin">Admin Panel</Link></li>
        </ul>
        <button className="booking-btn">Booking</button>
      </div>
    </nav>
  );
};

export default Navbar;
