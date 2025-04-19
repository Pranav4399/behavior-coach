// Create a singleton instance of PrismaClient to be used throughout the application

const { PrismaClient } = require("../generated/prisma");


// This prevents multiple connection pools and improves performance
const prisma = new PrismaClient();

export type { PrismaClient };
export default prisma; 