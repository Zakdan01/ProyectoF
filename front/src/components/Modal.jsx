import React from 'react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full ${maxWidth} overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl md:text-2xl font-bold dark:text-white tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-white transition-all"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="p-5 md:p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
