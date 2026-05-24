import API_URL from '../../config/api.js';
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

const RestaurantsSection = () => {
  const { showToast } = useToast();
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

  const fetchRestaurantes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/restaurantes`);
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setRestaurantes(Array.isArray(data) ? data : []);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const handleViewStaff = async (res) => {
    setSelectedRestName(res.nombre);
    try {
      const response = await fetch(`${API_URL}/usuarios?id_restaurante=${res.id_restaurante}`);
      const data = await response.json();
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
      ? `${API_URL}/restaurantes/${editingRestaurant.id_restaurante}`
      : `${API_URL}/restaurantes`;
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
        showToast(
          editingRestaurant ? 'Sucursal actualizada' : 'Sucursal creada exitosamente',
          editingRestaurant ? 'update' : 'success'
        );
      } else {
        showToast('Error al guardar sucursal', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta sucursal?')) {
      try {
        const res = await fetch(`${API_URL}/restaurantes/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchRestaurantes();
          showToast('Sucursal eliminada', 'error');
        } else {
          showToast('No se pudo eliminar la sucursal', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Error al intentar eliminar', 'error');
      }
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
                👥 Equipo
              </button>
              <div className="flex space-x-3">
                <button onClick={() => handleOpenModal(r)} className="text-blue-600 text-sm font-bold hover:underline">Editar</button>
                <button onClick={() => handleDelete(r.id_restaurante)} className="text-red-500 text-sm font-bold hover:text-red-700">Eliminar</button>
              </div>
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

export default RestaurantsSection;
