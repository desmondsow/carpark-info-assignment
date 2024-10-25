import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import carparkRoutes from './routes/carparks.js';
import authRoutes from './routes/auth.js';
import { loadCarparkData } from './services/csvLoader.js';
import { initDatabase } from './models/index.js';

const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Carpark API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Set up Swagger documentation UI endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
// Authentication routes for user registration and login
app.use('/api/auth', authRoutes);

// Carpark routes for retrieving and managing carpark data
app.use('/api/carparks', carparkRoutes);

// Initialize database and load data
async function startServer() {
  try {
    await initDatabase();
    await loadCarparkData('./hdb-carpark-information-20220824010400.csv');
    console.log('Carpark data loaded successfully');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
