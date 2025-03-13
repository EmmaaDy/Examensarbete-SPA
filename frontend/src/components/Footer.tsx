import '../styles/Footer.css';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Flower from '../assets/Flower.png'
import leaf from '../assets/leaf.png'; 
import pattern from '../assets/green-pattern.png'
import pattern2 from '../assets/green-pattern2.png'


const Footer = () => {

  return (
    <footer className="footer">
  <img src={leaf} alt="Leaf" className="footer-leaf" />
  <img src={pattern} alt="Pattern" className="footer-pattern pattern-left" />

  <div className="footer-content">
    <div className='tagline'>
      <h1>&mdash;hot tub, steam room, sauna, massage, repeat.</h1>
    </div>
        <div className="footer-sitemap">
          <h4>Sitemap</h4>
          <nav>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/services">Services</NavLink>
              </li>
              <li>
                <NavLink to="/booking">Booking</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
            </ul>
          </nav>
        </div>
  </div>
  <div className="footer-bottom-decorations">
    <img src={pattern2} alt="Pattern" className="footer-pattern pattern-right" />
    <img src={Flower} alt="Flower" className="footer-flower" />
  </div>
  <div className='social-icons'>
    <div className='social-media'>
      <FaFacebook className="icon" />
      <FaInstagram className="icon" />
    </div>
  </div>
  <div className='divider'></div>
    <div className="under-panel">
      <p className="copyright">Copyright Dotcreativemarket</p>
      <p className="terms">Terms of Use</p>
      <p className="privacy">Privacy Policy</p>
      <NavLink to="/admin" className="admin" onClick={() => console.log('Admin Panel clicked!')}>Admin panel</NavLink>
    </div>
</footer>
  );
};

export default Footer;