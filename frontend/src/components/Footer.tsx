import '../styles/Footer.css';
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
    <h1>&mdash; hot tub, steam room, sauna, massage, repeat.</h1>
    </div>
    <div className="footer-sitemap">
          <h4>Sitemap</h4>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About Us</a>
            <a href="/services">Services</a>
            <a href="/events">Events</a>
            <a href="/contact">Contact Us</a>
          </nav>
        </div>
  </div>

  <div className="footer-bottom-decorations">
    <img src={pattern2} alt="Pattern" className="footer-pattern pattern-right" />
    <img src={Flower} alt="Flower" className="footer-flower" />
  </div>
</footer>
  );
};

export default Footer;