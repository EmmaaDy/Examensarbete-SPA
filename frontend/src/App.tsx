import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';
import Events from './pages/Events';
import EventPackages from './pages/EventPackages';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();

  const hideLayout = ['/admin', '/admin/dashboard'].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideLayout && <Navbar />}
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/packages" element={<EventPackages />} />

          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      
    </div>
  );
};

export default App;
