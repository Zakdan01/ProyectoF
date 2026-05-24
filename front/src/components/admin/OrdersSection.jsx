import API_URL from '../../config/api.js';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const OrdersSection = () => {
  const { user } = useAppContext();
  const [platillos, setPlatillos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [cart, setCart] = useState([]);
  
  // Estados de Búsqueda y Formulario
  const [dishSearch, setDishSearch] = useState('');
  const [clientData, setClientData] = useState({ nombres: '', apellidos: '', ci: '' });
  const [selectedMesa, setSelectedMesa] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);

  const fetchData = async () => {
    try {
      const pRes = await fetch(`${API_URL}/platillos`);
      const dataP = await pRes.json();
      setPlatillos(Array.isArray(dataP) ? dataP : []);
      
      if (user?.id_restaurante) {
        const mRes = await fetch(`${API_URL}/mesas?id_restaurante=${user.id_restaurante}`);
        const dataM = await mRes.json();
        setMesas(Array.isArray(dataM) ? dataM : []);
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleReset = () => {
    setCart([]);
    setClientData({ nombres: '', apellidos: '', ci: '' });
    setSelectedMesa('');
  };

  const addToCart = (dish) => {
    if (dish.disponibilidad !== 'Disponible') return;
    const existing = cart.find(item => item.id_platillo === dish.id_platillo);
    if (existing) {
      setCart(cart.map(item => 
        item.id_platillo === dish.id_platillo 
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (Number((item.cantidad + 1) * dish.precio)).toFixed(2) } 
          : item
      ));
    } else {
      setCart([...cart, { ...dish, cantidad: 1, subtotal: Number(dish.precio).toFixed(2) }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id_platillo !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id_platillo === id) {
        const newQty = item.cantidad + delta;
        if (newQty <= 0) return item; 
        return { ...item, cantidad: newQty, subtotal: (Number(newQty * item.precio)).toFixed(2) };
      }
      return item;
    }));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.subtotal), 0);

  const handleConfirmOrder = async () => {
    if (!clientData.nombres || !clientData.ci) return alert('Debes ingresar al menos el Nombre y CI del cliente.');
    if (cart.length === 0) return alert('El carrito no tiene productos.');

    setIsProcessing(true);
    try {
      const payload = {
        nuevo_cliente: clientData,
        id_mesa: selectedMesa || null,
        total: total,
        id_cajero: user.id_usuario,
        items: cart.map(i => ({ 
          id_platillo: i.id_platillo, 
          cantidad: i.cantidad, 
          subtotal: Number(i.subtotal) 
        }))
      };

      const response = await fetch(`${API_URL}/ordenes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setLastOrderTotal(total); // Guardamos el total antes de limpiar
        setLastOrderId(result.id_orden);
        setIsSuccessModalOpen(true);
        handleReset();
        fetchData();
      } else {
        alert('Error: ' + (result.error || 'No se pudo procesar la orden'));
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDishes = platillos.filter(p => 
    p.nombre_platillo.toLowerCase().includes(dishSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-220px)] animate-fadeIn">
      <div className="flex-grow flex flex-col gap-6 overflow-hidden min-h-[500px] lg:min-h-0">
        
        {/* REGISTRO DE CLIENTE DIRECTO */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-grow space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Datos del Cliente</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                placeholder="Nombre" 
                className="p-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 rounded-xl text-sm dark:text-white outline-none transition-all" 
                value={clientData.nombres} 
                onChange={e => setClientData({...clientData, nombres: e.target.value})} 
              />
              <input 
                placeholder="Apellidos" 
                className="p-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 rounded-xl text-sm dark:text-white outline-none transition-all" 
                value={clientData.apellidos} 
                onChange={e => setClientData({...clientData, apellidos: e.target.value})} 
              />
              <input 
                placeholder="CI / Documento" 
                className="p-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 rounded-xl text-sm dark:text-white outline-none transition-all" 
                value={clientData.ci} 
                onChange={e => setClientData({...clientData, ci: e.target.value})} 
              />
            </div>
          </div>

          <div className="w-full md:w-48 space-y-4">
             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Ubicación</h4>
             <select className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-orange-500 rounded-xl text-sm dark:text-white outline-none transition-all" value={selectedMesa} onChange={e => setSelectedMesa(e.target.value)}>
               <option value="">🏠 Para llevar</option>
               {mesas.map(m => (
                 <option key={m.id_mesa} value={m.id_mesa} disabled={m.estado === 'Ocupada'}>
                   Mesa {m.n_mesa} {m.estado === 'Ocupada' ? '(Ocupada)' : ''}
                 </option>
               ))}
             </select>
          </div>
        </div>

        {/* LISTADO DE PLATILLOS */}
        <div className="flex-grow flex flex-col gap-4 overflow-hidden">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar platillo..." 
              className="w-full p-4 pl-12 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm text-sm dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50"
              value={dishSearch}
              onChange={(e) => setDishSearch(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🍕</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-6 custom-scrollbar">
            {filteredDishes.map(p => (
              <button 
                key={p.id_platillo} 
                onClick={() => addToCart(p)}
                disabled={p.disponibilidad !== 'Disponible'}
                className={`flex flex-col p-4 md:p-5 bg-white dark:bg-gray-800 rounded-3xl border-2 transition-all relative group text-left shadow-sm ${
                  p.disponibilidad === 'Disponible' 
                  ? 'hover:border-orange-500 border-transparent hover:shadow-lg' 
                  : 'opacity-50 grayscale border-transparent cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-xl md:text-2xl group-hover:scale-110 transition-transform">
                    🍛
                  </div>
                  <span className={`text-[8px] md:text-[9px] font-black px-2 py-1 rounded-lg uppercase border ${
                    p.disponibilidad === 'Disponible' 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                  }`}>
                    {p.disponibilidad}
                  </span>
                </div>
                <p className="font-bold dark:text-white text-sm md:text-base leading-tight mb-1 truncate w-full">{p.nombre_platillo}</p>
                <p className="text-orange-600 font-black text-base md:text-lg">Bs. {p.precio}</p>
                <div className="absolute bottom-4 right-4 bg-orange-600 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-black shadow-lg opacity-0 lg:group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all scale-0 lg:group-hover:scale-100">
                  +
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARRITO */}
      <div className="w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden lg:h-full min-h-[400px]">
        <div className="p-4 md:p-6 bg-gray-50/50 dark:bg-gray-900/50 border-b dark:border-gray-700">
          <h4 className="text-lg md:text-xl font-black dark:text-white flex items-center gap-3">
            🛒 Carrito <span className="bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>
          </h4>
        </div>

        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
          {cart.length > 0 ? cart.map(item => (
            <div key={item.id_platillo} className="flex gap-3 md:gap-4 group animate-fadeIn">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl md:text-2xl">
                🍲
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-xs md:text-sm font-black dark:text-white truncate pr-2">{item.nombre_platillo}</p>
                  <button onClick={() => removeFromCart(item.id_platillo)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">🗑️</button>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-1 border dark:border-gray-700 scale-90 md:scale-100 origin-left">
                    <button onClick={() => updateQuantity(item.id_platillo, -1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-gray-500 hover:text-orange-600 transition">-</button>
                    <span className="w-6 md:w-8 text-center font-black dark:text-white text-xs md:text-sm">{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id_platillo, 1)} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-gray-500 hover:text-orange-600 transition">+</button>
                  </div>
                  <p className="font-black text-orange-600 text-sm md:text-base">Bs. {item.subtotal}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
              <div className="text-5xl md:text-6xl mb-4">🛒</div>
              <p className="font-bold dark:text-white">Tu carrito está vacío</p>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 border-t dark:border-gray-700 space-y-4 md:space-y-6 bg-white dark:bg-gray-800">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-base md:text-lg font-black dark:text-white">TOTAL</span>
              <span className="text-3xl md:text-4xl font-black text-orange-600 tracking-tighter">Bs. {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4">
             <button onClick={handleReset} className="p-3 md:p-4 bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-2xl transition-all hover:bg-gray-200">🧹</button>
             <button 
               onClick={handleConfirmOrder}
               disabled={isProcessing || cart.length === 0}
               className={`flex-grow bg-orange-600 text-white font-black py-3 md:py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                 isProcessing || cart.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-orange-700 hover:shadow-orange-600/50'
               }`}
             >
               {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'CONFIRMAR PEDIDO'}
             </button>
          </div>
        </div>
      </div>

      {/* MODAL DE ÉXITO */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-700 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">✓</div>
            <h3 className="text-2xl font-black dark:text-white mb-2">¡Orden Confirmada!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 uppercase font-bold tracking-widest">Orden #{lastOrderId}</p>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 mb-8 border border-dashed border-gray-200 dark:border-gray-700">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Pagado</p>
               <p className="text-3xl font-black text-orange-600">Bs. {lastOrderTotal.toFixed(2)}</p>
               <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 uppercase font-black tracking-widest">
                 Enviada a Cocina
               </div>
            </div>

            <button onClick={() => setIsSuccessModalOpen(false)} className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-4 rounded-2xl hover:opacity-90 transition-all">CONTINUAR</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;