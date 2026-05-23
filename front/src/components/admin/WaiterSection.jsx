import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../Modal';

const WaiterSection = () => {
  const { user } = useAppContext();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ordenes/listas');
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch(err) {
      console.error(err);
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(); 
    const int = setInterval(fetchOrders, 5000); 
    return () => clearInterval(int); 
  }, []);

  const handleDeliver = async () => {
    if (!user || !orderToConfirm) return alert("Debes estar logueado para entregar órdenes");
    
    try {
      const res = await fetch(`http://localhost:5000/api/ordenes/${orderToConfirm.id_orden}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          estado: 'ENTREGADO', 
          id_mesero: user.id_usuario 
        })
      });
      if (res.ok) {
        fetchOrders();
        setIsConfirmModalOpen(false);
        const orderId = orderToConfirm.id_orden;
        setOrderToConfirm(null);
        showToast(`Orden #${orderId} entregada con éxito`, 'update');
      } else {
        const errorData = await res.json();
        showToast("Error al entregar: " + (errorData.error || "Error desconocido"), 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error de conexión', 'error');
    }
  };

  const openConfirmModal = (order) => {
    setOrderToConfirm(order);
    setIsConfirmModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando entregas...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold dark:text-white">Pedidos por Entregar</h3>
        <span className="flex items-center gap-2 text-xs font-bold text-blue-500 animate-pulse">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span> PENDIENTES
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Orden</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Sucursal</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Mesa</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Cliente</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm">Contenido</th>
                <th className="px-6 py-4 font-bold dark:text-white text-sm text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.length > 0 ? (
                orders.map(o => (
                  <tr key={o.id_orden} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition">
                    <td className="px-6 py-4">
                      <span className="font-black dark:text-white">#{o.id_orden}</span>
                      <p className="text-[10px] text-gray-400">{new Date(o.fecha_hora).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{o.restaurante_nombre}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg font-bold text-xs uppercase">
                        {o.mesa_nombre || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300 text-sm font-medium">{o.cliente_nombre} {o.cliente_apellido}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs dark:text-gray-400 italic">
                        {o.platillos}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="px-2 py-1 rounded text-[9px] font-black bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                          {o.estado}
                        </span>
                        <button 
                          onClick={() => openConfirmModal(o)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/20 whitespace-nowrap flex items-center gap-2 mx-auto"
                        >
                          🚀 ENTREGAR
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-center dark:text-gray-400 italic">
                    No hay pedidos listos para entrega en este momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        title="Confirmar Entrega"
        maxWidth="max-w-md"
      >
        {orderToConfirm && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <p className="dark:text-gray-300">¿Confirmas que vas a entregar el siguiente pedido?</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Orden</span>
                <span className="font-black dark:text-white">#{orderToConfirm.id_orden}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Cliente</span>
                <span className="font-bold dark:text-white">{orderToConfirm.cliente_nombre} {orderToConfirm.cliente_apellido}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase">Contenido</span>
                <p className="text-sm dark:text-gray-300 leading-relaxed">
                  {orderToConfirm.platillos}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDeliver}
                className="flex-1 px-6 py-3 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all"
              >
                CONFIRMAR
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WaiterSection;

