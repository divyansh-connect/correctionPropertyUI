import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DoorLoop ERP Database Seeding...');

  try {
    // 1. Create Roles
    const adminRole = await prisma.role.upsert({
      where: { name: 'Super Admin' },
      update: {},
      create: {
        name: 'Super Admin',
        description: 'Master account with full administrative permissions.',
        isCustom: false,
      },
    });

    const ownerRole = await prisma.role.upsert({
      where: { name: 'Owner' },
      update: {},
      create: {
        name: 'Owner',
        description: 'Owner access to financial statements and payouts.',
        isCustom: false,
      },
    });

    const tenantRole = await prisma.role.upsert({
      where: { name: 'Tenant' },
      update: {},
      create: {
        name: 'Tenant',
        description: 'Tenant portal access for rent payments and maintenance.',
        isCustom: false,
      },
    });

    // 2. Create Permissions for Admin Role
    const modules = [
      'Dashboard',
      'Properties',
      'Leasing',
      'Tenants',
      'Owners',
      'Rent & Payments',
      'Accounting',
      'Maintenance',
      'Documents',
      'Reports',
      'Communication',
      'Company Settings',
    ];

    for (const moduleName of modules) {
      await prisma.permission.upsert({
        where: {
          roleId_module: {
            roleId: adminRole.id,
            module: moduleName,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          module: moduleName,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canApprove: true,
          canExport: true,
        },
      });
    }

    // 3. Create Admin User
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@apex.com' },
      update: {},
      create: {
        email: 'admin@apex.com',
        passwordHash: '$2b$12$KIX32Jc56M9s.Xg/7B9Aie1M5F1nBvKjD7zS3L0lYhXzQ/F5G7J1e', // Hashed mock pass
        firstName: 'John',
        lastName: 'Doe',
        phone: '(512) 555-0100',
        roleId: adminRole.id,
        status: 'Active',
      },
    });

    // 4. Create Owners
    const owner1 = await prisma.owner.upsert({
      where: { email: 'bill.a@investments.com' },
      update: {},
      create: {
        firstName: 'William',
        lastName: 'Anderson',
        email: 'bill.a@investments.com',
        phone: '(212) 555-0122',
        payoutMethod: 'ACH/Direct Deposit',
        propertiesOwnedCount: 4,
      },
    });

    // 5. Create Sample Property & Units
    const propNames = [
      'Oakridge Heights',
      'Downtown Plaza',
      'Sunset Villas',
      'Northside Industrial',
      'Summit Townhomes',
    ];

    for (let i = 0; i < propNames.length; i++) {
      const pName = propNames[i];
      const property = await prisma.property.create({
        data: {
          name: pName,
          type: i % 2 === 0 ? 'Apartment' : 'Commercial',
          status: 'Active',
          ownerId: owner1.id,
          ownershipPercentage: 100,
          managementCompany: 'Apex Property Management',
          address: `${100 + i * 12} Main St, Austin, TX 7870${i}`,
          streetAddress: `${100 + i * 12} Main St`,
          city: 'Austin',
          state: 'TX',
          zip: `7870${i}`,
          unitsCount: 20,
          occupiedUnits: 15,
          occupancyRate: 75,
          monthlyRevenue: 22000,
          yearBuilt: 2005 + i,
          totalBuildings: 3,
          squareFootage: 18000,
          purchasePrice: 2000000,
          currentValue: 2400000,
          monthlyExpenses: 4000,
        },
      });

      const building = await prisma.building.create({
        data: {
          propertyId: property.id,
          name: 'Building A',
          floors: 3,
          unitsCount: 20,
          occupancyRate: 75,
        },
      });

      for (let u = 1; u <= 5; u++) {
        await prisma.unit.create({
          data: {
            propertyId: property.id,
            buildingId: building.id,
            unitNumber: `10${u}`,
            floor: 1,
            bedrooms: (u % 3) + 1,
            bathrooms: 1.5,
            squareFootage: 850,
            rentAmount: 1400 + u * 50,
            securityDeposit: 1400,
            availabilityDate: new Date('2026-08-01'),
            status: u <= 4 ? 'Occupied' : 'Vacant',
          },
        });
      }
    }

    // 6. Create Chart of Accounts (CoA)
    const coaData = [
      { accountCode: '1010', accountName: 'Operating Checking Account', type: 'Asset', balance: 150000 },
      { accountCode: '1020', accountName: 'Security Deposit Escrow Account', type: 'Asset', balance: 45000 },
      { accountCode: '2010', accountName: 'Accounts Payable (AP)', type: 'Liability', balance: 12000 },
      { accountCode: '2020', accountName: 'Tenant Security Deposit Liability', type: 'Liability', balance: 45000 },
      { accountCode: '3010', accountName: "Owner's Equity Capital", type: 'Equity', balance: 500000 },
      { accountCode: '4010', accountName: 'Rental Revenue Income', type: 'Revenue', balance: 220000 },
      { accountCode: '5010', accountName: 'Maintenance & Repair Expense', type: 'Expense', balance: 25000 },
    ];

    for (const acc of coaData) {
      await prisma.coAAccount.upsert({
        where: { accountCode: acc.accountCode },
        update: {},
        create: acc,
      });
    }

    console.log('✅ DoorLoop ERP Database Seeding Completed!');
  } catch (error) {
    console.error('❌ Database Seeding Failed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
