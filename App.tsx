
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LanguageProvider } from './LanguageContext';
import { Loader2 } from 'lucide-react';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const AIStudio = lazy(() => import('./pages/AIStudio'));
const Careers = lazy(() => import('./pages/Careers'));
const Schools = lazy(() => import('./pages/Schools'));
const SchoolProfile = lazy(() => import('./pages/SchoolProfile'));
const News = lazy(() => import('./pages/News'));
const Complaints = lazy(() => import('./pages/Complaints'));

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <Loader2 className="h-10 w-10 text-blue-900 animate-spin" />
    <span className="text-blue-900 font-bold uppercase tracking-widest text-xs">Loading Excellence...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
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
      </Router>
    </LanguageProvider>
  );
};

export default App;
