import API_URL from '../../config/api.js';
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { useToast } from '../../context/ToastContext';

const ProvidersSection = () => {
  const { showToast } = useToast();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre_asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    nombre_empresa: '',
    nombre_contacto: '',
    telefono: '',
    correo: '',
    direccion: ''
  });

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/proveedores`);
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setProviders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setProviders([]);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviders(); }, []);

  const handleOpenModal = (provider = null) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData(provider);
    } else {
      setEditingProvider(null);
      setFormData({
        nombre_empresa: '',
        nombre_contacto: '',
        telefono: '',
        correo: '',
        direccion: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProvider 
      ? `${API_URL}/proveedores/${editingProvider.id_proveedor}`
      : `${API_URL}/proveedores`;
    const method = editingProvider ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProviders();
        showToast(
          editingProvider ? 'Proveedor actualizado' : 'Proveedor registrado exitosamente',
          editingProvider ? 'update' : 'success'
        );
      } else {
        showToast('Error al procesar proveedor', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        const res = await fetch(`${API_URL}/proveedores/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchProviders();
          showToast('Proveedor eliminado', 'error');
        } else {
          showToast('No se pudo eliminar el proveedor', 'error');
        }
      } catch (err) {
        console.error(err);
        showToast('Error al intentar eliminar', 'error');
      }
    }
  };

  const filteredAndSortedProviders = providers
    .filter(p => 
      p.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre_contacto.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'nombre_asc') return a.nombre_empresa.localeCompare(b.nombre_empresa);
      if (sortBy === 'nombre_desc') return b.nombre_empresa.localeCompare(a.nombre_empresa);
      return 0;
    });

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando proveedores...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Gestión de Proveedores</h3>
        <button onClick={() => handleOpenModal()} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-600/20">+ Nuevo Proveedor</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex-grow relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por empresa o contacto..." 
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
            <option value="nombre_asc">Empresa (A-Z)</option>
            <option value="nombre_desc">Empresa (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedProviders.map(p => (
          <div key={p.id_proveedor} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:w-20 group-hover:h-20"></div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-2xl">
                🏢
              </div>
              <div>
                <h4 className="font-bold dark:text-white text-lg">{p.nombre_empresa}</h4>
                <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">{p.nombre_contacto}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📞</span> {p.telefono || 'Sin teléfono'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📧</span> {p.correo || 'Sin correo'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>📍</span> {p.direccion || 'Sin dirección'}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700">
              <span className="text-[10px] text-gray-400 font-mono">ID: #{p.id_proveedor}</span>
              <div className="flex gap-2">
                <button onClick={() => handleOpenModal(p)} className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition" title="Editar">
                  ✏️
                </button>
                <button onClick={() => handleDelete(p.id_proveedor)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition" title="Eliminar">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedProviders.length === 0 && (
        <div className="p-20 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500">No se encontraron proveedores.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Nombre de la Empresa</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.nombre_empresa} onChange={e => setFormData({...formData, nombre_empresa: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Nombre de Contacto</label>
            <input required className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.nombre_contacto} onChange={e => setFormData({...formData, nombre_contacto: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold dark:text-gray-300">Teléfono</label>
              <input className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold dark:text-gray-300">Correo</label>
              <input type="email" className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold dark:text-gray-300">Dirección</label>
            <textarea className="w-full p-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg dark:text-white" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-orange-700 transition">
            {editingProvider ? 'Actualizar' : 'Registrar Proveedor'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProvidersSection;