
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './LanguageContext';
import { Loader2 } from 'lucide-react';

import { AuthProvider, useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const AIStudio = lazy(() => import('./pages/AIStudio'));
const Careers = lazy(() => import('./pages/Careers'));
const Schools = lazy(() => import('./pages/Schools'));
const SchoolProfile = lazy(() => import('./pages/SchoolProfile'));
const News = lazy(() => import('./pages/News'));
const Complaints = lazy(() => import('./pages/Complaints'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <Loader2 className="h-10 w-10 text-blue-900 animate-spin" />
    <span className="text-blue-900 font-bold uppercase tracking-widest text-xs">Loading Excellence...</span>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />

                {/* Dashboard - standalone, no Navbar/Footer */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Main site routes */}
                <Route path="/*" element={
                  <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow pt-24">
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/news" element={<News />} />
                          <Route path="/schools" element={<Schools />} />
                          <Route path="/schools/:id" element={<SchoolProfile />} />
                          <Route path="/ai-studio" element={<AIStudio />} />
                          <Route path="/careers" element={<Careers />} />
                          <Route path="/complaints" element={<Complaints />} />
                          <Route path="*" element={<Home />} />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
