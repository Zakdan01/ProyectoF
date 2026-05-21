import React, { useState, useEffect } from 'react';

const StatsSection = () => {
  const [popularDishes, setPopularity] = useState([]);
  const [orderBreakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('summary'); // 'summary' o 'detailed'

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, dRes] = await Promise.all([
        fetch('http://localhost:5000/api/reportes/popularidad'),
        fetch('http://localhost:5000/api/reportes/desglose')
      ]);
      const dataP = await pRes.json();
      const dataD = await dRes.json();
      setPopularity(Array.isArray(dataP) ? dataP : []);
      setBreakdown(Array.isArray(dataD) ? dataD : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="p-10 text-center dark:text-white font-bold animate-pulse">Generando reportes de ventas...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER DE REPORTES */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-3xl font-black dark:text-white mb-2 tracking-tight">Análisis de Ventas</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visualiza el rendimiento de tus platillos y el detalle de cada orden.</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl border dark:border-gray-700">
          <button 
            onClick={() => setView('summary')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${view === 'summary' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-500 hover:text-orange-600'}`}
          >
            POPULARIDAD
          </button>
          <button 
            onClick={() => setView('detailed')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${view === 'detailed' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-gray-500 hover:text-orange-600'}`}
          >
            DESGLOSE DETALLADO
          </button>
        </div>
      </div>

      {view === 'summary' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDishes.map((dish, i) => (
            <div key={dish.id_platillo} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-full"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-2xl">
                  {i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🍽️'}
                </div>
                <span className="text-2xl font-black text-orange-600">#{i + 1}</span>
              </div>
              <h4 className="text-xl font-black dark:text-white mb-2 truncate">{dish.nombre_platillo}</h4>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Precio Unitario: Bs. {dish.precio}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 dark:border-gray-700">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Unidades</p>
                  <p className="text-2xl font-black dark:text-white">{dish.total_vendido || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Total Bs.</p>
                  <p className="text-2xl font-black text-emerald-600">{Number(dish.ingresos_totales || 0).toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Aparición en {dish.total_ordenes} órdenes</p>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-1000" 
                    style={{ width: `${Math.min((dish.total_vendido / (popularDishes[0]?.total_vendido || 1)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Orden</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fecha/Hora</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Platillo</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Cant.</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {orderBreakdown.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all">
                    <td className="px-8 py-4 font-black dark:text-white text-sm">#{item.id_orden}</td>
                    <td className="px-8 py-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(item.fecha_hora).toLocaleDateString()} {new Date(item.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-8 py-4 dark:text-gray-300 text-sm font-bold">{item.cliente_nombre}</td>
                    <td className="px-8 py-4">
                      <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-lg text-xs font-black border border-orange-100 dark:border-orange-800">
                        {item.nombre_platillo}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center font-black dark:text-white text-sm">x{item.cantidad}</td>
                    <td className="px-8 py-4 text-right font-black text-emerald-600">Bs. {Number(item.subtotal).toFixed(2)}</td>
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

export default StatsSection;