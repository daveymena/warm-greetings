import cron from 'node-cron';
import { prisma } from '../index';
import { AIService } from './aiService';
import { WhatsAppService } from './whatsappService';
import { EmailService } from './emailService';

export class ReminderJob {
    static init() {
        // Run every day at 8:00 AM for reminders
        cron.schedule('0 8 * * *', async () => {
            console.log('⏰ Starting daily reminder job...');
            await this.processReminders();
        });

        // Run every day at 1:00 AM to mark overdue payments
        cron.schedule('0 1 * * *', async () => {
            console.log('⏰ Running overdue status update...');
            await this.markOverduePayments();
        });

        console.log('✅ Reminder and Overdue cron jobs scheduled');
    }

    static async markOverduePayments() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result = await prisma.payment.updateMany({
                where: {
                    status: 'PENDING',
                    dueDate: {
                        lt: today
                    }
                },
                data: {
                    status: 'OVERDUE'
                }
            });

            console.log(`✅ Marked ${result.count} payments as OVERDUE`);
            return result.count;
        } catch (error) {
            console.error('Error marking overdue payments:', error);
            throw error;
        }
    }

    static async processReminders() {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const tomorrowEnd = new Date(tomorrow);
            tomorrowEnd.setHours(23, 59, 59, 999);

            console.log(`🔍 Checking reminders for date: ${tomorrow.toLocaleDateString()}`);

            // 1. Reminders for CLIENTS (Borrowers) with payments due tomorrow
            const duePayments = await prisma.payment.findMany({
                where: {
                    status: 'PENDING',
                    dueDate: {
                        gte: tomorrow,
                        lte: tomorrowEnd
                    }
                },
                include: {
                    Loan: {
                        include: {
                            Client: true,
                            User: true
                        }
                    }
                }
            });

            console.log(`📢 Found ${duePayments.length} upcoming payments for tomorrow.`);

            for (const payment of duePayments) {
                const { Loan } = payment;
                const { Client, User } = Loan;

                const message = await AIService.generateReminderText(
                    Client.name,
                    payment.amount,
                    tomorrow.toLocaleDateString(),
                    User?.name || 'Rapi-Credi',
                    (Loan as any).frequency || 'MENSUAL'
                );

                // Send WhatsApp to Client
                if (Client.phone) {
                    await WhatsAppService.sendMessage(Client.phone, message);
                }

                // Send Email to Client
                if (Client.email) {
                    await EmailService.sendEmail(Client.email, 'Recordatorio de Pago Próximo - Rapi-Credi', message);
                }
            }

            // 2. Alerts for PRESTAMISTAS (Lenders) about overdue payments
            const overduePayments = await prisma.payment.findMany({
                where: {
                    status: 'OVERDUE'
                },
                include: {
                    Loan: {
                        include: {
                            Client: true,
                            User: true
                        }
                    }
                }
            });

            // Group by lender (user)
            const lenderMora: Record<string, any[]> = {};
            for (const payment of overduePayments) {
                const { Loan } = payment;
                if (Loan.userId) {
                    if (!lenderMora[Loan.userId]) lenderMora[Loan.userId] = [];
                    lenderMora[Loan.userId].push({
                        client: Loan.Client.name,
                        amount: payment.amount,
                        daysOverdue: Math.floor((today.getTime() - payment.dueDate.getTime()) / (1000 * 60 * 60 * 24))
                    });
                }
            }

            console.log(`📢 Found overdue payments for ${Object.keys(lenderMora).length} lenders.`);

            for (const [userId, loans] of Object.entries(lenderMora)) {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user && user.phone) {
                    const alert = await AIService.generateAlertForLender(user.name, loans);
                    await WhatsAppService.sendMessage(user.phone, alert);

                    // Also email the lender
                    await EmailService.sendEmail(user.email, 'Reporte de Cartera Vencida - Rapi-Credi', alert);
                }
            }

            return {
                processedDue: duePayments.length,
                processedOverdue: Object.keys(lenderMora).length
            };

        } catch (error) {
            console.error('Error in ReminderJob:', error);
            throw error;
        }
    }
}
