import { Routes, Route, BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const LogActivity = lazy(() => import('./pages/LogActivity'));
const Insights = lazy(() => import('./pages/Insights'));
const Challenges = lazy(() => import('./pages/Challenges'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppLayout() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg-mint flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-green-800 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />

      <main id="main-content" role="main" key={location.pathname} className="flex-1 w-full animate-fadeIn">
        <Suspense fallback={
          <div className="flex items-center justify-center h-[60vh] text-[#166E52] text-sm gap-2">
            <span>Loading...</span>
          </div>
        }>
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<LogActivity />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
