import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';

const Profile = () => {
  const { user, login } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    correo: '',
    telefono: '',
    ci: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');

  // Sincronizar datos del formulario desde el backend para mayor seguridad
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id_usuario) return;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/usuarios`);
        const allUsers = await res.json();
        // Buscamos nuestra propia info detallada
        const me = allUsers.find(u => u.id_usuario === user.id_usuario);
        
        if (me) {
          setFormData({
            nombre: me.nombre || '',
            apellido_pat: me.apellido_pat || '',
            apellido_mat: me.apellido_mat || '',
            correo: me.correo || '',
            telefono: me.telefono || '',
            ci: me.ci || '',
          });
        }
      } catch (err) {
        console.error("Error al cargar datos del perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id_usuario]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center dark:text-white">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🔒</div>
          <p className="text-xl font-black uppercase tracking-widest opacity-50">Acceso Restringido</p>
          <p className="text-sm">Por favor, inicia sesión para gestionar tu perfil.</p>
        </div>
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

    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${user.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...user, 
          ...formData,
          id_rol: user.id_rol, // Mantenemos los datos sensibles que no se editan aquí
          id_restaurante: user.id_restaurante,
          estado: user.estado
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // El back devuelve el usuario actualizado (con id_usuario, etc)
        // Pero necesitamos conservar rol_nombre y restaurante_nombre del contexto actual
        const finalUser = { 
          ...updatedUser, 
          rol_nombre: user.rol_nombre, 
          restaurante_nombre: user.restaurante_nombre 
        };
        login(finalUser);
        setIsEditing(false);
        setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
      } else {
        throw new Error('Error al actualizar');
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'No se pudo guardar la información.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header con Estilo Premium */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative group">
          <div className="w-40 h-40 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 text-white font-black">
            {user.nombre[0].toUpperCase()}{user.apellido_pat ? user.apellido_pat[0].toUpperCase() : ''}
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg border border-orange-100 dark:border-orange-900/30 text-2xl">
            ✨
          </div>
        </div>
        <div className="text-center md:text-left flex-grow">
          <p className="text-orange-600 font-black text-xs uppercase tracking-[0.3em] mb-2">Miembro del Equipo</p>
          <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
            {user.nombre} {user.apellido_pat}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
             <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border border-orange-200 dark:border-orange-800">
               👑 {user.rol_nombre || 'Usuario'}
             </span>
             <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
               📍 {user.restaurante_nombre || 'Sucursal General'}
             </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tarjeta de Seguridad */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden h-full">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Información de Cuenta</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-xl shadow-inner">📧</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Correo Personal</p>
                  <p className="font-bold dark:text-white break-all">{user.correo}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-xl shadow-inner">🆔</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Documento CI</p>
                  <p className="font-bold dark:text-white font-mono">{user.ci}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-xl shadow-inner">📅</div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Fecha de Ingreso</p>
                  <p className="font-bold dark:text-white">{new Date(user.fecha_registro).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 dark:border-gray-700 mt-auto flex flex-col gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">ID Interno de Sistema</p>
                  <code className="bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded-lg text-orange-600 font-bold">USR-{user.id_usuario}</code>
                </div>

                <button 
                  onClick={() => {
                    setIsPasswordModalOpen(true);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                  }}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>🔐</span> Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Formulario */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-10 py-8 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/30">
              <div>
                <h3 className="text-xl font-black dark:text-white tracking-tight">Editar Información</h3>
                <p className="text-xs text-gray-400 font-medium">Mantén tus datos actualizados para el sistema</p>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-600 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 uppercase tracking-widest active:scale-95"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            <div className="p-10">
              {message.text && (
                <div className={`mb-10 p-5 rounded-2xl text-sm font-bold flex items-center gap-4 border animate-fadeIn ${
                  message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200 shadow-sm shadow-green-100' 
                  : 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100'
                }`}>
                  <span className="text-xl">{message.type === 'success' ? '✅' : '❌'}</span>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-[0.2em]">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-gray-950 rounded-2xl outline-none dark:text-white disabled:opacity-60 transition-all font-bold text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-[0.2em]">Apellido Paterno</label>
                  <input 
                    type="text" 
                    name="apellido_pat"
                    value={formData.apellido_pat}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-gray-950 rounded-2xl outline-none dark:text-white disabled:opacity-60 transition-all font-bold text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-[0.2em]">Apellido Materno</label>
                  <input 
                    type="text" 
                    name="apellido_mat"
                    value={formData.apellido_mat}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-gray-950 rounded-2xl outline-none dark:text-white disabled:opacity-60 transition-all font-bold text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-[0.2em]">Cédula Identidad (CI)</label>
                  <input 
                    type="text" 
                    name="ci"
                    value={formData.ci}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-gray-950 rounded-2xl outline-none dark:text-white disabled:opacity-60 transition-all font-bold text-lg shadow-inner font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-[0.2em]">Correo Electrónico</label>
                  <input 
                    type="email" 
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-gray-950 rounded-2xl outline-none dark:text-white disabled:opacity-60 transition-all font-bold text-lg shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-orange-500 uppercase ml-1 tracking-[0.2em]">Teléfono Móvil</label>
                  <input 
                    type="text" 
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-gray-950 rounded-2xl outline-none dark:text-white disabled:opacity-60 transition-all font-bold text-lg shadow-inner"
                  />
                </div>

                {isEditing && (
                  <div className="md:col-span-2 flex justify-end items-center gap-8 mt-10 pt-10 border-t-2 border-dashed border-gray-50 dark:border-gray-700">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-gray-400 hover:text-red-500 font-black transition-colors uppercase text-xs tracking-[0.2em]"
                    >
                      Descartar
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="bg-orange-600 text-white px-12 py-5 rounded-[2rem] font-black hover:bg-orange-700 shadow-2xl shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                          GUARDANDO...
                        </>
                      ) : 'GUARDAR CAMBIOS'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Cambiar Contraseña */}
      <Modal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        title="Cambiar Contraseña"
      >
        <form onSubmit={async (e) => {
          e.preventDefault();
          setPasswordError('');
          
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Las nuevas contraseñas no coinciden.');
            return;
          }

          if (passwordData.newPassword.length < 6) {
            setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
          }

          setLoading(true);
          try {
            const res = await fetch(`http://localhost:5000/api/usuarios/${user.id_usuario}/password`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
              })
            });

            const data = await res.json();

            if (res.ok) {
              setIsPasswordModalOpen(false);
              setMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
            } else {
              setPasswordError(data.error || 'Error al cambiar la contraseña.');
            }
          } catch (err) {
            setPasswordError('Error de conexión con el servidor.');
          } finally {
            setLoading(false);
          }
        }} className="space-y-4">
          {passwordError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold">
              ⚠️ {passwordError}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Contraseña Actual</label>
            <input 
              type="password"
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nueva Contraseña</label>
            <input 
              type="password"
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Confirmar Nueva Contraseña</label>
            <input 
              type="password"
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white font-black py-4 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 disabled:opacity-50 mt-4"
          >
            {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;
