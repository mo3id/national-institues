import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

// Global error handler for images to show site logo if an image fails to load
window.addEventListener('error', (event) => {
  if (event.target instanceof HTMLImageElement) {
    const img = event.target;
    // Check if it's already the logo to avoid infinite loops
    if (!img.src.includes('/logo.svg')) {
      img.src = '/logo.svg';
      // Apply some styles to make the logo look decent in various containers
      img.style.objectFit = 'contain';
      img.classList.add('image-fallback');
    }
  }
}, true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // For production-ready performance
      retry: 1,
    }
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
