import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

const TablesSection = () => {
  const [tables, setTables] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurante, setSelectedRestaurante] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    n_mesa: '',
    capacidad: '',
    estado: 'Disponible',
    id_restaurante: ''
  });

  const fetchTables = async (id_restaurante = '') => {
    setLoading(true);
    const url = id_restaurante 
      ? `http://localhost:5000/api/mesas?id_restaurante=${id_restaurante}`
      : 'http://localhost:5000/api/mesas';
    
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/mesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ n_mesa: '', capacidad: '', estado: 'Disponible', id_restaurante: '' });
        fetchTables(selectedRestaurante);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const tableToUpdate = tables.find(t => t.id_mesa === id);
      const res = await fetch(`http://localhost:5000/api/mesas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tableToUpdate, estado: newStatus })
      });
      if (res.ok) fetchTables(selectedRestaurante);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/mesas/${id}`, { method: 'DELETE' });
        if (res.ok) fetchTables(selectedRestaurante);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Estado de Mesas</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border dark:border-gray-700">
            <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Sucursal:</label>
            <select 
              className="p-1 bg-transparent dark:text-white outline-none"
              value={selectedRestaurante}
              onChange={handleRestauranteChange}
            >
              <option value="">Todas</option>
              {restaurants.map(r => <option key={r.id_restaurante} value={r.id_restaurante}>{r.nombre}</option>)}
            </select>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition"
          >
            + Añadir Mesa
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center dark:text-white">Cargando mesas...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tables.map(t => (
              <div key={t.id_mesa} className={`relative p-6 rounded-3xl border-2 transition-all shadow-md hover:shadow-lg ${
                t.estado === 'Ocupada' ? 'border-red-100 bg-red-50/50 dark:bg-red-900/20' : 
                t.estado === 'Reservada' ? 'border-amber-100 bg-amber-50/50 dark:bg-amber-900/20' :
                'border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/20'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="text-xl font-black dark:text-white">#{t.n_mesa}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(t.id_mesa)}
                    className="p-2 bg-white dark:bg-gray-800 text-red-500 rounded-xl shadow-sm hover:bg-red-500 hover:text-white transition-all border border-red-50 dark:border-red-900/30"
                    title="Eliminar mesa"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    👥 Capacidad: <span className="text-gray-900 dark:text-white">{t.capacidad} pers.</span>
                  </p>
                  
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block mb-1 ml-1">Estado de Mesa</label>
                    <select 
                      value={t.estado}
                      onChange={(e) => handleUpdateStatus(t.id_mesa, e.target.value)}
                      className={`w-full p-2.5 rounded-xl text-xs font-black outline-none border-2 transition-all cursor-pointer ${
                        t.estado === 'Ocupada' ? 'bg-red-100 border-red-200 text-red-700' : 
                        t.estado === 'Reservada' ? 'bg-amber-100 border-amber-200 text-amber-700' :
                        'bg-emerald-100 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Ocupada">Ocupada</option>
                      <option value="Reservada">Reservada</option>
                    </select>
                  </div>
                </div>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Mesa">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Número de Mesa</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.n_mesa} onChange={e => setFormData({...formData, n_mesa: e.target.value})} placeholder="Ej: 01, A1..." />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Capacidad (Personas)</label>
            <input type="number" required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.capacidad} onChange={e => setFormData({...formData, capacidad: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Sucursal</label>
            <select required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.id_restaurante} onChange={e => setFormData({...formData, id_restaurante: e.target.value})}>
              <option value="">Seleccionar sucursal...</option>
              {restaurants.map(r => <option key={r.id_restaurante} value={r.id_restaurante}>{r.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300 mb-1">Estado Inicial</label>
            <select className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition">
            Crear Mesa
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TablesSection;
