import React, { useState, useEffect } from 'react';

const MenuItem = ({ name, price, desc, img }) => (
  <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
    <div className="h-80 overflow-hidden relative">
      <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
      <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
        <span className="text-orange-600 font-black text-xl">Bs. {price}</span>
      </div>
    </div>
    <div className="p-10 flex-grow flex flex-col justify-center text-center">
      <h5 className="font-black text-3xl text-gray-900 dark:text-white mb-4 tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{name}</h5>
      <div className="w-12 h-1 bg-orange-200 dark:bg-gray-700 mx-auto mb-6 rounded-full group-hover:w-24 group-hover:bg-orange-500 transition-all duration-500"></div>
      <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed italic">"{desc || 'Nuestra especialidad de la casa, preparada con los ingredientes más frescos.'}"</p>
    </div>
  </div>
);

const Menu = () => {
  // Estado para almacenar los platillos (conectado a la base de datos)
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Llamada real al backend
        const response = await fetch('http://localhost:5000/api/platillos');
        
        if (!response.ok) {
          throw new Error('No se pudo obtener el menú del servidor');
        }

        const data = await response.json();
        setDishes(data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando el menú:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto min-h-screen animate-fadeIn">
      <div className="text-center mb-16 md:mb-24">
        <p className="text-orange-600 font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-4">Experiencia Gastronómica</p>
        <h3 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">Nuestra Carta</h3>
        <div className="w-16 md:w-24 h-1.5 md:h-2 bg-orange-600 mx-auto rounded-full"></div>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-orange-600 border-t-transparent mb-6"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm animate-pulse">Cargando Manjares...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 md:py-20 bg-red-50 dark:bg-red-900/10 rounded-[2rem] md:rounded-[3rem] border border-red-100 dark:border-red-900/30">
          <p className="text-red-500 text-xl md:text-2xl font-black mb-2">⚠️ Error de Conexión</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No pudimos conectar con la cocina central.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {dishes.map((dish) => (
            <MenuItem 
              key={dish.id_platillo}
              name={dish.nombre_platillo}
              price={dish.precio}
              desc={dish.descripcion}
              img={dish.imagen_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
            />
          ))}
        </div>
      )}

      {!loading && !error && dishes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No hay platillos disponibles en la base de datos.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
