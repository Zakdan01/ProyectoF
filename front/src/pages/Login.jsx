import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, contrasena: password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardamos el objeto de usuario completo del back para que esté disponible en toda la app
        const userData = {
          ...data.user,
          rol: data.user.rol_nombre // Mantenemos compatibilidad con el campo 'rol'
        };
        
        login(userData);
        navigate('/admin');
      } else {
        setError(data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (err) {
      console.error('Error en el login:', err);
      setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bienvenido de nuevo</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Accede al panel administrativo del Restaurante Gourmet</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">✉️</span>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition dark:text-white"
                  placeholder="ejemplo@gourmet.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">🔒</span>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition shadow-lg transform hover:-translate-y-0.5 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'VERIFICANDO...' : 'ENTRAR AL SISTEMA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
