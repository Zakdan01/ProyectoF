/**
 * CONFIGURACIÓN GLOBAL DE LA API PARA EL FRONTEND
 * =========================================================================
 * 
 * Si al mover este proyecto a otra PC el Frontend no puede conectar con el Backend,
 * prueba cambiando 'localhost' por '127.0.0.1' (o viceversa).
 * 
 * localhost: Intenta usar el nombre del sistema (a veces usa IPv6).
 * 127.0.0.1: Es la dirección numérica directa (fuerza IPv4).
 */

const API_URL = 'http://localhost:5000/api';

// Ejemplo si localhost falla:
// const API_URL = 'http://127.0.0.1:5000/api';

export default API_URL;
