import { useState, useEffect } from 'react';
import LandingPage from '../components/LandingPage';
import Todos from '../components/todos';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally verify token validity here
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Listen for login events
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (for same-tab changes)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <Todos /> : <LandingPage />}
    </>
  );
}

export default App;