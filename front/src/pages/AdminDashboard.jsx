import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import RolesSection from '../components/admin/RolesSection';
import UsersSection from '../components/admin/UsersSection';
import RestaurantsSection from '../components/admin/RestaurantsSection';
import TablesSection from '../components/admin/TablesSection';
import DishesSection from '../components/admin/DishesSection';
import ClientsSection from '../components/admin/ClientsSection';
import PaymentsSection from '../components/admin/PaymentsSection';
import IngredientsSection from '../components/admin/IngredientsSection';
import ProvidersSection from '../components/admin/ProvidersSection';
import AuditSection from '../components/admin/AuditSection';
import AllOrdersSection from '../components/admin/AllOrdersSection';
import OrdersSection from '../components/admin/OrdersSection';
import KitchenSection from '../components/admin/KitchenSection';
import WaiterSection from '../components/admin/WaiterSection';

const AdminDashboard = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('roles');

  if (!user || user.rol_nombre !== 'Administrador') {
    return <div className="p-20 text-center dark:text-white text-2xl font-bold animate-fadeIn">Acceso denegado. Se requieren permisos de Administrador.</div>;
  }

  const tabs = [
    { id: 'roles', label: 'Roles', icon: '🔑' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'restaurants', label: 'Restaurantes', icon: '🏢' },
    { id: 'tables', label: 'Mesas', icon: '🪑' },
    { id: 'dishes', label: 'Platillos', icon: '🍽️' },
    { id: 'clients', label: 'Clientes', icon: '👤' },
    { id: 'orders', label: 'Órdenes', icon: '💰' },
    { id: 'all-orders', label: 'Todas las Órdenes', icon: '📋' },
    { id: 'payments', label: 'Pagos', icon: '💳' },
    { id: 'kitchen', label: 'Cocina', icon: '👨‍🍳' },
    { id: 'waiter', label: 'Meseros', icon: '🏃' },
    { id: 'ingredients', label: 'Inventario', icon: '📦' },
    { id: 'providers', label: 'Proveedores', icon: '🚚' },
    { id: 'audit', label: 'Auditoría', icon: '🛡️' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Operaciones Reales</p>
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/20' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600'}`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-[1600px] mx-auto">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-orange-600 font-black text-xs uppercase tracking-[0.2em] mb-2">Panel de Administración</p>
              <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                {user.restaurante_nombre || 'Gestión Global'}
              </h2>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 px-6 py-3 rounded-2xl">
              <p className="text-[10px] font-black text-orange-600/50 uppercase mb-1">Sesión iniciada como</p>
              <p className="text-sm font-bold dark:text-white flex items-center gap-2">
                <span className="text-lg">⚡</span> {user.rol_nombre}
              </p>
            </div>
          </div>
          <div className="h-1 w-20 bg-orange-600 mt-6 rounded-full"></div>
        </header>

        <div className="pb-20">
          {activeTab === 'roles' && <RolesSection />}
          {activeTab === 'users' && <UsersSection />}
          {activeTab === 'restaurants' && <RestaurantsSection />}
          {activeTab === 'tables' && <TablesSection />}
          {activeTab === 'dishes' && <DishesSection />}
          {activeTab === 'clients' && <ClientsSection />}
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'all-orders' && <AllOrdersSection />}
          {activeTab === 'payments' && <PaymentsSection />}
          {activeTab === 'kitchen' && <KitchenSection />}
          {activeTab === 'waiter' && <WaiterSection />}
          {activeTab === 'ingredients' && <IngredientsSection />}
          {activeTab === 'providers' && <ProvidersSection />}
          {activeTab === 'audit' && <AuditSection />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
