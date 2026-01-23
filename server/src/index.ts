import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import loanRoutes from './routes/loans';
import clientRoutes from './routes/clients';
import paymentRoutes from './routes/payments';
import dashboardRoutes from './routes/dashboard';
import receiptRoutes from './routes/receipts';
import whatsappRoutes from './routes/whatsapp';
import automationRoutes from './routes/automation';
import { WhatsAppService } from './services/whatsappService';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/automation', automationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// --- SERVIR FRONTEND JUNTOS ---
// En producción, servimos los archivos estáticos de la carpeta 'dist'
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));

// Cualquier ruta que no sea de la API, devuelve el index.html (para React Router)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Initialize services
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Initialize WhatsApp asynchronously
    WhatsAppService.init().catch(err => console.error('Error initializing WhatsApp:', err));

  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

startServer();
