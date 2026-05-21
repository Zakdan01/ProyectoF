import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

const DishesSection = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre_asc');
  const [formData, setFormData] = useState({
    nombre_platillo: '',
    descripcion: '',
    precio: '',
    disponibilidad: 'Disponible'
  });

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/platillos');
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setDishes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setDishes([]);
    } finally {
      setLoading(false);
    }
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
    if (window.confirm('¿Estás seguro de eliminar este platillo?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/platillos/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchDishes();
        } else {
          alert('No se pudo eliminar el platillo. Podría estar asociado a una orden.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredAndSortedDishes = dishes
    .filter(d => 
      d.nombre_platillo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nombre_asc') return a.nombre_platillo.localeCompare(b.nombre_platillo);
      if (sortBy === 'nombre_desc') return b.nombre_platillo.localeCompare(a.nombre_platillo);
      if (sortBy === 'precio_asc') return a.precio - b.precio;
      if (sortBy === 'precio_desc') return b.precio - a.precio;
      return 0;
    });

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando platillos...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Control de Platillos</h3>
        <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-600/20">+ Nuevo Platillo</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex-grow relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar platillo por nombre..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Ordenar:</label>
          <select 
            className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 p-2 rounded-xl dark:text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nombre_asc">Nombre (A-Z)</option>
            <option value="nombre_desc">Nombre (Z-A)</option>
            <option value="precio_asc">Precio (Menor a Mayor)</option>
            <option value="precio_desc">Precio (Mayor a Menor)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAndSortedDishes.map(d => (
          <div key={d.id_platillo} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className="h-40 bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-5xl relative overflow-hidden">
              <span className="group-hover:scale-125 transition-transform duration-500">🍽️</span>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${d.disponibilidad === 'Disponible' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {d.disponibilidad}
                </span>
              </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
              <div className="mb-2">
                <h4 className="font-bold dark:text-white text-lg leading-tight mb-1">{d.nombre_platillo}</h4>
                <p className="text-orange-600 font-black text-xl">Bs. {d.precio}</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 italic">"{d.descripcion || 'Sin descripción'}"</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50 dark:border-gray-700">
                <button onClick={() => handleOpenModal(d)} className="flex items-center gap-1 text-blue-600 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg transition">
                  <span>✏️</span> Editar
                </button>
                <button onClick={() => handleDelete(d.id_platillo)} className="flex items-center gap-1 text-red-600 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition">
                  <span>🗑️</span> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedDishes.length === 0 && (
        <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">No se encontraron platillos que coincidan con tu búsqueda.</p>
        </div>
      )}

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

export default DishesSection;
