import React from 'react';
import { Link } from 'react-router-dom';

const TeamMember = ({ name, role, img }) => (
  <div className="text-center group">
    <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full border-4 border-orange-100 dark:border-gray-700 group-hover:border-orange-500 transition-colors">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <h5 className="text-xl font-bold text-gray-800 dark:text-white">{name}</h5>
    <p className="text-orange-600">{role}</p>
  </div>
);

const Home = () => {
  return (
    <div>
      {/* Welcome / Hero Section */}
      <header className="relative py-24 px-8 bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-20">
            <span className="inline-block px-4 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">BIENVENIDO AL SISTEMA</span>
            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 dark:text-white leading-tight">
              Gestionamos tu <span className="text-orange-600">Sabor</span> con Excelencia.
            </h2>
            <p className="text-xl mb-12 text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Accede a la plataforma de gestión del Restaurante Gourmet para administrar pedidos, reservas y la experiencia de tus clientes de forma centralizada.
            </p>
            <div>
              <Link to="/login" className="inline-block bg-orange-600 text-white font-black py-5 px-14 rounded-2xl text-2xl hover:bg-orange-700 transition shadow-2xl transform hover:-translate-y-1 active:scale-95">
                INICIAR SESIÓN AHORA
              </Link>
            </div>
          </div>
          <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
              alt="Interior del restaurante" 
              className="w-full h-full object-cover scale-105 hover:scale-100 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="font-bold text-lg">Ambiente Exclusivo</p>
              <p className="opacity-80">Diseñado para la mejor experiencia</p>
            </div>
          </div>
        </div>
      </header>

      {/* Team Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Liderazgo y Excelencia</h3>
            <div className="w-20 h-1.5 bg-orange-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Nuestro equipo directivo trabaja incansablemente para garantizar que cada detalle de su experiencia sea perfecto.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <TeamMember name="Marco Rossi" role="Chef Jefe (Executive Chef)" img="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80" />
            <TeamMember name="Elena Méndez" role="Jefe de Meseros y Cajeros" img="https://images.unsplash.com/photo-1595273670150-db0a3bf39079?auto=format&fit=crop&w=400&q=80" />
            <TeamMember name="Andrés Soto" role="Jefe del Restaurante (General Manager)" img="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
