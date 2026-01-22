import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentReceiptButtonProps {
  paymentId: string;
  amount: number;
  disabled?: boolean;
}

export const PaymentReceiptButton = ({ paymentId, amount, disabled }: PaymentReceiptButtonProps) => {
  const [loading, setLoading] = useState(false);

  const generateReceipt = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/receipts/payment/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar el comprobante');
      }

      const data = await response.json();
      
      // Download the PDF
      const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${data.pdfUrl}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `comprobante_${data.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Comprobante ${data.receiptNumber} generado exitosamente`);
    } catch (error: any) {
      toast.error(error.message || 'Error al generar el comprobante');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Button
      onClick={generateReceipt}
      disabled={disabled || loading}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {loading ? 'Generando...' : 'Comprobante'}
    </Button>
  );
};