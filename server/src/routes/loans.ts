import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../index';

const router = express.Router();

// Get all loans for current user
router.get('/', authenticateToken, async (req: any, res) => {
    const startTime = Date.now();
    try {
        if (!req.user || !req.user.userId) {
            console.error('❌ GET /loans - User not authenticated or missing userId');
            return res.status(401).json({ message: 'User ID missing in token' });
        }

        console.log(`🔄 [${new Date().toISOString()}] GET /loans - Fetching for UserID: ${req.user.userId}`);

        // 1. First test DB connection with a lightweight count
        try {
            const count = await prisma.loan.count({
                where: {
                    OR: [
                        { userId: req.user.userId },
                        { userId: null }
                    ]
                }
            });
            console.log(`📊 Found ${count} total loans for user (including orphans)`);
        } catch (dbError: any) {
            console.error('❌ Database Connection/Count Error:', dbError);
            return res.status(503).json({ message: 'Database connection failed', error: dbError.message });
        }

        // 2. Fetch data with optimized selection
        const loans = await prisma.loan.findMany({
            where: {
                OR: [
                    { userId: req.user.userId },
                    { userId: null }
                ]
            },
            include: {
                Payment: {
                    select: { amount: true }
                },
                Client: {
                    select: { id: true, name: true, idNumber: true }
                }
            },
            take: 100, // Hard limit to prevent memory explosion if massive data
            orderBy: { createdAt: 'desc' }
        });

        console.log(`✅ Loaded ${loans.length} loans from DB in ${Date.now() - startTime}ms`);

        // 3. Process data safely
        const loansWithBalance = loans.map((loan: any) => {
            try {
                // Defensive check for relations
                const payments = (loan.Payment && Array.isArray(loan.Payment)) ? loan.Payment : [];
                const clientName = loan.Client?.name || 'Cliente Desconocido';

                // Safe reduce
                const totalPaid = payments.reduce((sum: number, p: any) => {
                    const amount = Number(p.amount);
                    return sum + (isNaN(amount) ? 0 : amount);
                }, 0);

                // Create response object safely
                return {
                    id: loan.id,
                    amount: loan.amount,
                    interestRate: loan.interestRate,
                    frequency: loan.frequency,
                    term: loan.term,
                    status: loan.status,
                    createdAt: loan.createdAt,
                    monthlyPayment: loan.monthlyPayment,
                    totalAmount: loan.totalAmount,
                    totalPaid: totalPaid,
                    client: {
                        name: clientName,
                        idNumber: loan.Client?.idNumber || 'Sin ID'
                    },
                    Client: {
                        name: clientName,
                        idNumber: loan.Client?.idNumber || 'Sin ID'
                    }
                };
            } catch (mapError) {
                console.error(`⚠️ Error mapping loan ${loan.id}:`, mapError);
                return { ...loan, totalPaid: 0 };
            }
        });

        console.log(`🚀 Sending response with ${loansWithBalance.length} items (${Date.now() - startTime}ms total)`);
        res.json(loansWithBalance);

    } catch (error: any) {
        console.error('❌ CRITICAL GET /loans ERROR:', error);
        console.error('Stack:', error.stack);
        res.status(500).json({
            message: 'Error interno obteniendo préstamos',
            details: error.message
        });
    }
});

// Create a new loan request
router.post('/', authenticateToken, async (req: any, res) => {
    try {
        console.log('📝 Creating new loan, body:', req.body);
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

        // Validate numeric fields to prevent DB errors
        const parsedAmount = parseFloat(amount);
        const parsedInterest = parseFloat(interestRate);
        const parsedTerm = parseInt(term);
        const parsedMonthlyPayment = parseFloat(installmentAmount);
        const parsedTotal = parseFloat(totalAmount);

        if (isNaN(parsedAmount) || isNaN(parsedInterest) || isNaN(parsedTerm)) {
            return res.status(400).json({ message: 'Monto, interés y plazo deben ser números válidos.' });
        }

        // Check if user exists to avoid Foreign Key constraint error (P2003) if DB was reset
        let validUserId = null;
        if (req.user?.userId) {
            const userExists = await prisma.user.findUnique({ where: { id: req.user.userId } });
            if (userExists) {
                validUserId = req.user.userId;
            } else {
                console.warn(`⚠️ Loan creation: User ${req.user.userId} from token not found in DB. Assigning null userId.`);
            }
        }

        const loan = await prisma.loan.create({
            data: {
                id: `LN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                amount: parsedAmount,
                interestRate: parsedInterest,
                interestType: interestType || 'TOTAL',
                frequency: frequency || 'MENSUAL',
                term: parsedTerm,
                paymentDay: paymentDay ? parseInt(paymentDay) : null,
                paymentWeekday: paymentWeekday || null,
                monthlyPayment: isNaN(parsedMonthlyPayment) ? 0 : parsedMonthlyPayment,
                totalAmount: isNaN(parsedTotal) ? 0 : parsedTotal,
                purpose: purpose || null,
                status: 'ACTIVE',
                userId: validUserId,
                clientId: clientId,
                startDate: new Date(),
            },
            include: {
                Client: true
            }
        });

        console.log('✅ Loan created successfully:', loan.id);
        res.status(201).json(loan);
    } catch (error: any) {
        console.error('❌ Error creating loan:', error);
        res.status(500).json({ message: 'Error al crear el préstamo', error: error.message || error });
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


