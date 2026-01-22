const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');

    // Drop existing tables if they exist (for clean setup)
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Payment" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Guarantee" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Loan" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Client" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "User" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "CompanySettings" CASCADE`;

    // Create User table
    await prisma.$executeRaw`
      CREATE TABLE "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "address" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "avatar" TEXT,
        "city" TEXT,
        "country" TEXT,
        "dateOfBirth" TIMESTAMP(3),
        "gender" TEXT,
        "occupation" TEXT,
        "company" TEXT,
        "bio" TEXT,
        "notifications" BOOLEAN NOT NULL DEFAULT true,
        "emailUpdates" BOOLEAN NOT NULL DEFAULT true,
        "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false,
        "lastLogin" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `;

    await prisma.$executeRaw`CREATE UNIQUE INDEX "User_email_key" ON "User"("email")`;

    // Create Client table
    await prisma.$executeRaw`
      CREATE TABLE "Client" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT,
        "phone" TEXT NOT NULL,
        "address" TEXT,
        "idNumber" TEXT NOT NULL,
        "idType" TEXT NOT NULL DEFAULT 'CC',
        "occupation" TEXT,
        "income" DOUBLE PRECISION,
        "references" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
      )
    `;

    await prisma.$executeRaw`CREATE UNIQUE INDEX "Client_idNumber_key" ON "Client"("idNumber")`;

    // Create Loan table
    await prisma.$executeRaw`
      CREATE TABLE "Loan" (
        "id" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "interestRate" DOUBLE PRECISION NOT NULL,
        "interestType" TEXT NOT NULL DEFAULT 'TOTAL',
        "frequency" TEXT NOT NULL DEFAULT 'MENSUAL',
        "term" INTEGER NOT NULL,
        "paymentDay" INTEGER,
        "paymentWeekday" TEXT,
        "monthlyPayment" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "purpose" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "approvedAt" TIMESTAMP(3),
        "startDate" TIMESTAMP(3),
        "endDate" TIMESTAMP(3),
        "userId" TEXT,
        "clientId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create Payment table
    await prisma.$executeRaw`
      CREATE TABLE "Payment" (
        "id" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "dueDate" TIMESTAMP(3) NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PAID',
        "paymentType" TEXT NOT NULL DEFAULT 'MONTHLY',
        "notes" TEXT,
        "loanId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create CompanySettings table
    await prisma.$executeRaw`
      CREATE TABLE "CompanySettings" (
        "id" TEXT NOT NULL DEFAULT 'company',
        "name" TEXT NOT NULL DEFAULT 'RapiCrédito',
        "description" TEXT NOT NULL DEFAULT 'Soluciones financieras rápidas y confiables',
        "address" TEXT,
        "phone" TEXT,
        "email" TEXT,
        "website" TEXT,
        "logo" TEXT,
        "defaultInterestRate" DOUBLE PRECISION NOT NULL DEFAULT 15.0,
        "minAmount" DOUBLE PRECISION NOT NULL DEFAULT 100000,
        "maxAmount" DOUBLE PRECISION NOT NULL DEFAULT 5000000,
        "defaultTerm" INTEGER NOT NULL DEFAULT 12,
        "maxTerm" INTEGER NOT NULL DEFAULT 36,
        "requireGuarantee" BOOLEAN NOT NULL DEFAULT false,
        "autoApproval" BOOLEAN NOT NULL DEFAULT false,
        "autoApprovalLimit" DOUBLE PRECISION NOT NULL DEFAULT 1000000,
        "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
        "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
        "paymentReminders" BOOLEAN NOT NULL DEFAULT true,
        "overdueAlerts" BOOLEAN NOT NULL DEFAULT true,
        "newLoanAlerts" BOOLEAN NOT NULL DEFAULT true,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CompanySettings_pkey" PRIMARY KEY ("id")
      )
    `;

    // Add foreign key constraints
    await prisma.$executeRaw`
      ALTER TABLE "Loan" 
      ADD CONSTRAINT "Loan_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
    `;

    await prisma.$executeRaw`
      ALTER TABLE "Loan" 
      ADD CONSTRAINT "Loan_clientId_fkey" 
      FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    `;

    await prisma.$executeRaw`
      ALTER TABLE "Payment" 
      ADD CONSTRAINT "Payment_loanId_fkey" 
      FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    `;

    console.log('✅ Database initialized successfully');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
