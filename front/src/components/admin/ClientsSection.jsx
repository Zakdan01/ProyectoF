import React, { useState, useEffect } from 'react';

const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recientes');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/clientes')
      .then(res => res.json())
      .then(data => {
        setClients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredAndSortedClients = clients
    .filter(c => 
      `${c.nombres} ${c.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ci.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'nombre_asc') return a.nombres.localeCompare(b.nombres);
      if (sortBy === 'nombre_desc') return b.nombres.localeCompare(a.nombres);
      if (sortBy === 'recientes') return new Date(b.fecha_registro) - new Date(a.fecha_registro);
      if (sortBy === 'antiguos') return new Date(a.fecha_registro) - new Date(b.fecha_registro);
      return 0;
    });

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando clientes...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Base de Datos de Clientes</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex-grow relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o CI..." 
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
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="nombre_asc">Nombre (A-Z)</option>
            <option value="nombre_desc">Nombre (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Cliente</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Documento (CI)</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredAndSortedClients.length > 0 ? (
                filteredAndSortedClients.map(c => (
                  <tr key={c.id_cliente} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold text-xs">
                          {c.nombres[0]}{c.apellidos[0]}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white text-sm">{c.nombres} {c.apellidos}</p>
                          <p className="text-[10px] text-gray-400">ID Cliente: #{c.id_cliente}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300 text-sm font-mono">{c.ci}</td>
                    <td className="px-6 py-4 dark:text-gray-400 text-sm">
                      {new Date(c.fecha_registro).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-10 text-center dark:text-gray-400">No se encontraron clientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientsSection;
