import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../index';

const router = express.Router();

// Get all clients
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clientes', error });
    }
});

// Create a new client
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const { name, email, phone, address, idNumber, idType, occupation, income } = req.body;

        // Check if client already exists
        const existingClient = await prisma.client.findUnique({
            where: { idNumber }
        });

        if (existingClient) {
            return res.json(existingClient);
        }

        const client = await prisma.client.create({
            data: {
                id: `CL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                name,
                email,
                phone,
                address,
                idNumber,
                idType: idType || 'CC',
                occupation,
                income: income ? parseFloat(income) : null,
            }
        });

        res.status(201).json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Error al crear el cliente', error });
    }
});

// Get total balance for a specific client
router.get('/balance/:clientId', authenticateToken, async (req: any, res) => {
    try {
        const { clientId } = req.params;

        const loans = await prisma.loan.findMany({
            where: {
                clientId,
                userId: req.user.userId
            },
            include: {
                Payment: true
            }
        });

        let totalBalance = 0;
        for (const loan of loans) {
            const totalPaid = loan.Payment.reduce((sum: number, payment: any) => sum + payment.amount, 0);
            const balance = loan.amount - totalPaid;
            totalBalance += balance;
        }

        res.json({ totalBalance });
    } catch (error) {
        console.error('Error calculating client balance:', error);
        res.status(500).json({ message: 'Error al calcular el balance del cliente', error });
    }
});

export default router;
