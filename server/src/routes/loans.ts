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
                payments: true,
                client: true
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
        const { amount, interestRate, term } = req.body;
        const loan = await prisma.loan.create({
            data: {
                amount,
                interestRate,
                term,
                userId: req.user.userId,
            },
        });
        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: 'Error creating loan', error });
    }
});

export default router;
