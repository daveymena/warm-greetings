const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Run migrations
    console.log('🔄 Running database migrations...');
    
    // Drop existing tables if they exist (for clean setup)
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Payment" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "Loan" CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS "User" CASCADE`;
    
    // Create User table with all profile fields
    await prisma.$executeRaw`
      CREATE TABLE "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "avatar" TEXT,
        "phone" TEXT,
        "address" TEXT,
        "city" TEXT,
        "country" TEXT DEFAULT 'Colombia',
        "dateOfBirth" TIMESTAMP(3),
        "gender" TEXT,
        "occupation" TEXT,
        "company" TEXT,
        "bio" TEXT,
        "notifications" BOOLEAN NOT NULL DEFAULT true,
        "emailUpdates" BOOLEAN NOT NULL DEFAULT true,
        "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "lastLogin" TIMESTAMP(3),
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `;
    
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX "User_email_key" ON "User"("email")
    `;
    
    // Create Loan table with additional fields
    await prisma.$executeRaw`
      CREATE TABLE "Loan" (
        "id" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "interestRate" DOUBLE PRECISION NOT NULL,
        "term" INTEGER NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "purpose" TEXT,
        "monthlyIncome" DOUBLE PRECISION,
        "employmentType" TEXT,
        "notes" TEXT,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
      )
    `;
    
    // Create Payment table with additional fields
    await prisma.$executeRaw`
      CREATE TABLE "Payment" (
        "id" TEXT NOT NULL,
        "amount" DOUBLE PRECISION NOT NULL,
        "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'PAID',
        "method" TEXT,
        "reference" TEXT,
        "notes" TEXT,
        "loanId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
      )
    `;
    
    // Add foreign key constraints
    await prisma.$executeRaw`
      ALTER TABLE "Loan" 
      ADD CONSTRAINT "Loan_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" 
      ADD CONSTRAINT "Payment_loanId_fkey" 
      FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
    `;
    
    console.log('✅ Database initialized successfully');
    console.log('ℹ️ Database is ready for production use');
    console.log('📝 Register your first admin user through the web interface');
    
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