import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  // CORS Configuration
  CORS: {
    // Default origins for development, can be overridden by environment variables
    ORIGINS: process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) :
      ['http://localhost:3001', 'http://localhost:3000'],
    // Additional CORS settings
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
    EXPOSED_HEADERS: ['Content-Length', 'X-Total-Count'],
    CREDENTIALS: true,
    MAX_AGE: 86400, // 24 hours in seconds
    PREFLIGHT_CONTINUE: false
  }
}; 