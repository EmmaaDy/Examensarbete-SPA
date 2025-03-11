import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Oceanic Aquarius. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;