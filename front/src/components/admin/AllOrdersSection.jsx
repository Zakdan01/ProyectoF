import React, { useState, useEffect } from 'react';

const AllOrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRest, setSelectedRest] = useState('');
  const [selectedFecha, setSelectedFecha] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    let url = 'http://localhost:5000/api/ordenes';
    const params = [];
    if (selectedRest) params.push(`id_restaurante=${selectedRest}`);
    if (selectedFecha) params.push(`fecha=${selectedFecha}`);
    
    if (params.length > 0) url += `?${params.join('&')}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al cargar órdenes');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las órdenes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetch('http://localhost:5000/api/restaurantes')
      .then(res => res.json())
      .then(setRestaurants)
      .catch(() => setRestaurants([]));
  }, [selectedRest, selectedFecha]);

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando órdenes...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-2xl font-bold dark:text-white">Registro Global de Órdenes</h3>
        <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border dark:border-gray-700">
          <select className="p-1 bg-transparent dark:text-white outline-none text-sm" value={selectedRest} onChange={(e) => setSelectedRest(e.target.value)}>
            <option value="">Todas las sucursales</option>
            {Array.isArray(restaurants) && restaurants.map(r => <option key={r.id_restaurante} value={r.id_restaurante}>{r.nombre}</option>)}
          </select>
          <input type="date" className="p-1 bg-transparent dark:text-white outline-none text-sm" value={selectedFecha} onChange={(e) => setSelectedFecha(e.target.value)} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">ID</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Fecha/Hora</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Cliente</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Mesa</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Atendido por</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Platillos</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Total</th>
                <th className="px-4 py-4 font-bold dark:text-white text-sm">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map(o => (
                  <tr key={o.id_orden} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-4 py-4 dark:text-gray-300 font-bold text-sm">#{o.id_orden}</td>
                    <td className="px-4 py-4 dark:text-gray-400 text-xs">
                      {new Date(o.fecha_hora).toLocaleDateString()}<br/>
                      {new Date(o.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-4 dark:text-gray-300 text-sm font-medium">{o.cliente_nombre}</td>
                    <td className="px-4 py-4 dark:text-gray-300 text-sm">
                      <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded-md border border-blue-100 dark:border-blue-800">
                        {o.mesa_nombre}
                      </span>
                    </td>
                    <td className="px-4 py-4 dark:text-gray-400 text-[11px]">
                      <div><span className="font-bold text-gray-500 uppercase">Cajero:</span> {o.cajero_nombre}</div>
                      <div><span className="font-bold text-gray-500 uppercase">Mesero:</span> {o.mesero_nombre || 'No asignado'}</div>
                    </td>
                    <td className="px-4 py-4 dark:text-gray-300 text-[11px] max-w-xs">
                      <p className="line-clamp-2" title={o.platillos}>{o.platillos}</p>
                    </td>
                    <td className="px-4 py-4 font-black text-orange-600 text-sm whitespace-nowrap">Bs. {o.total}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase shadow-sm border ${
                        o.estado.toUpperCase() === 'ENTREGADO' ? 'bg-green-100 text-green-700 border-green-200' : 
                        o.estado.toUpperCase() === 'LISTO PARA ENTREGA' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        o.estado.toUpperCase() === 'EN PREPARACIÓN' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {o.estado}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center dark:text-gray-400">No hay órdenes para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersSection;
