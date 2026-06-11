import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LogActivity = lazy(() => import('./pages/LogActivity'));
const Insights = lazy(() => import('./pages/Insights'));
const Challenges = lazy(() => import('./pages/Challenges'));

function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-mint flex flex-col font-sans">
      <Navbar />

      <main id="main-content" role="main" key={location.pathname} className="flex-1 w-full animate-fadeIn">
        <Suspense fallback={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: '#1D9E75',
            fontSize: '14px',
            gap: '8px'
          }}>
            <span>Loading...</span>
          </div>
        }>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<LogActivity />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/challenges" element={<Challenges />} />
          </Routes>
        </Suspense>
      </main>

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
