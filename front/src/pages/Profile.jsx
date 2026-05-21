import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
  const { user, login } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre.split(' ')[0] || '',
    apellido: user?.nombre.split(' ')[1] || '',
    correo: user?.correo || 'correo@ejemplo.com',
    telefono: user?.telefono || 'No registrado',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center dark:text-white">
        <p className="text-xl font-bold">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Aquí irá la conexión real al back en el futuro (PUT /api/usuarios/:id)
    setTimeout(() => {
      // Simulamos éxito
      const updatedUser = { 
        ...user, 
        nombre: `${formData.nombre} ${formData.apellido}`
      };
      login(updatedUser); // Actualizamos el contexto
      setIsEditing(false);
      setLoading(false);
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
    }, 1000);
  };

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Mi Perfil</h2>
        <p className="text-gray-500 dark:text-gray-400">Gestiona tu información personal y cuenta</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-orange-600 h-32 relative">
          <div className="absolute -bottom-12 left-10">
            <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl flex items-center justify-center text-4xl shadow-lg border-4 border-white dark:border-gray-800">
              👤
            </div>
          </div>
        </div>

        <div className="pt-16 pb-10 px-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold dark:text-white">{user.nombre}</h3>
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 inline-block">
                {user.rol}
              </span>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Editar Perfil
              </button>
            )}
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white disabled:opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Apellidos</label>
              <input 
                type="text" 
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white disabled:opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white disabled:opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
              <input 
                type="text" 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:text-white disabled:opacity-70"
              />
            </div>

            {isEditing && (
              <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 shadow-lg transition disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
