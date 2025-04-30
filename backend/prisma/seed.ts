import { PrismaClient } from '../generated/prisma';
import { hash } from 'bcryptjs';
import { 
  ALL_PERMISSIONS, 
  IS_PLATFORM_ADMIN, 
  PERMISSIONS
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
        description: 'A client organization example for demonstration purposes',
        website: 'https://example-client.com',
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
        description: 'Professional consulting firm specializing in behavioral coaching',
        website: 'https://consulting-experts.com',
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
        description: 'Platform administration team with system-wide access',
        website: 'https://behaviorcoach.com/admin',
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
        permissions: ALL_PERMISSIONS,
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
        permissions: [
          PERMISSIONS.CONTENT.VIEW,
          PERMISSIONS.CONTENT.CREATE,
          PERMISSIONS.CONTENT.EDIT,
          PERMISSIONS.CONTENT.DELETE,
        ],
        organizationId: expertOrg.id
      }
    });

    // Platform admin role with all permissions across all organizations
    const platformAdminRole = await prisma.role.create({
      data: {
        name: 'platform_admin',
        displayName: 'Platform Administrator',
        permissions: [...ALL_PERMISSIONS, IS_PLATFORM_ADMIN],
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
        organizationId: clientOrg.id,
        roleId: adminRole.id
      }
    });

    const regularUser = await prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Regular User',
        password: userPassword,
        organizationId: clientOrg.id,
        roleId: userRole.id
      }
    });

    const expertUser = await prisma.user.create({
      data: {
        email: 'expert@consulting.com',
        name: 'Expert User',
        password: userPassword,
        organizationId: expertOrg.id,
        roleId: contentSpecialistRole.id
      }
    });

    // Create a platform admin user with all permissions
    const platformAdminUser = await prisma.user.create({
      data: {
        email: 'superadmin@behaviorcoach.com',
        name: 'Platform Administrator',
        password: platformAdminPassword,
        organizationId: platformOrg.id,
        roleId: platformAdminRole.id
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

    //#region WORKER_SEED_DATA
    // Seed worker data
    console.log('Creating workers...');
    
    // Create workers for client organization
    const workers = await Promise.all([
      // Worker 1 - Full profile with all related data
      prisma.worker.create({
        data: {
          firstName: 'John',
          lastName: 'Smith',
          dateOfBirth: new Date('1985-03-15'),
          gender: 'male',
          tags: ['sales', 'high_performer'],
          organizationId: clientOrg.id,
          customFields: {
            favoriteColor: 'blue',
            personality: 'ENFJ',
            emergencyContact: 'Jane Smith (555-123-4567)'
          },
          isActive: true,
          contact: {
            create: {
              primaryPhoneNumber: '+15551234567',
              whatsappOptInStatus: 'opted_in',
              preferredLanguage: 'en',
              communicationConsent: true,
              emailAddress: 'john.smith@example.com',
              locationCity: 'Chicago',
              locationStateProvince: 'IL',
              locationCountry: 'USA'
            }
          },
          employment: {
            create: {
              jobTitle: 'Sales Manager',
              department: 'Sales',
              team: 'Enterprise',
              hireDate: new Date('2018-05-10'),
              employmentStatus: 'active',
              employmentType: 'full_time'
            }
          },
          engagement: {
            create: {
              lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
              lastInteractionDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday
            }
          },
          wellbeing: {
            create: {
              lastWellbeingAssessmentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
              overallWellbeingScore: 85
            }
          },
          gamification: {
            create: {
              pointsBalance: 1250,
              badgesEarnedCount: 8
            }
          }
        }
      }),
      
      // Worker 2 - With supervisor relationship (points to worker 1)
      prisma.worker.create({
        data: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          dateOfBirth: new Date('1990-07-22'),
          gender: 'female',
          tags: ['marketing', 'new_hire'],
          organizationId: clientOrg.id,
          isActive: true,
          contact: {
            create: {
              primaryPhoneNumber: '+15559876543',
              whatsappOptInStatus: 'opted_in',
              preferredLanguage: 'en',
              communicationConsent: true,
              emailAddress: 'sarah.j@example.com',
              locationCity: 'Chicago',
              locationStateProvince: 'IL',
              locationCountry: 'USA'
            }
          },
          employment: {
            create: {
              jobTitle: 'Marketing Specialist',
              department: 'Marketing',
              team: 'Digital',
              hireDate: new Date('2022-01-15'),
              employmentStatus: 'active',
              employmentType: 'full_time'
            }
          },
          engagement: {
            create: {
              lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
              lastInteractionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
            }
          },
          wellbeing: {
            create: {
              lastWellbeingAssessmentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              overallWellbeingScore: 78
            }
          },
          gamification: {
            create: {
              pointsBalance: 475,
              badgesEarnedCount: 3
            }
          }
        }
      }),
      
      // Worker 3 - Part-time worker
      prisma.worker.create({
        data: {
          firstName: 'Miguel',
          lastName: 'Garcia',
          gender: 'male',
          tags: ['customer_service', 'bilingual'],
          organizationId: clientOrg.id,
          isActive: true,
          contact: {
            create: {
              primaryPhoneNumber: '+15556789012',
              whatsappOptInStatus: 'opted_in',
              preferredLanguage: 'es',
              communicationConsent: true,
              emailAddress: 'miguel.g@example.com',
              locationCity: 'Miami',
              locationStateProvince: 'FL',
              locationCountry: 'USA'
            }
          },
          employment: {
            create: {
              jobTitle: 'Customer Service Representative',
              department: 'Support',
              team: 'Phone Support',
              hireDate: new Date('2021-06-15'),
              employmentStatus: 'active',
              employmentType: 'part_time'
            }
          },
          engagement: {
            create: {
              lastActiveAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              lastInteractionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
          }
        }
      }),
      
      // Worker 4 - Inactive worker
      prisma.worker.create({
        data: {
          firstName: 'Lisa',
          lastName: 'Wong',
          gender: 'female',
          tags: ['engineering', 'remote'],
          organizationId: clientOrg.id,
          isActive: false,
          deactivationReason: 'voluntary_resignation',
          contact: {
            create: {
              primaryPhoneNumber: '+15553456789',
              whatsappOptInStatus: 'opted_out',
              preferredLanguage: 'en',
              communicationConsent: false,
              emailAddress: 'lisa.w@example.com',
              locationCity: 'Seattle',
              locationStateProvince: 'WA',
              locationCountry: 'USA'
            }
          },
          employment: {
            create: {
              jobTitle: 'Software Engineer',
              department: 'Engineering',
              team: 'Backend',
              hireDate: new Date('2019-08-01'),
              employmentStatus: 'inactive',
              employmentType: 'full_time'
            }
          }
        }
      }),
      
      // Worker 5 - Contractor
      prisma.worker.create({
        data: {
          firstName: 'David',
          lastName: 'Chen',
          gender: 'male',
          tags: ['design', 'remote', 'contractor'],
          organizationId: clientOrg.id,
          isActive: true,
          contact: {
            create: {
              primaryPhoneNumber: '+15558901234',
              whatsappOptInStatus: 'pending',
              preferredLanguage: 'en',
              communicationConsent: true,
              emailAddress: 'david.c@example.com',
              locationCity: 'Portland',
              locationStateProvince: 'OR',
              locationCountry: 'USA'
            }
          },
          employment: {
            create: {
              jobTitle: 'UX Designer',
              department: 'Design',
              team: 'Product',
              hireDate: new Date('2022-03-01'),
              employmentStatus: 'active',
              employmentType: 'contractor'
            }
          }
        }
      })
    ]);
    
    // Update supervisor relationship for worker 2 (Sarah Johnson)
    // Adding this after creation to avoid circular references
    await prisma.worker.update({
      where: { id: workers[1].id },
      data: { supervisorId: workers[0].id }
    });
    
    console.log(`Created ${workers.length} workers successfully`);
    //#endregion WORKER_SEED_DATA

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