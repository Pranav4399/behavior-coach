import { PrismaClient } from '../generated/prisma';
import { execSync } from 'child_process';
import seedDatabase from './seed';

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
        // Ensure db push completes fully before proceeding
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('Database tables created successfully');
        
        // Reconnect with a new client to ensure fresh state
        await prisma.$disconnect();
        const freshClient = new PrismaClient();
        await freshClient.$connect();
        
        // Verify tables exist before seeding
        const tablesExist = await freshClient.$queryRaw<[{ exists: boolean }]>`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'organizations'
          ) as "exists"`;
        
        if (!tablesExist[0].exists) {
          throw new Error('Tables were not created successfully');
        }
        
        // Seed the database with initial data
        console.log('Seeding database with initial data...');
        try {
          // Run seed as a separate process to ensure clean environment
          execSync('npm run db:seed', { stdio: 'inherit' });
          console.log('Database seeded successfully');
        } catch (seedError) {
          console.error('Error seeding database:', seedError);
          throw seedError;
        } finally {
          await freshClient.$disconnect();
        }
      } catch (pushError) {
        console.error('Failed to create or seed database:', pushError);
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