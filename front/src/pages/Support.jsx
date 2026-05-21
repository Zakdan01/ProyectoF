import React from 'react';

const Support = () => {
  return (
    <div className="py-24 px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Contacto y Soporte</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
            ¿Tienes alguna duda sobre nuestro sistema o quieres realizar una reserva especial? Nuestro equipo de soporte está disponible para ayudarte.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                📍
              </div>
              <div>
                <h5 className="font-bold text-gray-800 dark:text-white">Ubicación</h5>
                <p className="text-gray-600 dark:text-gray-400">Calle Gastronomía 123, Ciudad Gourmet</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                📞
              </div>
              <div>
                <h5 className="font-bold text-gray-800 dark:text-white">Teléfono de Soporte</h5>
                <p className="text-gray-600 dark:text-gray-400">+52 555-123-4567</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                ✉️
              </div>
              <div>
                <h5 className="font-bold text-gray-800 dark:text-white">Email Directo</h5>
                <p className="text-gray-600 dark:text-gray-400">soporte@restaurantegourmet.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl">
          <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Envíanos un mensaje</h4>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
              <input type="text" className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white" placeholder="Tu nombre..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
              <input type="email" className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Mensaje o Consulta</label>
              <textarea rows="4" className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none dark:text-white" placeholder="¿Cómo podemos ayudarte?"></textarea>
            </div>
            <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition shadow-lg">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
