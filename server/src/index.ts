import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import loanRoutes from './routes/loans';
import userRoutes from './routes/users';
import profileRoutes from './routes/profile';
import automationRoutes from './routes/automation';
import clientRoutes from './routes/clients';
import { WhatsAppService } from './services/whatsappService';
import { ReminderJob } from './services/reminderJob';

dotenv.config();

const app = express();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (for uploaded images)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Test database connection
async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database successfully');
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/clients', clientRoutes);

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Return 200 but with status error to keep container alive for debugging
    res.status(200).json({ status: 'error', database: 'disconnected', error: errorMessage });
  }
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

async function startServer() {
  await connectToDatabase();
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Initialize automation services
    await WhatsAppService.init();
    ReminderJob.init();
  });
}

startServer().catch(console.error);

export { prisma };
