import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dishRoutes from './routes/dishRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import ingredientRoutes from './routes/ingredientRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import roleRoutes from './routes/roleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/platillos', dishRoutes);
app.use('/api/restaurantes', restaurantRoutes);
app.use('/api/mesas', tableRoutes);
app.use('/api/ordenes', orderRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/proveedores', providerRoutes);
app.use('/api/ingredientes', ingredientRoutes);
app.use('/api/pagos', paymentRoutes);
app.use('/api/clientes', clientRoutes);
app.use('/api/roles', roleRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor refactorizado corriendo en el puerto ${PORT}`);
});
