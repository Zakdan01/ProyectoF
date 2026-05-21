import React, { useState, useEffect } from 'react';

const MenuItem = ({ name, price, desc, img }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 dark:border-gray-700 group">
    <div className="h-48 overflow-hidden">
      <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-2">
        <h5 className="font-bold text-lg text-gray-800 dark:text-white">{name}</h5>
        <span className="text-orange-600 font-bold">{price}</span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
      <button className="mt-4 w-full py-2 border border-orange-600 text-orange-600 rounded-lg font-bold hover:bg-orange-600 hover:text-white transition duration-300">
        Pedir ahora
      </button>
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
    <div className="py-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Nuestra Selección Especial</h3>
        <div className="w-20 h-1.5 bg-orange-600 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Explora nuestra carta dinámica, sincronizada directamente con nuestra cocina real.
        </p>
      </div>
      
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Cargando platillos desde la base de datos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-xl font-bold">⚠️ Error: {error}</p>
          <p className="text-gray-500 mt-2">Asegúrate de que el servidor backend esté corriendo.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <MenuItem 
              key={dish.id_platillo}
              name={dish.nombre_platillo}
              price={`$${dish.precio}`}
              desc={dish.descripcion}
              img={dish.imagen_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"}
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
