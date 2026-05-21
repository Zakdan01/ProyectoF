import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API del Restaurante',
      version: '1.0.0',
      description: 'Documentación de los endpoints de la API del Restaurante',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Asegúrate de que apunte a tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
