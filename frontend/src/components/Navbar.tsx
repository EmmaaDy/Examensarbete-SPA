import { useState } from 'react';
import { Link  } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar ${isOpen ? 'open' : ''}`}>
      {/* Hamburgarikonen */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigeringsmenyn som kommer från vänster */}
      <div className={`side-menu ${isOpen ? 'active' : ''}`}>
        <ul className="nav-links">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/services" onClick={toggleMenu}>Services</Link></li>
          <li><Link to="/booking" onClick={toggleMenu}>Booking</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
          <li><Link to="/events" onClick={toggleMenu}>Events</Link></li>
          <li><Link to="/admin" onClick={toggleMenu}>Admin Panel</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
