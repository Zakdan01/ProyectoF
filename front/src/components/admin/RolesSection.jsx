import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

const RolesSection = () => {
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/roles');
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion
    };

    try {
      const res = await fetch('http://localhost:5000/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nombre: '', descripcion: '' });
        fetchRoles();
        showToast('¡Rol creado exitosamente!', 'success');
      } else {
        const errorData = await res.json();
        console.error('Error del servidor:', errorData);
        showToast('Error al crear el rol: ' + (errorData.error || 'Intenta de nuevo'), 'error');
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      showToast('Error de conexión con el servidor.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/roles/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchRoles();
          showToast('Rol eliminado correctamente', 'error');
        } else {
          showToast('No se pudo eliminar el rol', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Error al intentar eliminar', 'error');
      }
    }
  };

  const getIcon = (nombre) => {
    const name = nombre.toLowerCase();
    if (name.includes('admin')) return '👑';
    if (name.includes('mesero')) return '🏃';
    if (name.includes('cocin')) return '👨‍🍳';
    if (name.includes('cliente')) return '👤';
    return '🔑';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold dark:text-white">Gestión de Roles</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
        >
          + Añadir Rol
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center dark:text-white">Cargando roles...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {roles.map(r => (
            <div key={r.id_rol} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
              <span className="text-4xl mb-4">{getIcon(r.nombre)}</span>
              <h4 className="font-bold text-lg dark:text-white mb-1">{r.nombre}</h4>
              <p className="text-xs text-gray-500 mb-4">{r.descripcion}</p>
              <button 
                onClick={() => handleDelete(r.id_rol)}
                className="text-red-500 text-sm font-bold hover:text-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Rol">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Nombre del Rol</label>
            <input 
              required 
              className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white"
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Descripción</label>
            <input 
              className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white"
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-2 rounded-lg hover:bg-orange-700 transition">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default RolesSection;
