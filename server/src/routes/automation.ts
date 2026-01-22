import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { WhatsAppService } from '../services/whatsappService';
import { AIService } from '../services/aiService';
import { ReminderJob } from '../services/reminderJob';
import { prisma } from '../index';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

const router = express.Router();

/**
 * @route GET /api/automation/wa-status
 */
router.get('/wa-status', authenticateToken, async (req: any, res) => {
    const status = WhatsAppService.getStatus();
    res.json(status);
});

/**
 * @route GET /api/automation/wa-qr
 */
router.get('/wa-qr', authenticateToken, async (req: any, res) => {
    try {
        const qrPath = path.join(process.cwd(), 'last_qr.txt');
        if (fs.existsSync(qrPath)) {
            const qrChar = fs.readFileSync(qrPath, 'utf8');
            res.json({ qr: qrChar });
        } else {
            res.status(404).json({ message: 'QR no disponible o ya conectado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo QR' });
    }
});

/**
 * @route GET /api/automation/wa-qr-image
 */
router.get('/wa-qr-image', authenticateToken, async (req: any, res) => {
    try {
        const qrPath = path.join(process.cwd(), 'last_qr.txt');
        if (fs.existsSync(qrPath)) {
            const qrChar = fs.readFileSync(qrPath, 'utf8');
            const qrImage = await QRCode.toDataURL(qrChar);
            res.json({ qrImage });
        } else {
            res.status(404).json({ message: 'QR no disponible' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error generando imagen QR' });
    }
});

/**
 * @route POST /api/automation/test-wa
 * @desc Envía un mensaje de prueba por WhatsApp
 */
router.post('/test-wa', authenticateToken, async (req: any, res) => {
    try {
        const { phone, message } = req.body;
        if (!phone || !message) {
            return res.status(400).json({ message: 'Falta teléfono o mensaje' });
        }

        await WhatsAppService.sendMessage(phone, message);
        res.json({ success: true, message: 'Mensaje de prueba encolado' });
    } catch (error) {
        res.status(500).json({ message: 'Error en la automatización', error });
    }
});

/**
 * @route POST /api/automation/ai-reminder
 * @desc Genera un recordatorio con IA para un cliente específico
 */
router.post('/ai-reminder', authenticateToken, async (req: any, res) => {
    try {
        const { clientId, loanId } = req.body;

        const client = await prisma.client.findUnique({ where: { id: clientId } });
        const loan = await prisma.loan.findUnique({
            where: { id: loanId },
            include: { user: true }
        });

        if (!client || !loan) {
            return res.status(404).json({ message: 'Cliente o préstamo no encontrado' });
        }

        const aiMessage = await AIService.generateReminderText(
            client.name,
            loan.amount,
            new Date().toLocaleDateString(),
            loan.user?.name || 'Rapi-Credi'
        );

        res.json({ success: true, aiMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error generando recordatorio con IA', error });
    }
});

/**
 * @route POST /api/automation/trigger-reminders
 * @desc Ejecuta manualmente el proceso de recordatorios (Cron Job)
 */
router.post('/trigger-reminders', authenticateToken, async (req: any, res) => {
    try {
        const overdueCount = await ReminderJob.markOverduePayments();
        const result = await ReminderJob.processReminders();
        res.json({
            success: true,
            message: 'Proceso de recordatorios y actualización de mora ejecutado manualmente',
            overdueUpdated: overdueCount,
            remindersResult: result
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        res.status(500).json({ message: 'Error ejecutando recordatorios', error: errorMessage });
    }
});

export default router;
