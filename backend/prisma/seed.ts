import { PrismaClient } from '../generated/prisma';
import { hash } from 'bcryptjs';
import { 
  ALL_PERMISSIONS, 
  PERMISSIONS, 
  ROLE_PERMISSIONS 
} from '../src/config/permissions';

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

    // Create a platform admin organization for system-level administration
    const platformOrg = await prisma.organization.create({
      data: {
        name: 'System Administrators',
        type: 'client', // Admin organization is technically a client type
        subscriptionTier: 'enterprise',
        logoUrl: 'https://via.placeholder.com/150',
        settings: {
          enableNotifications: true,
          theme: 'dark',
          isPlatformAdmin: true
        }
      }
    });

    console.log('Created platform admin organization');

    // Create roles first since users need to reference them
    // Admin role - all permissions for their organization
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        displayName: 'Administrator',
        permissions: ROLE_PERMISSIONS.ORG_ADMIN,
        organizationId: clientOrg.id
      }
    });

    // Standard user role - limited permissions
    const userRole = await prisma.role.create({
      data: {
        name: 'user',
        displayName: 'Standard User',
        permissions: [PERMISSIONS.ORGANIZATION.VIEW, PERMISSIONS.PROGRAM.VIEW, PERMISSIONS.JOURNEY.VIEW],
        organizationId: clientOrg.id,
        isDefault: true // Set as default role for new users
      }
    });

    // Content specialist role (previously consultant)
    const contentSpecialistRole = await prisma.role.create({
      data: {
        name: 'content_specialist',
        displayName: 'Content Specialist',
        permissions: ROLE_PERMISSIONS.EXPERT.CONTENT_SPECIALIST,
        organizationId: expertOrg.id
      }
    });

    // Platform admin role with all permissions across all organizations
    const platformAdminRole = await prisma.role.create({
      data: {
        name: 'platform_admin',
        displayName: 'Platform Administrator',
        permissions: ALL_PERMISSIONS,
        organizationId: platformOrg.id
      }
    });

    console.log('Created roles including platform admin role');

    // Create users
    const adminPassword = await hash('admin123', 10);
    const userPassword = await hash('user123', 10);
    const platformAdminPassword = await hash('superadmin', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: adminPassword,
        roleId: adminRole.id,
        organizationId: clientOrg.id
      }
    });

    const regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        password: userPassword,
        roleId: userRole.id,
        organizationId: clientOrg.id
      }
    });

    const expertUser = await prisma.user.create({
      data: {
        email: 'expert@consulting.com',
        name: 'Expert User',
        password: userPassword,
        roleId: contentSpecialistRole.id,
        organizationId: expertOrg.id
      }
    });

    // Create a platform admin user with all permissions
    const platformAdminUser = await prisma.user.create({
      data: {
        email: 'superadmin@behaviorcoach.com',
        name: 'Platform Administrator',
        password: platformAdminPassword,
        roleId: platformAdminRole.id,
        organizationId: platformOrg.id
      }
    });

    console.log('Created users including platform admin');

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
    
    console.log('=============================');
    console.log('PLATFORM ADMIN CREDENTIALS:');
    console.log('Email: superadmin@behaviorcoach.com');
    console.log('Password: superadmin');
    console.log('=============================');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed directly
if (typeof require !== 'undefined' && require.main === module) {
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