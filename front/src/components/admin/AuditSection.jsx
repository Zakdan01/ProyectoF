import API_URL from '../../config/api.js';
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';

const AuditSection = () => {
  const [table, setTable] = useState('usuarios');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    fetch(`${API_URL}/audit/${table}`)
      .then(res => res.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLogs([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, [table]);

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'INSERT': return '➕';
      case 'UPDATE': return '📝';
      case 'DELETE': return '🗑️';
      default: return '📋';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'INSERT': return 'bg-green-100 text-green-700 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAffectedId = (log) => {
    return log.id_usuario || log.id_restaurante || log.id_platillo || 'N/A';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h3 className="text-2xl font-bold dark:text-white">Auditoría de Sistema</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Registro histórico de cambios en la base de datos</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase">Filtrar Tabla:</label>
          <select 
            className="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 p-2 rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20"
            value={table}
            onChange={(e) => setTable(e.target.value)}
          >
            <option value="usuarios">Usuarios</option>
            <option value="platillos">Platillos</option>
            <option value="restaurantes">Restaurantes</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center dark:text-white">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
          <p className="font-medium">Cargando historial de cambios...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 font-bold dark:text-white text-xs uppercase tracking-wider text-gray-500">Evento</th>
                  <th className="px-6 py-4 font-bold dark:text-white text-xs uppercase tracking-wider text-gray-500">ID Afectado</th>
                  <th className="px-6 py-4 font-bold dark:text-white text-xs uppercase tracking-wider text-gray-500">Fecha y Hora</th>
                  <th className="px-6 py-4 font-bold dark:text-white text-xs uppercase tracking-wider text-gray-500 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {logs.length > 0 ? logs.map(log => (
                  <tr key={log.id_log} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getEventIcon(log.tipo_evento)}</span>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${getEventColor(log.tipo_evento)}`}>
                          {log.tipo_evento}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded font-mono text-xs font-bold">
                        #{getAffectedId(log)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium dark:text-gray-200">
                        {new Date(log.fecha_evento).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {new Date(log.fecha_evento).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleViewDetails(log)}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-gray-500 italic">No se han registrado cambios aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`Detalle de Auditoría #${selectedLog?.id_log}`}
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getEventIcon(selectedLog.tipo_evento)}</span>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Operación</p>
                  <p className="font-black text-lg dark:text-white">{selectedLog.tipo_evento}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase">ID del Registro</p>
                <p className="font-black text-lg dark:text-white">#{getAffectedId(selectedLog)}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-red-500 uppercase tracking-widest">Datos Anteriores (OLD)</label>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl overflow-hidden shadow-inner">
                  {selectedLog.datos_anteriores ? (
                    <pre className="text-[11px] font-mono text-red-800 dark:text-red-400 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.datos_anteriores, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-red-400 italic">No hay datos previos (Nuevo registro)</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-green-500 uppercase tracking-widest">Datos Nuevos (NEW)</label>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 p-4 rounded-2xl overflow-hidden shadow-inner">
                  {selectedLog.datos_nuevos ? (
                    <pre className="text-[11px] font-mono text-green-800 dark:text-green-400 overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.datos_nuevos, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm text-green-400 italic">No hay datos nuevos (Registro eliminado)</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Fecha del Evento</p>
              <p className="text-sm dark:text-gray-300">{new Date(selectedLog.fecha_evento).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditSection;
