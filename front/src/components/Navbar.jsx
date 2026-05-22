import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { darkMode, setDarkMode, user, logout } = useAppContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShowProfileMenu(false);
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
        
        <div className="flex items-center space-x-4 md:space-x-8">
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
      </div>
    </nav>
  );
};

export default Navbar;
