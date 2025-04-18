import { PrismaClient } from './generated/prisma';

// Create a singleton instance of PrismaClient to be used throughout the application
// This prevents multiple connection pools and improves performance
const prisma = new PrismaClient();

export default prisma; 