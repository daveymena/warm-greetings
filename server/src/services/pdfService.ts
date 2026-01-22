import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface PaymentReceiptData {
  receiptNumber: string;
  paymentDate: Date;
  clientName: string;
  clientId: string;
  loanId: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
  companyInfo: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface BauchData {
  bauchNumber: string;
  paymentDate: Date;
  clientName: string;
  clientId: string;
  clientIdNumber: string;
  loanId: string;
  amount: number;
  paymentMethod: string;
  installmentNumber?: number;
  totalInstallments?: number;
  remainingBalance?: number;
  notes?: string;
  companyInfo: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface PazYSalvoData {
  documentNumber: string;
  generatedDate: Date;
  clientName: string;
  clientId: string;
  clientIdNumber: string;
  loanId: string;
  originalAmount: number;
  totalPaid: number;
  startDate: Date;
  endDate: Date;
  interestRate: number;
  term: number;
  companyInfo: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}

export class PDFService {
  private static ensureUploadsDir() {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
  }

  private static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  }

  private static addHeader(doc: any, title: string, companyInfo: any) {
    // Company name
    doc.fontSize(22).fillColor('#2563eb').text(companyInfo.name, { align: 'center' });
    
    // Document title
    doc.fontSize(18).fillColor('#1e40af').text(title, { align: 'center' });
    doc.moveDown(0.5);

    // Company info
    doc.fontSize(10).fillColor('#6b7280');
    if (companyInfo.address) {
      doc.text(`Dirección: ${companyInfo.address}`, { align: 'center' });
    }
    if (companyInfo.phone) {
      doc.text(`Teléfono: ${companyInfo.phone}`, { align: 'center' });
    }
    if (companyInfo.email) {
      doc.text(`Email: ${companyInfo.email}`, { align: 'center' });
    }
    
    // Separator line
    doc.moveDown(1);
    doc.strokeColor('#e5e7eb').lineWidth(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);
    
    doc.fillColor('#000000'); // Reset color
  }

  static async generatePaymentReceipt(data: PaymentReceiptData): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const uploadsDir = this.ensureUploadsDir();
        const fileName = `recibo_${data.receiptNumber}_${Date.now()}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        this.addHeader(doc, 'COMPROBANTE DE PAGO', data.companyInfo);

        // Document info
        const startY = doc.y;
        doc.fontSize(12);
        
        // Left column
        doc.text(`Recibo No: ${data.receiptNumber}`, 50, startY);
        doc.text(`Fecha: ${data.paymentDate.toLocaleDateString('es-CO')}`, 50, startY + 20);
        doc.text(`Cliente: ${data.clientName}`, 50, startY + 40);
        doc.text(`ID Cliente: ${data.clientId}`, 50, startY + 60);
        
        // Right column
        doc.text(`Préstamo: ${data.loanId}`, 300, startY);
        doc.text(`Método de pago: ${data.paymentMethod}`, 300, startY + 20);
        
        doc.moveDown(5);

        // Amount box
        doc.rect(50, doc.y, 500, 60).stroke();
        doc.fontSize(16).text('MONTO PAGADO:', 60, doc.y + 10);
        doc.fontSize(20).text(
          this.formatCurrency(data.amount),
          60, doc.y + 10,
          { align: 'right', width: 480 }
        );

        doc.moveDown(3);

        // Notes
        if (data.notes) {
          doc.fontSize(12).text(`Observaciones: ${data.notes}`);
          doc.moveDown();
        }

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).fillColor('#6b7280');
        doc.text('Este documento es un comprobante válido de pago.', { align: 'center' });
        doc.text(`Generado el ${new Date().toLocaleString('es-CO')}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          resolve(`/uploads/${fileName}`);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generateBauch(data: BauchData): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const uploadsDir = this.ensureUploadsDir();
        const fileName = `bauch_${data.bauchNumber}_${Date.now()}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        this.addHeader(doc, 'BAUCHE DE PAGO', data.companyInfo);

        // Document info box
        doc.rect(50, doc.y, 500, 100).fillAndStroke('#f8fafc', '#e2e8f0');
        
        const boxY = doc.y + 10;
        doc.fillColor('#000000').fontSize(12);
        
        // Left side
        doc.text(`Bauche No: ${data.bauchNumber}`, 60, boxY);
        doc.text(`Fecha: ${data.paymentDate.toLocaleDateString('es-CO')}`, 60, boxY + 20);
        doc.text(`Cliente: ${data.clientName}`, 60, boxY + 40);
        doc.text(`Cédula: ${data.clientIdNumber}`, 60, boxY + 60);
        
        // Right side
        doc.text(`Préstamo: ${data.loanId}`, 300, boxY);
        doc.text(`Método: ${data.paymentMethod}`, 300, boxY + 20);
        if (data.installmentNumber && data.totalInstallments) {
          doc.text(`Cuota: ${data.installmentNumber}/${data.totalInstallments}`, 300, boxY + 40);
        }

        doc.moveDown(7);

        // Payment amount - highlighted
        doc.rect(50, doc.y, 500, 80).fillAndStroke('#dbeafe', '#3b82f6');
        doc.fontSize(14).fillColor('#1e40af').text('VALOR PAGADO:', 60, doc.y + 15);
        doc.fontSize(24).fillColor('#1e3a8a').text(
          this.formatCurrency(data.amount),
          60, doc.y + 15,
          { align: 'right', width: 480 }
        );

        doc.moveDown(5);
        doc.fillColor('#000000');

        // Remaining balance if provided
        if (data.remainingBalance !== undefined) {
          doc.fontSize(12);
          doc.text(`Saldo restante: ${this.formatCurrency(data.remainingBalance)}`, { align: 'right' });
          doc.moveDown();
        }

        // Notes
        if (data.notes) {
          doc.fontSize(12).text('Observaciones:', { underline: true });
          doc.text(data.notes);
          doc.moveDown();
        }

        // Signature area
        doc.moveDown(3);
        doc.text('_________________________', 50);
        doc.text('Firma del Cliente', 50);
        
        doc.text('_________________________', 350);
        doc.text('Firma Autorizada', 350);

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).fillColor('#6b7280');
        doc.text('Este bauche certifica el pago realizado en la fecha indicada.', { align: 'center' });
        doc.text(`Generado el ${new Date().toLocaleString('es-CO')}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          resolve(`/uploads/${fileName}`);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async generatePazYSalvo(data: PazYSalvoData): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const uploadsDir = this.ensureUploadsDir();
        const fileName = `paz_y_salvo_${data.documentNumber}_${Date.now()}.pdf`;
        const filePath = path.join(uploadsDir, fileName);

        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        this.addHeader(doc, 'PAZ Y SALVO', data.companyInfo);

        // Document info
        doc.fontSize(12);
        doc.text(`Documento No: ${data.documentNumber}`, { align: 'right' });
        doc.text(`Fecha de expedición: ${data.generatedDate.toLocaleDateString('es-CO')}`, { align: 'right' });
        doc.moveDown(2);

        // Main certification
        doc.rect(50, doc.y, 500, 40).fillAndStroke('#fef3c7', '#f59e0b');
        doc.fontSize(16).fillColor('#92400e').text('CERTIFICAMOS QUE:', 50, doc.y + 12, { align: 'center' });
        doc.moveDown(3);
        doc.fillColor('#000000');

        // Main content
        doc.fontSize(12);
        const content = `El señor(a) ${data.clientName}, identificado(a) con cédula No. ${data.clientIdNumber}, ` +
          `se encuentra a PAZ Y SALVO por concepto del préstamo No. ${data.loanId} por valor de ` +
          `${this.formatCurrency(data.originalAmount)}, otorgado el ${data.startDate.toLocaleDateString('es-CO')} ` +
          `con una tasa de interés del ${data.interestRate}% y un plazo de ${data.term} cuotas.`;

        doc.text(content, { align: 'justify', lineGap: 5 });
        doc.moveDown(2);

        // Payment summary box
        doc.rect(50, doc.y, 500, 120).fillAndStroke('#f0fdf4', '#16a34a');
        const summaryY = doc.y + 10;
        
        doc.fontSize(14).fillColor('#15803d').text('RESUMEN DE PAGOS:', 60, summaryY);
        doc.fontSize(12).fillColor('#000000');
        
        doc.text(`Monto original: ${this.formatCurrency(data.originalAmount)}`, 60, summaryY + 25);
        doc.text(`Total pagado: ${this.formatCurrency(data.totalPaid)}`, 60, summaryY + 45);
        doc.text(`Fecha de inicio: ${data.startDate.toLocaleDateString('es-CO')}`, 60, summaryY + 65);
        doc.text(`Fecha de finalización: ${data.endDate.toLocaleDateString('es-CO')}`, 60, summaryY + 85);
        
        doc.moveDown(8);

        // Final declaration
        doc.fontSize(12);
        const finalDeclaration = `Por lo tanto, el cliente no tiene obligaciones pendientes con nuestra entidad ` +
          `por el préstamo mencionado y se encuentra en pleno goce de sus derechos crediticios.`;
        doc.text(finalDeclaration, { align: 'justify' });
        doc.moveDown(4);

        // Signature area
        doc.text('_________________________________', 300);
        doc.text('Firma Autorizada', 300);
        doc.text(data.companyInfo.name, 300);
        doc.moveDown(2);

        // Footer
        doc.fontSize(10).fillColor('#6b7280');
        doc.text('Este documento certifica el cumplimiento total de las obligaciones crediticias.', { align: 'center' });
        doc.text(`Generado el ${new Date().toLocaleString('es-CO')}`, { align: 'center' });

        doc.end();

        stream.on('finish', () => {
          resolve(`/uploads/${fileName}`);
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}