# 🗺️ Mapa Maestro del Proyecto - Restaurante Gourmet

Este documento describe la arquitectura técnica y el flujo de datos del sistema, desde la interfaz de usuario hasta la base de datos.

## 🏗️ Arquitectura General
- **Frontend:** React + Tailwind CSS (Vite)
- **Backend:** Node.js + Express
- **Base de Datos:** PostgreSQL
- **Comunicación:** API RESTful (JSON)

---

## 📋 Flujo de Operaciones (Mapeo de Rutas)

| Módulo (Frontend) | Endpoint API (`/api/`) | Controlador Backend | Tabla Principal (DB) | Color Toast |
| :--- | :--- | :--- | :--- | :--- |
| **Roles** | `/roles` | `roleController.js` | `restaurante.Rol` | Verde (C) / Rojo (E) |
| **Usuarios** | `/usuarios` | `userController.js` | `restaurante.Usuario` | Verde / Azul (U) / Rojo |
| **Sucursales** | `/restaurantes` | `restaurantController.js` | `restaurante.Restaurante` | Verde / Azul / Rojo |
| **Mesas** | `/mesas` | `tableController.js` | `restaurante.Mesa` | Verde / Azul / Rojo |
| **Platillos** | `/platillos` | `dishController.js` | `restaurante.Platillo` | Verde / Azul / Rojo |
| **Recetas** | `/recetas` | `recipeController.js` | `restaurante.Receta` | Azul |
| **Clientes** | `/clientes` | `clientController.js` | `restaurante.Cliente` | Verde / Azul / Rojo |
| **Órdenes (Cajero)** | `/ordenes` | `orderController.js` | `restaurante.Orden` | Verde / Azul |
| **Cocina (Panel)** | `/ordenes/preparacion`| `orderController.js` | `restaurante.Orden` | Azul (Listo) |
| **Meseros (Panel)** | `/ordenes/listas` | `orderController.js` | `restaurante.Orden` | Azul (Entregado) |
| **Pagos** | `/pagos` | `paymentController.js` | `restaurante.Pago` | Verde |
| **Inventario** | `/ingredientes` | `ingredientController.js`| `restaurante.Ingrediente`| Verde / Azul / Rojo |
| **Proveedores** | `/proveedores` | `providerController.js` | `restaurante.Proveedor` | Verde / Azul / Rojo |
| **Suministros** | `/suministros` | `supplyController.js` | `restaurante.Suministro` | Azul |
| **Auditoría** | `/auditoria` | `auditController.js` | `restaurante.Auditoria` | - |
| **Estadísticas** | `/stats` | `statsController.js` | (Múltiples) | - |

---

## 🎨 Personalizaciones Recientes

### 1. Sistema de Notificaciones (`ToastContext.jsx`)
- **Éxito (Verde):** Creaciones y registros nuevos.
- **Update (Azul):** Ediciones, cambios de estado y flujo de órdenes.
- **Error (Rojo):** Eliminaciones y fallos de sistema.

### 2. Interfaz y Estética
- **Scrollbars:** Diseño personalizado en `index.css` (naranja, delgado y redondeado).
- **Modo Oscuro:** Activado mediante estrategia de selector en Tailwind v4 (`darkMode: 'selector'`).
- **Layout:** Centrado del Dashboard alineado con el ancho de la Navbar (`max-w-7xl`).

### 3. Seguridad Operativa
- **Confirmación en Cocina:** Modal que muestra Platillos + Cliente + #Orden antes de finalizar.
- **Confirmación en Meseros:** Modal detallado antes de marcar como "Entregado".

---

## 📂 Archivos de Configuración Críticos
- `front/src/context/AppContext.jsx`: Estado global (Dark Mode, Auth).
- `front/src/context/ToastContext.jsx`: Lógica de mensajes animados.
- `Back/src/config/db.js`: Conexión a PostgreSQL.
- `Back/src/index.js`: Registro de todas las rutas de la API.
- `Scripts/Script_triggers.txt`: Lógica automática en la base de datos.
