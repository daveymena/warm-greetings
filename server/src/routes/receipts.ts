import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { prisma } from '../index';
import { PDFService } from '../services/pdfService';

const router = express.Router();

// Generate payment receipt
router.post('/payment/:paymentId', authenticateToken, async (req: any, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        Loan: {
          include: {
            Client: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    // Get company settings
    const companySettings = await prisma.companySettings.findUnique({
      where: { id: 'company' }
    });

    const receiptNumber = `REC-${Date.now().toString().slice(-8)}`;
    
    const receiptData = {
      receiptNumber,
      paymentDate: payment.paymentDate,
      clientName: payment.Loan.Client.name,
      clientId: payment.Loan.Client.id,
      loanId: payment.Loan.id,
      amount: payment.amount,
      paymentMethod: 'Efectivo', // Default, could be enhanced
      notes: payment.notes || undefined,
      companyInfo: {
        name: companySettings?.name || 'RapiCrédito',
        address: companySettings?.address || undefined,
        phone: companySettings?.phone || undefined,
        email: companySettings?.email || undefined,
      }
    };

    const pdfPath = await PDFService.generatePaymentReceipt(receiptData);
    
    // Update payment with receipt info
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        notes: payment.notes ? `${payment.notes} | Recibo: ${receiptNumber}` : `Recibo: ${receiptNumber}`
      }
    });

    res.json({
      success: true,
      receiptNumber,
      pdfUrl: pdfPath,
      message: 'Comprobante de pago generado exitosamente'
    });

  } catch (error) {
    console.error('Error generating payment receipt:', error);
    res.status(500).json({ message: 'Error al generar el comprobante de pago', error });
  }
});

// Generate paz y salvo for completed loan
router.post('/paz-y-salvo/:loanId', authenticateToken, async (req: any, res) => {
  try {
    const { loanId } = req.params;
    
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        Client: true,
        Payment: true
      }
    });

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    // Check if loan is fully paid
    const totalPaid = loan.Payment.reduce((sum, payment) => sum + payment.amount, 0);
    
    if (totalPaid < loan.totalAmount) {
      return res.status(400).json({ 
        message: 'El préstamo aún tiene saldo pendiente',
        totalAmount: loan.totalAmount,
        totalPaid,
        pending: loan.totalAmount - totalPaid
      });
    }

    // Get company settings
    const companySettings = await prisma.companySettings.findUnique({
      where: { id: 'company' }
    });

    const documentNumber = `PYS-${Date.now().toString().slice(-8)}`;
    
    const pazYSalvoData = {
      documentNumber,
      generatedDate: new Date(),
      clientName: loan.Client.name,
      clientId: loan.Client.id,
      clientIdNumber: loan.Client.idNumber,
      loanId: loan.id,
      originalAmount: loan.amount,
      totalPaid,
      startDate: loan.startDate || loan.createdAt,
      endDate: loan.endDate || new Date(),
      interestRate: loan.interestRate,
      term: loan.term,
      companyInfo: {
        name: companySettings?.name || 'RapiCrédito',
        address: companySettings?.address || undefined,
        phone: companySettings?.phone || undefined,
        email: companySettings?.email || undefined,
      }
    };

    const pdfPath = await PDFService.generatePazYSalvo(pazYSalvoData);
    
    // Update loan status to PAID if not already
    if (loan.status !== 'PAID') {
      await prisma.loan.update({
        where: { id: loanId },
        data: { 
          status: 'PAID',
          endDate: new Date()
        }
      });
    }

    res.json({
      success: true,
      documentNumber,
      pdfUrl: pdfPath,
      message: 'Paz y Salvo generado exitosamente'
    });

  } catch (error) {
    console.error('Error generating paz y salvo:', error);
    res.status(500).json({ message: 'Error al generar el Paz y Salvo', error });
  }
});

// Get payment history for a loan
router.get('/payment-history/:loanId', authenticateToken, async (req: any, res) => {
  try {
    const { loanId } = req.params;
    
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        Client: true,
        Payment: {
          orderBy: { paymentDate: 'desc' }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({ message: 'Préstamo no encontrado' });
    }

    const totalPaid = loan.Payment.reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = loan.totalAmount - totalPaid;
    const isPaidOff = pendingAmount <= 0;

    res.json({
      loan: {
        id: loan.id,
        amount: loan.amount,
        totalAmount: loan.totalAmount,
        interestRate: loan.interestRate,
        term: loan.term,
        status: loan.status,
        startDate: loan.startDate,
        endDate: loan.endDate
      },
      client: {
        id: loan.Client.id,
        name: loan.Client.name,
        idNumber: loan.Client.idNumber
      },
      summary: {
        totalPaid,
        pendingAmount,
        isPaidOff,
        paymentsCount: loan.Payment.length
      },
      payments: loan.Payment.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        dueDate: payment.dueDate,
        status: payment.status,
        notes: payment.notes
      }))
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Error al obtener el historial de pagos', error });
  }
});

// Generate bauch (payment voucher) - alias for payment receipt
router.post('/bauch/:paymentId', authenticateToken, async (req: any, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        Loan: {
          include: {
            Client: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    // Get company settings
    const companySettings = await prisma.companySettings.findUnique({
      where: { id: 'company' }
    });

    const bauchNumber = `BAUCH-${Date.now().toString().slice(-8)}`;

    const bauchData = {
      bauchNumber,
      paymentDate: payment.paymentDate,
      clientName: payment.Loan.Client.name,
      clientId: payment.Loan.Client.id,
      clientIdNumber: payment.Loan.Client.idNumber,
      loanId: payment.Loan.id,
      amount: payment.amount,
      paymentMethod: 'Efectivo',
      notes: payment.notes || undefined,
      companyInfo: {
        name: companySettings?.name || 'RapiCrédito',
        address: companySettings?.address || undefined,
        phone: companySettings?.phone || undefined,
        email: companySettings?.email || undefined,
      }
    };

    const pdfPath = await PDFService.generateBauch(bauchData);
    
    // Update payment with bauch info
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        notes: payment.notes ? `${payment.notes} | Bauch: ${bauchNumber}` : `Bauch: ${bauchNumber}`
      }
    });

    res.json({
      success: true,
      bauchNumber,
      pdfUrl: pdfPath,
      message: 'Bauch generado exitosamente'
    });

  } catch (error) {
    console.error('Error generating bauch:', error);
    res.status(500).json({ message: 'Error al generar el bauch', error });
  }
});

export default router;