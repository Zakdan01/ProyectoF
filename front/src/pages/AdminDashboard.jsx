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
import SupplyManagementSection from '../components/admin/SupplyManagementSection';
import RecipeManagementSection from '../components/admin/RecipeManagementSection';
import StatsSection from '../components/admin/StatsSection';
import AuditSection from '../components/admin/AuditSection';
import AllOrdersSection from '../components/admin/AllOrdersSection';
import OrdersSection from '../components/admin/OrdersSection';
import KitchenSection from '../components/admin/KitchenSection';
import WaiterSection from '../components/admin/WaiterSection';

const AdminDashboard = () => {
  const { user } = useAppContext();
  
  // Definición de permisos por rol
  const rolePermissions = {
    'Administrador': ['roles', 'users', 'restaurants', 'tables', 'dishes', 'recipes', 'clients', 'orders', 'payments', 'all-orders', 'stats', 'kitchen', 'waiter', 'ingredients', 'providers', 'supplies', 'audit'],
    'Cajero': ['orders', 'tables', 'clients', 'payments', 'all-orders', 'stats', 'providers', 'ingredients', 'supplies'],
    'Cocinero': ['kitchen', 'dishes', 'recipes', 'stats', 'ingredients'],
    'Mesero': ['waiter', 'tables', 'dishes', 'stats']
  };

  const getInitialTab = (role) => {
    switch (role) {
      case 'Cajero': return 'orders';
      case 'Cocinero': return 'kitchen';
      case 'Mesero': return 'waiter';
      default: return 'roles';
    }
  };

  const [activeTab, setActiveTab] = useState(() => getInitialTab(user?.rol_nombre));

  if (!user || !rolePermissions[user.rol_nombre]) {
    return <div className="p-20 text-center dark:text-white text-2xl font-bold animate-fadeIn">Acceso denegado. Se requieren permisos autorizados.</div>;
  }

  const allTabs = [
    { id: 'roles', label: 'Roles', icon: '🔑' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'restaurants', label: 'Restaurantes', icon: '🏢' },
    { id: 'tables', label: 'Mesas', icon: '🪑' },
    { id: 'dishes', label: 'Platillos', icon: '🍽️' },
    { id: 'recipes', label: 'Recetas', icon: '📖' },
    { id: 'clients', label: 'Clientes', icon: '👤' },
    { id: 'orders', label: 'Órdenes', icon: '💰' },
    { id: 'payments', label: 'Pagos', icon: '💳' },
    { id: 'all-orders', label: 'Todas las Órdenes', icon: '📋' },
    { id: 'stats', label: 'Análisis de Ventas', icon: '📊' },
    { id: 'kitchen', label: 'Cocina', icon: '👨‍🍳' },
    { id: 'waiter', label: 'Meseros', icon: '🏃' },
    { id: 'ingredients', label: 'Inventario', icon: '📦' },
    { id: 'providers', label: 'Proveedores', icon: '🚚' },
    { id: 'supplies', label: 'Suministros', icon: '🤝' },
    { id: 'audit', label: 'Auditoría', icon: '🛡️' },
  ];

  const filteredTabs = allTabs.filter(tab => rolePermissions[user.rol_nombre].includes(tab.id));

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-950 transition-colors duration-300 min-h-screen">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-shrink-0 hidden lg:block sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
        <div className="p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Operaciones Reales</p>
          <nav className="space-y-2">
            {filteredTabs.map(tab => (
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

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden sticky top-[73px] z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex space-x-2 min-w-max">
          {filteredTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col min-h-[calc(100vh-73px)] overflow-x-hidden">
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
          <header className="mb-6 md:mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-orange-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-1 md:mb-2">Panel de Administración</p>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                  {user.restaurante_nombre || 'Gestión Global'}
                </h2>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 px-4 md:px-6 py-2 md:py-3 rounded-2xl">
                <p className="text-[9px] md:text-[10px] font-black text-orange-600/50 uppercase mb-0.5 md:mb-1">Sesión iniciada como</p>
                <p className="text-xs md:text-sm font-bold dark:text-white flex items-center gap-2">
                  <span className="text-base md:text-lg">⚡</span> {user.rol_nombre}
                </p>
              </div>
            </div>
            <div className="h-1 w-16 md:w-20 bg-orange-600 mt-4 md:mt-6 rounded-full"></div>
          </header>

          <div className="pb-10">
            {activeTab === 'roles' && <RolesSection />}
            {activeTab === 'users' && <UsersSection />}
            {activeTab === 'restaurants' && <RestaurantsSection />}
            {activeTab === 'tables' && <TablesSection />}
            {activeTab === 'dishes' && <DishesSection />}
            {activeTab === 'clients' && <ClientsSection />}
            {activeTab === 'orders' && <OrdersSection />}
            {activeTab === 'all-orders' && <AllOrdersSection />}
            {activeTab === 'stats' && <StatsSection />}
            {activeTab === 'payments' && <PaymentsSection />}
            {activeTab === 'kitchen' && <KitchenSection />}
            {activeTab === 'waiter' && <WaiterSection />}
            {activeTab === 'ingredients' && <IngredientsSection />}
            {activeTab === 'providers' && <ProvidersSection />}
            {activeTab === 'supplies' && <SupplyManagementSection />}
            {activeTab === 'recipes' && <RecipeManagementSection />}
            {activeTab === 'audit' && <AuditSection />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;