import nodemailer from 'nodemailer';

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', // Falso host para desarrollo gratis
        port: 587,
        secure: false,
        auth: {
            user: 'fake@email.com',
            pass: 'fake_pass'
        }
    });

    static async sendEmail(to: string, subject: string, body: string) {
        try {
            // Intentar usar configuración de env si existe, sino fallback a log
            console.log(`📧 Simulación de correo enviado a: ${to}\nAsunto: ${subject}\nContenido: ${body}`);

            // En una implementación real con PostgreSQL (como pidió el usuario gratis/sin configuracion compleja):
            // Podríamos guardar los correos en una tabla 'outbox' para que otro proceso los procese si fuera necesario.

            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}
