import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            {...toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type, onClose }) => {
  const colors = {
    success: 'bg-green-600 shadow-green-600/20', // Creación
    update: 'bg-blue-600 shadow-blue-600/20',   // Actualización
    error: 'bg-red-600 shadow-red-600/20'       // Eliminación/Error
  };

  const icons = {
    success: '✨',
    update: '🔄',
    error: '🗑️'
  };

  return (
    <div className={`${colors[type] || colors.success} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slideInRight cursor-pointer hover:scale-105 transition-transform`} onClick={onClose}>
      <span className="text-2xl">{icons[type] || icons.success}</span>
      <p className="font-bold text-sm">{message}</p>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
