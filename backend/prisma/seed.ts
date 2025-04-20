import { PrismaClient } from '../generated/prisma';
import { hash } from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');

    // Verify the database connection and table existence before proceeding
    try {
      await prisma.$queryRaw`SELECT 1 FROM information_schema.tables WHERE table_name = 'organizations'`;
      console.log('Verified organizations table exists');
    } catch (error) {
      console.error('Error verifying tables. Make sure tables are created before seeding:', error);
      throw new Error('Database tables are not ready for seeding');
    }

    // Create organizations
    const clientOrg = await prisma.organization.create({
      data: {
        name: 'Example Client',
        type: 'client',
        subscriptionTier: 'basic',
        logoUrl: 'https://via.placeholder.com/150',
        customTerminology: {
          employees: 'team members',
          manager: 'team lead'
        },
        settings: {
          enableNotifications: true,
          theme: 'light'
        }
      }
    });

    const expertOrg = await prisma.organization.create({
      data: {
        name: 'Consulting Experts',
        type: 'expert',
        subscriptionTier: 'premium',
        logoUrl: 'https://via.placeholder.com/150',
        settings: {
          enableNotifications: true,
          theme: 'dark'
        }
      }
    });

    console.log('Created organizations');

    // Create users
    const adminPassword = await hash('admin123', 10);
    const userPassword = await hash('user123', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
        organizationId: clientOrg.id
      }
    });

    const regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        password: userPassword,
        role: 'user',
        organizationId: clientOrg.id
      }
    });

    const expertUser = await prisma.user.create({
      data: {
        email: 'expert@consulting.com',
        name: 'Expert User',
        password: userPassword,
        role: 'expert',
        organizationId: expertOrg.id
      }
    });

    console.log('Created users');

    // Create roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        displayName: 'Administrator',
        permissions: ['create:all', 'read:all', 'update:all', 'delete:all'],
        organizationId: clientOrg.id
      }
    });

    const userRole = await prisma.role.create({
      data: {
        name: 'user',
        displayName: 'Standard User',
        permissions: ['read:own', 'update:own'],
        organizationId: clientOrg.id
      }
    });

    const expertRole = await prisma.role.create({
      data: {
        name: 'consultant',
        displayName: 'Consultant',
        permissions: ['read:all', 'create:reports', 'update:reports'],
        organizationId: expertOrg.id
      }
    });

    console.log('Created roles');

    // Create integrations
    const slackIntegration = await prisma.integration.create({
      data: {
        type: 'slack',
        config: {
          webhookUrl: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
          channel: '#notifications'
        },
        status: 'active',
        organizationId: clientOrg.id
      }
    });

    const googleIntegration = await prisma.integration.create({
      data: {
        type: 'google',
        config: {
          clientId: 'google-client-id',
          clientSecret: 'google-client-secret'
        },
        status: 'inactive',
        organizationId: expertOrg.id
      }
    });

    console.log('Created integrations');
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Don't auto-execute if imported as a module
if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Error seeding database:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

// Export for direct execution
export default main; 