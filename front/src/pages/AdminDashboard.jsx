import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';

// =====================================================
// SECCIÓN DE ROLES
// =====================================================
const RolesSection = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/roles')
      .then(res => res.json())
      .then(data => { setRoles(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold dark:text-white">Gestión de Roles</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {roles.map(r => (
          <div key={r.id_rol} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-lg dark:text-white">{r.nombre}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// SECCIÓN DE USUARIOS
// =====================================================
const UsersSection = () => {
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

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/usuarios')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
      } catch (err) {
        console.error(err);
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
            <option value="estado">Estado</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-bold dark:text-white">Nombre Completo</th>
                <th className="px-6 py-4 font-bold dark:text-white">CI</th>
                <th className="px-6 py-4 font-bold dark:text-white">Teléfono</th>
                <th className="px-6 py-4 font-bold dark:text-white">Correo</th>
                <th className="px-6 py-4 font-bold dark:text-white">Rol</th>
                <th className="px-6 py-4 font-bold dark:text-white">Estado</th>
                <th className="px-6 py-4 font-bold dark:text-white">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredUsers.map(u => (
                <tr key={u.id_usuario} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 dark:text-gray-300">
                    {u.nombre} {u.apellido_pat} {u.apellido_mat}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-300">{u.ci}</td>
                  <td className="px-6 py-4 dark:text-gray-300">{u.telefono}</td>
                  <td className="px-6 py-4 dark:text-gray-300">{u.correo}</td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold uppercase">{u.rol_nombre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.estado === 'Activo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-3 whitespace-nowrap">
                    <button onClick={() => handleOpenModal(u)} className="text-blue-600 hover:text-blue-800 font-bold text-sm">Editar</button>
                    <button onClick={() => handleDelete(u.id_usuario)} className="text-red-600 hover:text-red-800 font-bold text-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-gray-500">No se encontraron usuarios que coincidan con la búsqueda.</div>
          )}
        </div>
      </div>

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

// =====================================================
// SECCIÓN DE AUDITORÍA (LOGS)
// =====================================================
const AuditSection = () => {
  const [table, setTable] = useState('usuarios');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/audit/${table}`)
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [table]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Auditoría de Sistema</h3>
          <p className="text-sm text-gray-500">Visualiza los cambios históricos capturados por Triggers</p>
        </div>
        <select 
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-2 rounded-lg font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
          value={table}
          onChange={(e) => setTable(e.target.value)}
        >
          <option value="usuarios">Tabla: Usuarios</option>
          <option value="platillos">Tabla: Platillos</option>
          <option value="restaurantes">Tabla: Restaurantes</option>
        </select>
      </div>

      {loading ? (
        <div className="p-20 text-center dark:text-white">Cargando historial...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 font-bold dark:text-white">Fecha</th>
                  <th className="px-6 py-4 font-bold dark:text-white">Operación</th>
                  <th className="px-6 py-4 font-bold dark:text-white">Datos Anteriores</th>
                  <th className="px-6 py-4 font-bold dark:text-white">Datos Nuevos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {logs.map(log => (
                  <tr key={log.id_log} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 text-xs dark:text-gray-400">
                      {new Date(log.fecha_evento).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.tipo_evento === 'INSERT' ? 'bg-green-100 text-green-600' :
                        log.tipo_evento === 'UPDATE' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {log.tipo_evento}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] text-gray-500 max-w-xs overflow-hidden truncate">
                        {log.datos_anteriores ? JSON.stringify(log.datos_anteriores) : '---'}
                      </pre>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] text-orange-600 dark:text-orange-400 max-w-xs overflow-hidden truncate">
                        {log.datos_nuevos ? JSON.stringify(log.datos_nuevos) : '---'}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// SECCIÓN DE PLATILLOS
// =====================================================
const DishesSection = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [formData, setFormData] = useState({
    nombre_platillo: '',
    descripcion: '',
    precio: '',
    disponibilidad: 'Disponible'
  });

  const fetchDishes = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/platillos')
      .then(res => res.json())
      .then(data => {
        setDishes(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleOpenModal = (dish = null) => {
    if (dish) {
      setEditingDish(dish);
      setFormData(dish);
    } else {
      setEditingDish(null);
      setFormData({ nombre_platillo: '', descripcion: '', precio: '', disponibilidad: 'Disponible' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingDish 
      ? `http://localhost:5000/api/platillos/${editingDish.id_platillo}`
      : 'http://localhost:5000/api/platillos';
    const method = editingDish ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchDishes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar platillo?')) {
      await fetch(`http://localhost:5000/api/platillos/${id}`);
      fetchDishes();
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando platillos...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold dark:text-white">Control de Platillos</h3>
        <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700">+ Nuevo Platillo</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map(d => (
          <div key={d.id_platillo} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-200 dark:bg-gray-900 flex items-center justify-center text-5xl relative">
              🍽️
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${d.disponibilidad === 'Disponible' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {d.disponibilidad}
                </span>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <h4 className="font-bold dark:text-white text-lg">{d.nombre_platillo}</h4>
              <p className="text-orange-600 font-bold text-xl mb-2">Bs. {d.precio}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{d.descripcion}</p>
              <div className="flex justify-end space-x-3 mt-auto pt-4 border-t border-gray-50 dark:border-gray-700">
                <button onClick={() => handleOpenModal(d)} className="text-blue-600 text-sm font-bold hover:underline">Editar</button>
                <button onClick={() => handleDelete(d.id_platillo)} className="text-red-600 text-sm font-bold hover:underline">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDish ? 'Editar Platillo' : 'Nuevo Platillo'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Nombre</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.nombre_platillo} onChange={e => setFormData({...formData, nombre_platillo: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Precio</label>
            <input type="number" step="0.01" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Descripción</label>
            <textarea className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Disponibilidad</label>
            <select className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.disponibilidad} onChange={e => setFormData({...formData, disponibilidad: e.target.value})}>
              <option value="Disponible">Disponible</option>
              <option value="No Disponible">No Disponible</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition">
            {editingDish ? 'Actualizar' : 'Crear Platillo'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// =====================================================
// SECCIÓN DE RESTAURANTES (RESTAURANTS)
// =====================================================
const RestaurantsSection = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [staff, setStaff] = useState([]);
  const [selectedRestName, setSelectedRestName] = useState('');
  
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    estado: 'Activo',
    hora_apertura: '',
    hora_cierre: ''
  });

  const fetchRestaurantes = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/restaurantes')
      .then(res => res.json())
      .then(data => {
        setRestaurantes(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const handleViewStaff = async (res) => {
    setSelectedRestName(res.nombre);
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios?id_restaurante=${res.id_restaurante}`);
      const data = await response.json();
      // Filtrado manual por si el backend no lo filtra correctamente por query param
      setStaff(data.filter(u => Number(u.id_restaurante) === Number(res.id_restaurante)));
      setIsStaffModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (res = null) => {
    if (res) {
      setEditingRestaurant(res);
      setFormData(res);
    } else {
      setEditingRestaurant(null);
      setFormData({
        nombre: '', direccion: '', telefono: '', ciudad: '',
        estado: 'Activo', hora_apertura: '', hora_cierre: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingRestaurant 
      ? `http://localhost:5000/api/restaurantes/${editingRestaurant.id_restaurante}`
      : 'http://localhost:5000/api/restaurantes';
    const method = editingRestaurant ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchRestaurantes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando sucursales...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold dark:text-white">Sucursales</h3>
        <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition">+ Nueva Sucursal</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {restaurantes.map(r => (
          <div key={r.id_restaurante} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-xl dark:text-white">{r.nombre}</h4>
              <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${r.estado === 'Activo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {r.estado}
              </span>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 flex-grow">
              <p>📍 {r.direccion}, {r.ciudad}</p>
              <p>📞 {r.telefono}</p>
              <p>⏰ {r.hora_apertura} - {r.hora_cierre}</p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50 dark:border-gray-700">
              <button onClick={() => handleViewStaff(r)} className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-100 transition">
                👥 Equipo de Trabajo
              </button>
              <button onClick={() => handleOpenModal(r)} className="text-blue-600 text-sm font-bold hover:underline">Editar Datos</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRestaurant ? 'Editar Sucursal' : 'Nueva Sucursal'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-bold dark:text-gray-300">Nombre</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold dark:text-gray-300">Dirección</label>
            <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300">Ciudad</label>
            <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.ciudad} onChange={e => setFormData({...formData, ciudad: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300">Teléfono</label>
            <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300">Hora Apertura</label>
            <input type="time" className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.hora_apertura} onChange={e => setFormData({...formData, hora_apertura: e.target.value})} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-bold dark:text-gray-300">Hora Cierre</label>
            <input type="time" className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.hora_cierre} onChange={e => setFormData({...formData, hora_cierre: e.target.value})} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-bold dark:text-gray-300">Estado</label>
            <select className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Remodelacion">Remodelación</option>
            </select>
          </div>
          <button type="submit" className="col-span-2 bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition">
            {editingRestaurant ? 'Guardar Cambios' : 'Crear Sucursal'}
          </button>
        </form>
      </Modal>

      {/* Modal de Equipo de Trabajo */}
      <Modal isOpen={isStaffModalOpen} onClose={() => setIsStaffModalOpen(false)} title={`Equipo de: ${selectedRestName}`}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {staff.length > 0 ? staff.map(u => (
            <div key={u.id_usuario} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
               <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-xl">👤</div>
               <div>
                 <p className="text-sm font-bold dark:text-white">{u.nombre} {u.apellido_pat}</p>
                 <p className="text-[10px] text-orange-600 font-bold uppercase">{u.rol_nombre}</p>
               </div>
            </div>
          )) : <p className="text-center text-gray-500 py-10">No hay personal registrado en esta sucursal.</p>}
        </div>
      </Modal>
    </div>
  );
};

// =====================================================
// SECCIÓN DE MESAS (TABLES)
// =====================================================
const TablesSection = () => {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurante, setSelectedRestaurante] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTables = (id_restaurante = '') => {
    setLoading(true);
    const url = id_restaurante 
      ? `http://localhost:5000/api/mesas?id_restaurante=${id_restaurante}`
      : 'http://localhost:5000/api/mesas';
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTables(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    // Cargar restaurantes para el filtro
    fetch('http://localhost:5000/api/restaurantes')
      .then(res => res.json())
      .then(setRestaurants);
    
    fetchTables();
  }, []);

  const handleRestauranteChange = (e) => {
    const id = e.target.value;
    setSelectedRestaurante(id);
    fetchTables(id);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Estado de Mesas</h3>
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border dark:border-gray-700">
          <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Filtrar por Sucursal:</label>
          <select 
            className="p-1 bg-transparent dark:text-white outline-none"
            value={selectedRestaurante}
            onChange={handleRestauranteChange}
          >
            <option value="">Todas las sucursales</option>
            {restaurants.map(r => <option key={r.id_restaurante} value={r.id_restaurante}>{r.nombre}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center dark:text-white">Cargando mesas...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map(t => (
              <div key={t.id_mesa} className={`p-6 rounded-2xl text-center border-2 transition transform hover:scale-105 ${t.estado === 'Ocupada' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' : 'border-green-200 bg-green-50 dark:bg-green-900/20'}`}>
                <span className="block text-xl font-bold dark:text-white">Mesa {t.n_mesa}</span>
                <p className="text-xs dark:text-gray-400 mb-2">Capacidad: {t.capacidad}</p>
                <span className={`text-xs font-bold uppercase ${t.estado === 'Ocupada' ? 'text-red-600' : 'text-green-600'}`}>
                  {t.estado}
                </span>
              </div>
            ))}
          </div>
          {tables.length === 0 && (
            <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500">No hay mesas registradas en esta sucursal.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// =====================================================
// SECCIÓN TODAS LAS ÓRDENES (ALL ORDERS)
// =====================================================
const AllOrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRest, setSelectedRest] = useState('');
  const [selectedFecha, setSelectedFecha] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    let url = 'http://localhost:5000/api/ordenes';
    const params = [];
    if (selectedRest) params.push(`id_restaurante=${selectedRest}`);
    if (selectedFecha) params.push(`fecha=${selectedFecha}`);
    
    if (params.length > 0) url += `?${params.join('&')}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
    fetch('http://localhost:5000/api/restaurantes').then(res => res.json()).then(setRestaurants);
  }, [selectedRest, selectedFecha]);

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando órdenes...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Registro Global de Órdenes</h3>
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border dark:border-gray-700">
          <select className="p-1 bg-transparent dark:text-white outline-none text-sm" value={selectedRest} onChange={(e) => setSelectedRest(e.target.value)}>
            <option value="">Todas las sucursales</option>
            {restaurants.map(r => <option key={r.id_restaurante} value={r.id_restaurante}>{r.nombre}</option>)}
          </select>
          <input type="date" className="p-1 bg-transparent dark:text-white outline-none text-sm" value={selectedFecha} onChange={(e) => setSelectedFecha(e.target.value)} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-bold dark:text-white">ID</th>
                <th className="px-6 py-4 font-bold dark:text-white">Cliente</th>
                <th className="px-6 py-4 font-bold dark:text-white">Platillos</th>
                <th className="px-6 py-4 font-bold dark:text-white">Total</th>
                <th className="px-6 py-4 font-bold dark:text-white">Estado</th>
                <th className="px-6 py-4 font-bold dark:text-white">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map(o => (
                <tr key={o.id_orden} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="px-6 py-4 dark:text-gray-300 font-bold">#{o.id_orden}</td>
                  <td className="px-6 py-4 dark:text-gray-300">{o.cliente_nombre} {o.cliente_apellido}</td>
                  <td className="px-6 py-4 dark:text-gray-300 text-xs">{o.platillos}</td>
                  <td className="px-6 py-4 font-bold text-orange-600">Bs. {o.total}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">{o.estado}</span></td>
                  <td className="px-6 py-4 dark:text-gray-400 text-xs">{new Date(o.fecha_hora).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SECCIÓN DE VENTA (ORDERS POS)
// =====================================================
const OrdersSection = () => {
  const { user } = useAppContext();
  const [platillos, setPlatillos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Estados de Formulario
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedMesa, setSelectedMesa] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [newClientData, setNewClientData] = useState({ nombres: '', apellidos: '', ci: '' });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = () => {
    fetch('http://localhost:5000/api/platillos').then(res => res.json()).then(setPlatillos);
    fetch('http://localhost:5000/api/clientes').then(res => res.json()).then(setClientes);
    if (user?.id_restaurante) {
      fetch(`http://localhost:5000/api/mesas?id_restaurante=${user.id_restaurante}`)
        .then(res => res.json())
        .then(setMesas);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleReset = () => {
    setCart([]);
    setSelectedCliente('');
    setSelectedMesa('');
    setIsNewClient(false);
    setNewClientData({ nombres: '', apellidos: '', ci: '' });
  };

  const addToCart = (dish) => {
    if (dish.disponibilidad !== 'Disponible') return;
    const existing = cart.find(item => item.id_platillo === dish.id_platillo);
    if (existing) {
      setCart(cart.map(item => item.id_platillo === dish.id_platillo ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * dish.precio } : item));
    } else {
      setCart([...cart, { ...dish, cantidad: 1, subtotal: dish.precio }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id_platillo === id) {
        const newQty = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: newQty, subtotal: (newQty * item.precio).toFixed(2) };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);

  const handleConfirmOrder = async () => {
    if (!isNewClient && !selectedCliente) return alert('Seleccione un cliente');
    if (isNewClient && (!newClientData.nombres || !newClientData.ci)) return alert('Complete los datos del nuevo cliente');
    if (cart.length === 0) return alert('El carrito está vacío');

    setIsProcessing(true);
    try {
      const payload = {
        id_cliente: isNewClient ? null : selectedCliente,
        nuevo_cliente: isNewClient ? newClientData : null,
        id_restaurante: user.id_restaurante,
        id_mesa: selectedMesa || null,
        total: total,
        items: cart.map(i => ({ id_platillo: i.id_platillo, cantidad: i.cantidad, subtotal: i.subtotal }))
      };

      const response = await fetch('http://localhost:5000/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('✅ ¡Orden realizada con éxito! Enviada a cocina.');
        handleReset();
        fetchData(); // Recargar clientes por si se creó uno nuevo
      }
    } catch (err) {
      console.error(err);
      alert('Error al procesar la orden');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold dark:text-white">Terminal de Venta</h3>
        <button onClick={handleReset} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-xl font-bold hover:bg-gray-200 transition">
          🔄 Reiniciar Pedido
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Registro/Selección de Cliente */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <div className="flex items-center justify-between mb-4">
               <h4 className="font-bold dark:text-white">Información del Cliente</h4>
               <button 
                 onClick={() => setIsNewClient(!isNewClient)}
                 className="text-xs font-bold text-orange-600 uppercase hover:underline"
               >
                 {isNewClient ? '← Seleccionar Existente' : '+ Nuevo Cliente'}
               </button>
             </div>
             
             {isNewClient ? (
               <div className="grid grid-cols-3 gap-4 animate-fadeIn">
                 <input placeholder="Nombres" className="p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none" value={newClientData.nombres} onChange={e => setNewClientData({...newClientData, nombres: e.target.value})} />
                 <input placeholder="Apellidos" className="p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none" value={newClientData.apellidos} onChange={e => setNewClientData({...newClientData, apellidos: e.target.value})} />
                 <input placeholder="CI" className="p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none" value={newClientData.ci} onChange={e => setNewClientData({...newClientData, ci: e.target.value})} />
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-4">
                 <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500" value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)}>
                   <option value="">Seleccionar Cliente...</option>
                   {clientes.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombres} {c.apellidos} (CI: {c.ci})</option>)}
                 </select>
                 <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500" value={selectedMesa} onChange={e => setSelectedMesa(e.target.value)}>
                   <option value="">Para llevar / Sin mesa</option>
                   {mesas.map(m => <option key={m.id_mesa} value={m.id_mesa}>Mesa {m.n_mesa} ({m.capacidad} pers.)</option>)}
                 </select>
               </div>
             )}
          </div>
          
          {/* Menú de Platillos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {platillos.map(p => (
              <button 
                key={p.id_platillo} 
                onClick={() => addToCart(p)}
                disabled={p.disponibilidad !== 'Disponible'}
                className={`flex flex-col p-4 bg-white dark:bg-gray-800 rounded-2xl border transition group text-left shadow-sm ${p.disponibilidad === 'Disponible' ? 'hover:border-orange-500 border-gray-100 dark:border-gray-700' : 'opacity-50 cursor-not-allowed grayscale border-red-100'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl">🍽️</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${p.disponibilidad === 'Disponible' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {p.disponibilidad}
                  </span>
                </div>
                <p className="font-bold dark:text-white text-sm line-clamp-1">{p.nombre_platillo}</p>
                <p className="text-orange-600 text-xs font-bold">Bs. {p.precio}</p>
                {p.disponibilidad === 'Disponible' && (
                  <div className="mt-2 text-[10px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-0.5 rounded-full self-start opacity-0 group-hover:opacity-100 transition-opacity">Añadir +</div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Carrito / Resumen */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-orange-100 dark:border-orange-900/30 h-fit sticky top-24">
          <h4 className="font-bold mb-4 dark:text-white flex items-center justify-between">
            <span>Resumen de Orden</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">#{cart.length} items</span>
          </h4>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 border-y border-gray-50 dark:border-gray-700 py-4">
            {cart.length > 0 ? cart.map(item => (
              <div key={item.id_platillo} className="flex justify-between items-center">
                <div className="flex-grow">
                  <p className="text-sm font-bold dark:text-white">{item.nombre_platillo}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button onClick={() => updateQuantity(item.id_platillo, -1)} className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs">-</button>
                    <span className="text-xs font-bold w-4 text-center">{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id_platillo, 1)} className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-xs">+</button>
                    <span className="text-xs text-gray-400">x Bs. {item.precio}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                   <p className="text-sm font-bold text-orange-600">Bs. {item.subtotal}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <span className="text-4xl mb-2">🛒</span>
                <p className="text-sm text-gray-400">Carrito vacío</p>
              </div>
            )}
          </div>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm dark:text-gray-400"><span>Subtotal</span><span>Bs. {total.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-xl dark:text-white"><span>TOTAL</span><span>Bs. {total.toFixed(2)}</span></div>
          </div>
          
          <button 
            onClick={handleConfirmOrder}
            disabled={isProcessing || cart.length === 0}
            className={`w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'}`}
          >
            {isProcessing ? 'PROCESANDO...' : 'CONFIRMAR Y PAGAR'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SECCIÓN DE MESEROS (WAITERS)
// =====================================================
const WaiterSection = () => {
  const { user } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/ordenes/listas')
      .then(res => res.json())
      .then(setOrders)
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDeliver = async (id) => {
    await fetch(`http://localhost:5000/api/ordenes/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'Entregado', id_mesero: user.id_usuario })
    });
    fetchOrders();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold dark:text-white">Entrega (Mesero)</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {orders.map(o => (
          <div key={o.id_orden} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-l-4 border-blue-500 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-lg dark:text-white">Orden #{o.id_orden}</h4>
              <span className="text-[10px] font-bold uppercase text-blue-600">{o.restaurante_nombre}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Cliente: {o.cliente_nombre} {o.cliente_apellido}</p>
            <p className="text-sm dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{o.platillos}</p>
            <button onClick={() => handleDeliver(o.id_orden)} className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg">Entregar Orden</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// SECCIÓN DE COCINA (KITCHEN)
// =====================================================
const KitchenSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch('http://localhost:5000/api/ordenes/preparacion')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); const int = setInterval(fetchOrders, 5000); return () => clearInterval(int); }, []);

  const handleComplete = async (id) => {
    await fetch(`http://localhost:5000/api/ordenes/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'Listo para entrega' })
    });
    fetchOrders();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold dark:text-white">Cocina (En Preparación)</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {orders.map(o => (
          <div key={o.id_orden} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-l-4 border-orange-500 shadow-sm">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-lg dark:text-white">Orden #{o.id_orden}</h4>
              <span className="text-[10px] font-bold uppercase text-orange-600">{o.restaurante_nombre}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Cliente: {o.cliente_nombre} {o.cliente_apellido}</p>
            <p className="text-sm dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{o.platillos}</p>
            <button onClick={() => handleComplete(o.id_orden)} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg">Listo para Entrega</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// =====================================================
// DASHBOARD PRINCIPAL
// =====================================================
const AdminDashboard = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('roles');

  if (!user || user.rol_nombre !== 'Administrador') {
    return <div className="p-20 text-center dark:text-white text-2xl font-bold animate-fadeIn">Acceso denegado. Se requieren permisos de Administrador.</div>;
  }

  const tabs = [
    { id: 'roles', label: 'Roles', icon: '🔑' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'restaurants', label: 'Restaurantes', icon: '🏢' },
    { id: 'tables', label: 'Mesas', icon: '🪑' },
    { id: 'dishes', label: 'Platillos', icon: '🍽️' },
    { id: 'clients', label: 'Clientes', icon: '👤' },
    { id: 'orders', label: 'Órdenes', icon: '💰' },
    { id: 'all-orders', label: 'Todas las Órdenes', icon: '📋' },
    { id: 'payments', label: 'Pagos', icon: '💳' },
    { id: 'kitchen', label: 'Cocina', icon: '👨‍🍳' },
    { id: 'waiter', label: 'Meseros', icon: '🏃' },
    { id: 'ingredients', label: 'Inventario', icon: '📦' },
    { id: 'providers', label: 'Proveedores', icon: '🚚' },
    { id: 'audit', label: 'Auditoría', icon: '🛡️' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Operaciones Reales</p>
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-[1600px] mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Panel de Control</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Conectado a la Base de Datos: <span className="text-orange-600 font-bold">restaurante_db</span></p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-xl">👤</div>
            <div>
              <p className="text-sm font-bold dark:text-white">{user.nombre}</p>
              <p className="text-xs text-orange-600 font-bold uppercase">{user.rol_nombre}</p>
            </div>
          </div>
        </header>

        <div className="pb-20">
          {activeTab === 'roles' && <RolesSection />}
          {activeTab === 'users' && <UsersSection />}
          {activeTab === 'restaurants' && <RestaurantsSection />}
          {activeTab === 'tables' && <TablesSection />}
          {activeTab === 'dishes' && <DishesSection />}
          {/* {activeTab === 'clients' && <ClientsSection />} */}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'all-orders' && <AllOrdersSection />}
          {/* {activeTab === 'payments' && <PaymentsSection />} */}
          {activeTab === 'kitchen' && <KitchenSection />}
          {activeTab === 'waiter' && <WaiterSection />}
          {/* {activeTab === 'ingredients' && <IngredientsSection />} */}
          {/* {activeTab === 'providers' && <ProvidersSection />} */}
          {activeTab === 'audit' && <AuditSection />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
