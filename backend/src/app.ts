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
import { userRoutes } from './domains/user/routes/userRoutes';
import roleRoutes from './domains/roles/routes/roleRoutes';
import { workerRoutes, workerCsvRoutes } from './domains/workers/routes';
import { ENV } from './config/env';

// Initialize express app
const app: Express = express();

// CORS configuration using environment variables
const corsOptions = {
  origin: ENV.CORS.ORIGINS,
  credentials: ENV.CORS.CREDENTIALS,
  methods: ENV.CORS.METHODS,
  allowedHeaders: ENV.CORS.ALLOWED_HEADERS,
  exposedHeaders: ENV.CORS.EXPOSED_HEADERS,
  maxAge: ENV.CORS.MAX_AGE,
  preflightContinue: ENV.CORS.PREFLIGHT_CONTINUE
};

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
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


// #region Remove this section when we have a production environment

// Custom Swagger UI options with authentication pre-filled for development
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true
  },
  initOAuth: {
    // Pre-fill the auth token for development environment
    useBasicAuthenticationWithAccessCodeGrant: false
  }
};

// In development, customize Swagger UI to include the auth token
if (process.env.NODE_ENV !== 'production') {
  (swaggerUiOptions.swaggerOptions as any) = {
    ...swaggerUiOptions.swaggerOptions,
    // Pre-populated auth token for development
    authAction: {
      bearerAuth: {
        name: "bearerAuth",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: ""
        },
        value: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg3ZjRhM2JhLTkzNDItNGFiYy1hYmEyLWJmNDViNTNhMGI5YyIsImlhdCI6MTc0NTIzMzg2OH0.-O0lNiJPYlP85ygvxoTiw2W1v3rLUZPQMlTn0rJ-DdM"
      }
    }
  };
}

// #endregion

// Routes
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/organizations/me', organizationMeRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/workers/csv', workerCsvRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

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