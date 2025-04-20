import { PrismaClient } from '../generated/prisma';
import { execSync } from 'child_process';

/**
 * Initialize database tables if they don't exist
 * Only runs in development environment
 */
export async function initializeDatabase() {
  // Only run in development environment
  if (process.env.NODE_ENV !== 'development') {
    console.log('Database initialization skipped: Not in development environment');
    return;
  }

  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database connection and initializing tables if needed...');
    
    // A simple approach: try to connect and check a few known model names that should exist
    try {
      // Test connection to database
      await prisma.$connect();
      
      // Check if the 'organizations' table exists (or any table from our schema)
      // This query is database-agnostic and works across PostgreSQL, MySQL, etc.
      const result = await prisma.$queryRaw<[{ exists: boolean }]>`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'organizations'
        ) as "exists"`;
      
      if (result[0].exists) {
        console.log('Database tables already exist. Skipping initialization.');
      } else {
        throw new Error('Schema tables not found');
      }
    } catch (error) {
      console.log('Database needs initialization. Creating tables from schema...');
      
      // Use db push as the single, reliable method for development
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('Database tables created successfully');
      } catch (pushError) {
        console.error('Failed to create database tables:', pushError);
        throw new Error('Could not initialize database schema');
      }
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error; // Rethrow to ensure server doesn't start with uninitialized DB
  } finally {
    await prisma.$disconnect();
  }
} 