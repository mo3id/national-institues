
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/common/ScrollToTop';
import FloatingLoginButton from '@/components/common/FloatingLoginButton';
import { LanguageProvider } from '@/context/LanguageContext';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { Navigate, useLocation } from 'react-router-dom';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const AIStudio = lazy(() => import('./pages/AIStudio'));
const Jobs = lazy(() => import('./pages/Jobs'));
const Schools = lazy(() => import('./pages/Schools'));
const SchoolProfile = lazy(() => import('./pages/SchoolProfile'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Complaints = lazy(() => import('./pages/Complaints'));
const ComplaintInquiry = lazy(() => import('./pages/ComplaintInquiry'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Alumni = lazy(() => import('./pages/Alumni'));
const AlumniProfile = lazy(() => import('./pages/AlumniProfile'));
const AdmissionInquiry = lazy(() => import('./pages/AdmissionInquiry'));
const RequestModification = lazy(() => import('./pages/RequestModification'));
const ModificationInquiry = lazy(() => import('./pages/ModificationInquiry'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
import ErrorPage from './components/common/ErrorPage';
const PageLoader = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fafcff]">
    <div className="relative w-32 h-32 flex items-center justify-center mb-6">
      <img src="/layer-1-small.webp" alt="Loading" className="w-full h-auto object-contain animate-pulse" />
    </div>
    <div className="flex gap-2" dir="ltr">
      <div className="w-3 h-3 rounded-full bg-[#1e3a8a] animate-bounce" style={{ animationDelay: '0s' }} />
      <div className="w-3 h-3 rounded-full bg-[#1e3a8a] animate-bounce" style={{ animationDelay: '0.2s' }} />
      <div className="w-3 h-3 rounded-full bg-[#991b1b] animate-bounce" style={{ animationDelay: '0.4s' }} />
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const noPadPaths = ['/', '/login', '/about', '/complaints', '/complaints/inquiry', '/admissions', '/admissions/track', '/admissions/inquiry', '/modifications/request', '/modifications/track', '/dashboard', '/contact'];
  const isNoPadding = noPadPaths.includes(location.pathname) ||
    location.pathname.startsWith('/schools') ||
    location.pathname.startsWith('/careers') ||
    location.pathname.startsWith('/news') ||
    location.pathname.startsWith('/alumni');

  return (
    <div className="flex flex-col min-h-screen bg-[#fafcff]">
      <Navbar />
      <main className={`flex-grow ${isNoPadding ? '' : 'pt-24'}`}>
        {children}
      </main>
      <Footer />
      <FloatingLoginButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
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
                    <MainLayout>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/news" element={<News />} />
                          <Route path="/news/:id" element={<NewsDetail />} />
                          <Route path="/schools" element={<Schools />} />
                          <Route path="/schools/:id" element={<SchoolProfile />} />
                          <Route path="/alumni" element={<Alumni />} />
                          <Route path="/alumni/:id" element={<AlumniProfile />} />
                          <Route path="/ai-studio" element={<AIStudio />} />
                          <Route path="/careers" element={<Jobs />} />
                          <Route path="/complaints" element={<Complaints />} />
                          <Route path="/complaints/inquiry" element={<ComplaintInquiry />} />
                          <Route path="/admissions" element={<Admissions />} />
                          <Route path="/admissions/track" element={<AdmissionInquiry />} />
                          <Route path="/admissions/inquiry" element={<AdmissionInquiry />} />
                          <Route path="/modifications/request" element={<RequestModification />} />
                          <Route path="/modifications/track" element={<ModificationInquiry />} />
                          <Route path="/contact" element={<ContactUs />} />
                          <Route path="*" element={<ErrorPage isNotFound={true} />} />
                        </Routes>
                      </Suspense>
                    </MainLayout>
                  } />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
