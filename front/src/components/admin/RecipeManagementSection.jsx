import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

const RecipeManagementSection = () => {
  const [mappings, setMappings] = useState([]);
  const [allIngredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [ingSearch, setIngSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, iRes] = await Promise.all([
        fetch('http://localhost:5000/api/recetas'),
        fetch('http://localhost:5000/api/ingredientes')
      ]);
      const dataM = await mRes.json();
      const dataI = await iRes.json();
      setMappings(Array.isArray(dataM) ? dataM : []);
      setIngredients(Array.isArray(dataI) ? dataI : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (dish) => {
    setSelectedDish(dish);
    setSelectedIds(dish.ingredientes_ids || []);
    setIngSearch('');
    setIsModalOpen(true);
  };

  const handleToggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/recetas/${selectedDish.id_platillo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientes_ids: selectedIds })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredIngredients = allIngredients.filter(ing => 
    ing.nombre_ingrediente.toLowerCase().includes(ingSearch.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center dark:text-white font-bold">Cargando recetario gastronómico...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-3xl font-black dark:text-white mb-2 tracking-tight">Gestión de Recetas</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Define los ingredientes necesarios para preparar cada platillo del menú.</p>
      </div>

      <div className="grid gap-4">
        {mappings.map(p => (
          <div key={p.id_platillo} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-all group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">🍽️</div>
              <div>
                <h4 className="font-black dark:text-white text-xl leading-tight">{p.nombre_platillo}</h4>
                <p className="text-xs text-orange-600 font-black uppercase tracking-widest mt-1">Precio: Bs. {p.precio}</p>
              </div>
            </div>

            <div className="flex-grow max-w-2xl">
              <p className="text-[10px] font-black text-orange-600 uppercase mb-2 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                Ingredientes en Receta
              </p>
              <div className="flex flex-wrap gap-2">
                {p.ingredientes_nombres ? p.ingredientes_nombres.split(', ').map((name, i) => (
                  <span key={i} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                    🌿 {name}
                  </span>
                )) : <span className="text-xs text-gray-400 italic">No se han definido ingredientes para este platillo.</span>}
              </div>
            </div>

            <button 
              onClick={() => handleOpenModal(p)}
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest whitespace-nowrap hover:bg-emerald-600 hover:text-white active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none"
            >
              Configurar Receta
            </button>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Composición de: ${selectedDish?.nombre_platillo}`}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar ingrediente para la receta..." 
              className="w-full p-4 pl-12 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-emerald-500 rounded-[1.5rem] outline-none transition-all dark:text-white font-bold"
              value={ingSearch}
              onChange={(e) => setIngSearch(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto p-2 pr-4 custom-scrollbar">
            {filteredIngredients.map(ing => {
              const isSelected = selectedIds.includes(ing.id_ingrediente);
              return (
                <button 
                  key={ing.id_ingrediente} 
                  onClick={() => handleToggle(ing.id_ingrediente)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group ${
                    isSelected 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' 
                    : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    {isSelected ? '✓' : '🌿'}
                  </div>
                  <div className="flex-grow">
                    <p className={`text-sm font-black transition-colors ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'dark:text-white'}`}>
                      {ing.nombre_ingrediente}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{ing.unidad_medida} • Stock: {ing.stock_actual}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 pt-4 border-t dark:border-gray-700">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="flex-grow py-4 text-gray-400 hover:text-red-500 font-black uppercase text-xs tracking-widest transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="flex-[2] bg-emerald-600 text-white font-black py-4 rounded-[1.5rem] shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-95 transform hover:-translate-y-1"
            >
              ACTUALIZAR RECETA
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecipeManagementSection;