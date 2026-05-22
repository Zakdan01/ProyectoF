import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Support from './pages/Support';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';

function App() {
  const { user } = useAppContext();

  return (
    <Router>
      <AppContent user={user} />
    </Router>
  );
}

function AppContent({ user }) {
  const location = useLocation();
  const showFooterPaths = ['/', '/menu', '/support'];
  const shouldShowFooter = showFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/support" element={<Support />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
