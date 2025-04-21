import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, AppError } from './common/middleware/errorHandler';
import { indexRoutes } from './common/routes';
import { organizationRoutes } from './domains/organizations/routes/organizationRoutes';
import { organizationMeRoutes } from './domains/organizations/routes/organizationMeRoutes';
import { authRoutes } from './domains/auth/routes/authRoutes';

// Initialize express app
const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Behavioral Coach API',
      version: '1.0.0',
      description: 'API for behavioral coaching application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/domains/*/routes/*.ts',
    './src/domains/*/controllers/*.ts'
  ], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/organizations/me', organizationMeRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    status: 'fail',
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use(errorHandler);

export default app; 