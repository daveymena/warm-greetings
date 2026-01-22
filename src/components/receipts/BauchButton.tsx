import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BauchButtonProps {
  paymentId: string;
  amount: number;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export const BauchButton = ({ 
  paymentId, 
  amount, 
  disabled, 
  variant = 'outline',
  size = 'sm'
}: BauchButtonProps) => {
  const [loading, setLoading] = useState(false);

  const generateBauch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/receipts/bauch/${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al generar el bauch');
      }

      const data = await response.json();
      
      // Download the PDF
      const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${data.pdfUrl}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `bauch_${data.bauchNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Bauch ${data.bauchNumber} generado exitosamente`);
    } catch (error: any) {
      toast.error(error.message || 'Error al generar el bauch');
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
      onClick={generateBauch}
      disabled={disabled || loading}
      variant={variant}
      size={size}
      className="gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {loading ? 'Generando...' : 'Bauch'}
    </Button>
  );
};