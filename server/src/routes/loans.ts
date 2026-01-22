import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../index';

const router = express.Router();

// Get all loans for current user
router.get('/', authenticateToken, async (req: any, res) => {
    try {
        const loans = await prisma.loan.findMany({
            where: { userId: req.user.userId },
            include: {
                Payment: true,
                Client: true
            }
        });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching loans', error });
    }
});

// Create a new loan request
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        const {
            amount,
            interestRate,
            interestType,
            frequency,
            term,
            paymentDay,
            paymentWeekday,
            installmentAmount,
            totalAmount,
            clientId,
            purpose
        } = req.body;

        if (!clientId) {
            return res.status(400).json({ message: 'Se requiere un cliente para crear un préstamo' });
        }

        const loan = await prisma.loan.create({
            data: {
                id: `LN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                amount: parseFloat(amount),
                interestRate: parseFloat(interestRate),
                interestType: interestType || 'TOTAL',
                frequency: frequency || 'MENSUAL',
                term: parseInt(term),
                paymentDay: paymentDay ? parseInt(paymentDay) : null,
                paymentWeekday: paymentWeekday || null,
                monthlyPayment: parseFloat(installmentAmount), // Backwards compatible name
                totalAmount: parseFloat(totalAmount),
                purpose: purpose || null,
                status: 'ACTIVE', // Auto-activate for gota a gota demonstration
                userId: req.user.userId,
                clientId: clientId,
                startDate: new Date(),
            },
            include: {
                Client: true
            }
        });

        res.status(201).json(loan);
    } catch (error) {
        console.error('Error creating loan:', error);
        res.status(500).json({ message: 'Error al crear el préstamo', error });
    }
});

// Get balance for a specific loan
router.get('/balance/:loanId', authenticateToken, async (req: any, res) => {
    try {
        const { loanId } = req.params;

        const loan = await prisma.loan.findUnique({
            where: {
                id: loanId,
                userId: req.user.userId
            },
            include: {
                Payment: true
            }
        });

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        const totalPaid = loan.Payment.reduce((sum: number, payment: any) => sum + payment.amount, 0);
        const balance = loan.amount - totalPaid;

        res.json({ balance });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating balance', error });
    }
});

export default router;
