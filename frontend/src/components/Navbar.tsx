import { NavLink } from 'react-router-dom';
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
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => isActive ? "active" : ""}>Services</NavLink></li>
          <li><NavLink to="/booking" className={({ isActive }) => isActive ? "active" : ""}>Booking</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
          <li><NavLink to="/events" className={({ isActive }) => isActive ? "active" : ""}>Events</NavLink></li>
        </ul>

        <NavLink to="/booking" className="booking-btn">
          Booking
        </NavLink>

      </div>
    </nav>
  );
};

export default Navbar;
