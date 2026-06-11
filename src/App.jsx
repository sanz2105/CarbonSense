import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Insights from './pages/Insights';
import Challenges from './pages/Challenges';

// Layout Wrapper Component with Route Change Fade Transitions
function AppLayout({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionState, setTransitionState] = useState('fadeIn');

  useEffect(() => {
    // If the path changes, fade out first
    if (location.pathname !== displayLocation.pathname) {
      setTransitionState('fadeOut');
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (transitionState === 'fadeOut') {
      // Swapping route and fading in
      setDisplayLocation(location);
      setTransitionState('fadeIn');
    }
  };

  return (
    <div className="min-h-screen bg-bg-mint flex flex-col font-sans">
      {/* Sticky Header Navigation */}
      <Navbar />

      {/* Main Wrapper with transition effects */}
      <main
        onTransitionEnd={handleTransitionEnd}
        className={`flex-1 w-full transition-opacity duration-200 ${
          transitionState === 'fadeIn' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Render pages locked to transition cycle location state */}
        <Routes location={displayLocation}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogActivity />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/challenges" element={<Challenges />} />
        </Routes>
      </main>

      {/* Clean informative footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
