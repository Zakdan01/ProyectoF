import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-12 px-8 mt-auto border-t border-gray-800 dark:border-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div>
          <span className="text-3xl font-black text-orange-500">RG</span>
          <p className="mt-4 text-gray-400">© 2026 Restaurante Gourmet. Todos los derechos reservados.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
          <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
