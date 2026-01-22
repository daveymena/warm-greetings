import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Download, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PazYSalvoButtonProps {
  loanId: string;
  clientName: string;
  totalAmount: number;
  totalPaid: number;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export const PazYSalvoButton = ({ 
  loanId, 
  clientName,
  totalAmount,
  totalPaid,
  disabled, 
  variant = 'default',
  size = 'default'
}: PazYSalvoButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const isPaidOff = totalPaid >= totalAmount;
  const pendingAmount = totalAmount - totalPaid;

  const generatePazYSalvo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/receipts/paz-y-salvo/${loanId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar el paz y salvo');
      }

      const data = await response.json();
      
      // Download the PDF
      const pdfUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${data.pdfUrl}`;
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `paz_y_salvo_${data.documentNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Paz y Salvo ${data.documentNumber} generado exitosamente`);
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Error al generar el paz y salvo');
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

  if (!isPaidOff) {
    return (
      <Button
        disabled={true}
        variant="outline"
        size={size}
        className="gap-2 opacity-50"
        title={`Saldo pendiente: ${formatCurrency(pendingAmount)}`}
      >
        <AlertCircle className="h-4 w-4" />
        Paz y Salvo
      </Button>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={disabled || loading}
          variant={variant}
          size={size}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Shield className="h-4 w-4" />
          )}
          {loading ? 'Generando...' : 'Paz y Salvo'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Generar Paz y Salvo</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea generar el Paz y Salvo para el cliente <strong>{clientName}</strong>?
            <br /><br />
            <div className="bg-green-50 p-3 rounded-md border border-green-200">
              <div className="text-sm text-green-800">
                <div>Total del préstamo: {formatCurrency(totalAmount)}</div>
                <div>Total pagado: {formatCurrency(totalPaid)}</div>
                <div className="font-semibold">Estado: PAGADO COMPLETAMENTE</div>
              </div>
            </div>
            <br />
            Este documento certifica que el cliente se encuentra a paz y salvo con todas sus obligaciones.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={generatePazYSalvo} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generando...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Generar Paz y Salvo
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};