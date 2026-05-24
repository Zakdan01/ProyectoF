import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { darkMode, setDarkMode, user, logout } = useAppContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShowProfileMenu(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-3xl font-black text-orange-600 transition group-hover:scale-110">RG</span>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white hidden md:block">Restaurante Gourmet</h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/menu" 
            className={`font-medium transition ${location.pathname === '/menu' ? 'text-orange-600' : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500'}`}
          >
            Menú
          </Link>
          <Link 
            to="/support" 
            className={`font-medium transition ${location.pathname === '/support' ? 'text-orange-600' : 'text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-500'}`}
          >
            Soporte
          </Link>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>

          {!user ? (
            <Link to="/login" className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 shadow-md transition transform hover:scale-105 active:scale-95">
              Iniciar Sesión
            </Link>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-4 py-2 rounded-xl font-bold hover:bg-orange-200 transition"
              >
                <span>👤 {user.nombre}</span>
                <span className="text-xs">▼</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Rol: {user.rol}</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    Ver Perfil
                  </Link>
                  {['Administrador', 'Cajero', 'Cocinero', 'Mesero'].includes(user.rol_nombre) && (
                    <Link 
                      to="/admin" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Panel Operativo
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden items-center space-x-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 shadow-xl animate-fadeIn z-40">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/menu" 
              className={`px-4 py-3 rounded-xl font-bold transition ${location.pathname === '/menu' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'text-gray-600 dark:text-gray-300'}`}
            >
              🍴 Menú
            </Link>
            <Link 
              to="/support" 
              className={`px-4 py-3 rounded-xl font-bold transition ${location.pathname === '/support' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'text-gray-600 dark:text-gray-300'}`}
            >
              💬 Soporte
            </Link>
            
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              {!user ? (
                <Link to="/login" className="w-full block bg-orange-600 text-white text-center py-4 rounded-2xl font-black shadow-lg">
                  INICIAR SESIÓN
                </Link>
              ) : (
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl mb-2">
                    <p className="text-xs text-gray-500">Usuario: {user.nombre}</p>
                    <p className="text-xs text-orange-600 font-bold">{user.rol_nombre}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl">
                    👤 Mi Perfil
                  </Link>
                  {['Administrador', 'Cajero', 'Cocinero', 'Mesero'].includes(user.rol_nombre) && (
                    <Link to="/admin" className="block px-4 py-3 text-gray-700 dark:text-gray-200 font-medium hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl">
                      ⚡ Panel Operativo
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
