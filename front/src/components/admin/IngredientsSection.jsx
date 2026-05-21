import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

const IngredientsSection = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre_asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [formData, setFormData] = useState({
    nombre_ingrediente: '',
    descripcion: '',
    stock_actual: '',
    unidad_medida: '',
    estado: 'Disponible'
  });

  const fetchIngredients = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ingredientes');
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setIngredients(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setIngredients([]);
      setLoading(false);
    }
  };

  useEffect(() => { fetchIngredients(); }, []);

  const handleOpenModal = (ingredient = null) => {
    if (ingredient) {
      setEditingIngredient(ingredient);
      setFormData(ingredient);
    } else {
      setEditingIngredient(null);
      setFormData({
        nombre_ingrediente: '',
        descripcion: '',
        stock_actual: '',
        unidad_medida: '',
        estado: 'Disponible'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingIngredient 
      ? `http://localhost:5000/api/ingredientes/${editingIngredient.id_ingrediente}`
      : 'http://localhost:5000/api/ingredientes';
    const method = editingIngredient ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchIngredients();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este ingrediente?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/ingredientes/${id}`, { method: 'DELETE' });
        if (res.ok) fetchIngredients();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const ingredientToUpdate = ingredients.find(i => i.id_ingrediente === id);
      const res = await fetch(`http://localhost:5000/api/ingredientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ingredientToUpdate, estado: newStatus })
      });
      if (res.ok) fetchIngredients();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAndSortedIngredients = ingredients
    .filter(i => 
      i.nombre_ingrediente.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nombre_asc') return a.nombre_ingrediente.localeCompare(b.nombre_ingrediente);
      if (sortBy === 'nombre_desc') return b.nombre_ingrediente.localeCompare(a.nombre_ingrediente);
      if (sortBy === 'stock_asc') return a.stock_actual - b.stock_actual;
      if (sortBy === 'stock_desc') return b.stock_actual - a.stock_actual;
      return 0;
    });

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando inventario...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Inventario de Ingredientes</h3>
        <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-600/20">+ Nuevo Insumo</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex-grow relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar ingrediente..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Ordenar:</label>
          <select 
            className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 p-2 rounded-xl dark:text-white text-sm outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nombre_asc">Nombre (A-Z)</option>
            <option value="nombre_desc">Nombre (Z-A)</option>
            <option value="stock_asc">Menor Stock primero</option>
            <option value="stock_desc">Mayor Stock primero</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAndSortedIngredients.map(i => (
          <div key={i.id_ingrediente} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-2xl group-hover:scale-110 transition">
                📦
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                  i.stock_actual < 10 
                  ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' 
                  : 'bg-green-100 text-green-700 border-green-200'
                }`}>
                  {i.stock_actual < 10 ? 'Stock Bajo' : 'Suficiente'}
                </span>
                <select 
                  value={i.estado || 'Disponible'}
                  onChange={(e) => handleUpdateStatus(i.id_ingrediente, e.target.value)}
                  className={`text-[9px] font-bold uppercase px-1 rounded border outline-none ${
                    i.estado === 'Agotado' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-600'
                  }`}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="Agotado">Agotado</option>
                  <option value="Poco Stock">Poco Stock</option>
                </select>
              </div>
            </div>
            <h4 className="font-bold dark:text-white text-lg mb-1">{i.nombre_ingrediente}</h4>
            <p className="text-xs text-gray-400 mb-4 line-clamp-1 italic">{i.descripcion || 'Sin descripción'}</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Cantidad</p>
                <p className="text-2xl font-black dark:text-white">
                  {i.stock_actual} <span className="text-sm font-normal text-gray-500">{i.unidad_medida}</span>
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(i)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition" title="Editar">
                  ✏️
                </button>
                <button onClick={() => handleDelete(i.id_ingrediente)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedIngredients.length === 0 && (
        <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">No se encontraron ingredientes.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIngredient ? 'Editar Insumo' : 'Nuevo Insumo'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Nombre del Ingrediente</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.nombre_ingrediente} onChange={e => setFormData({...formData, nombre_ingrediente: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold dark:text-gray-300">Stock Actual</label>
              <input type="number" step="0.01" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.stock_actual} onChange={e => setFormData({...formData, stock_actual: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-gray-300">Unidad (Kg, Lt, etc)</label>
              <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.unidad_medida} onChange={e => setFormData({...formData, unidad_medida: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Descripción</label>
            <textarea className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Estado</label>
            <select className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
              <option value="Poco Stock">Poco Stock</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition">
            {editingIngredient ? 'Actualizar' : 'Registrar Insumo'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default IngredientsSection;