import React, { useState, useEffect } from 'react';

const PaymentsSection = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/api/pagos')
      .then(res => res.json())
      .then(data => {
        setPayments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando pagos...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-2xl font-bold dark:text-white">Historial de Transacciones</h3>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">ID Pago</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Orden</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Cliente</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Sucursal</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Fecha</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {payments.length > 0 ? (
                payments.map(p => (
                  <tr key={p.id_pago} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4 dark:text-gray-300 font-bold text-sm">#{p.id_pago}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-bold dark:text-gray-300">
                        ORD-{p.id_orden}
                      </span>
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300 text-sm font-medium">{p.cliente_nombre}</td>
                    <td className="px-6 py-4 dark:text-gray-400 text-xs">{p.restaurante_nombre}</td>
                    <td className="px-6 py-4 dark:text-gray-400 text-xs">
                      {new Date(p.fecha_pago).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-black text-green-600 text-sm">
                      Bs. {p.monto_pago}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center dark:text-gray-400">No hay registros de pagos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsSection;
