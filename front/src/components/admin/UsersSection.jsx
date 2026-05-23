import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

const UsersSection = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Estados para búsqueda y ordenamiento
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');

  const [formData, setFormData] = useState({
    nombre: '',
    apellido_pat: '',
    apellido_mat: '',
    ci: '',
    telefono: '',
    correo: '',
    contrasena: '',
    estado: 'Activo',
    id_rol: '',
    id_restaurante: ''
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/usuarios');
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetch('http://localhost:5000/api/usuarios/roles').then(res => res.json()).then(setRoles);
    fetch('http://localhost:5000/api/restaurantes').then(res => res.json()).then(setRestaurants);
  }, []);

  // Lógica de filtrado y ordenamiento
  const filteredUsers = users
    .filter(u => 
      `${u.nombre} ${u.apellido_pat} ${u.apellido_mat}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.ci.includes(searchTerm) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
      if (sortBy === 'rol') return a.rol_nombre.localeCompare(b.rol_nombre);
      if (sortBy === 'restaurante') return (a.restaurante_nombre || '').localeCompare(b.restaurante_nombre || '');
      if (sortBy === 'estado') return a.estado.localeCompare(b.estado);
      return 0;
    });

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ 
        ...user, 
        contrasena: '',
        apellido_pat: user.apellido_pat || '',
        apellido_mat: user.apellido_mat || '',
        telefono: user.telefono || '',
        estado: user.estado || 'Activo'
      });
    } else {
      setEditingUser(null);
      setFormData({
        nombre: '', apellido_pat: '', apellido_mat: '', ci: '',
        telefono: '', correo: '', contrasena: '',
        estado: 'Activo', id_rol: '', id_restaurante: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingUser 
      ? `http://localhost:5000/api/usuarios/${editingUser.id_usuario}`
      : 'http://localhost:5000/api/usuarios';
    
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchUsers();
        showToast(
          editingUser ? 'Usuario actualizado' : 'Usuario creado exitosamente',
          editingUser ? 'update' : 'success'
        );
      } else {
        showToast('Error al procesar la solicitud', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchUsers();
          showToast('Usuario eliminado', 'error');
        } else {
          showToast('No se pudo eliminar the usuario', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Error al intentar eliminar', 'error');
      }
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando usuarios...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Gestión de Usuarios</h3>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
        >
          + Añadir Usuario
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative col-span-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, CI o correo..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Ordenar:</label>
          <select 
            className="flex-grow p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nombre">Nombre</option>
            <option value="rol">Rol</option>
            <option value="restaurante">Restaurante</option>
            <option value="estado">Estado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map(u => (
          <div key={u.id_usuario} className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600 text-xl font-black shadow-inner group-hover:scale-110 transition-transform">
                  {u.nombre[0]}{u.apellido_pat[0]}
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                  u.estado === 'Activo' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {u.estado}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-bold dark:text-white text-lg leading-tight truncate">
                  {u.nombre} {u.apellido_pat} {u.apellido_mat}
                </h4>
                <p className="text-xs text-gray-400 font-medium truncate">{u.correo}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-orange-100 dark:border-orange-800">
                    👑 {u.rol_nombre}
                  </span>
                  <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-blue-100 dark:border-blue-800">
                    📍 {u.restaurante_nombre}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                  <p><span className="font-bold">CI:</span> {u.ci}</p>
                  <p><span className="font-bold">Tel:</span> {u.telefono || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 font-mono">ID: #{u.id_usuario}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(u)}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
                  title="Editar"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDelete(u.id_usuario)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">No se encontraron usuarios que coincidan con la búsqueda.</p>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Nombre</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Apellido Paterno</label>
            <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.apellido_pat} onChange={e => setFormData({...formData, apellido_pat: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Apellido Materno</label>
            <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.apellido_mat} onChange={e => setFormData({...formData, apellido_mat: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">CI</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.ci} onChange={e => setFormData({...formData, ci: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Teléfono</label>
            <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Correo</label>
            <input type="email" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
          </div>
          {!editingUser && (
            <div className="col-span-2">
              <label className="block text-sm font-bold dark:text-gray-300 mb-1">Contraseña</label>
              <input type="password" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.contrasena} onChange={e => setFormData({...formData, contrasena: e.target.value})} />
            </div>
          )}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Rol</label>
            <select required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: e.target.value})}>
              <option value="">Seleccionar...</option>
              {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Restaurante</label>
            <select required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.id_restaurante} onChange={e => setFormData({...formData, id_restaurante: e.target.value})}>
              <option value="">Seleccionar...</option>
              {restaurants.map(res => <option key={res.id_restaurante} value={res.id_restaurante}>{res.nombre}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Estado</label>
            <select className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <button type="submit" className="col-span-2 bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition">
            {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsersSection;
