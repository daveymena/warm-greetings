import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, DollarSign, FileText, User, CreditCard } from 'lucide-react';
import { BauchButton } from './BauchButton';
import { PazYSalvoButton } from './PazYSalvoButton';
import { toast } from 'sonner';

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  status: string;
  notes?: string;
}

interface PaymentHistoryData {
  loan: {
    id: string;
    amount: number;
    totalAmount: number;
    interestRate: number;
    term: number;
    status: string;
    startDate: string;
    endDate?: string;
  };
  client: {
    id: string;
    name: string;
    idNumber: string;
  };
  summary: {
    totalPaid: number;
    pendingAmount: number;
    isPaidOff: boolean;
    paymentsCount: number;
  };
  payments: Payment[];
}

interface PaymentHistoryModalProps {
  loanId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaymentHistoryModal = ({ loanId, open, onOpenChange }: PaymentHistoryModalProps) => {
  const [data, setData] = useState<PaymentHistoryData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPaymentHistory = async () => {
    if (!loanId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/receipts/payment-history/${loanId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar el historial de pagos');
      }

      const result = await response.json();
      setData(result);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar el historial de pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && loanId) {
      fetchPaymentHistory();
    }
  }, [open, loanId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Pagos - {data.client.name}
          </DialogTitle>
          <DialogDescription>
            Préstamo #{data.loan.id} • {data.summary.paymentsCount} pagos registrados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Loan Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                Cliente
              </div>
              <div className="font-medium">{data.client.name}</div>
              <div className="text-sm text-gray-600">CC: {data.client.idNumber}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4" />
                Montos
              </div>
              <div className="space-y-1">
                <div className="text-sm">Préstamo: {formatCurrency(data.loan.amount)}</div>
                <div className="text-sm">Total: {formatCurrency(data.loan.totalAmount)}</div>
                <div className="text-sm font-medium text-green-600">
                  Pagado: {formatCurrency(data.summary.totalPaid)}
                </div>
                {data.summary.pendingAmount > 0 && (
                  <div className="text-sm font-medium text-red-600">
                    Pendiente: {formatCurrency(data.summary.pendingAmount)}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Estado
              </div>
              <div className="space-y-2">
                <Badge variant={data.summary.isPaidOff ? 'default' : 'secondary'}>
                  {data.summary.isPaidOff ? 'PAGADO' : 'PENDIENTE'}
                </Badge>
                <div className="text-sm">
                  Tasa: {data.loan.interestRate}% • {data.loan.term} meses
                </div>
                <div className="text-sm text-gray-600">
                  Inicio: {formatDate(data.loan.startDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <PazYSalvoButton
              loanId={data.loan.id}
              clientName={data.client.name}
              totalAmount={data.loan.totalAmount}
              totalPaid={data.summary.totalPaid}
            />
          </div>

          <Separator />

          {/* Payments List */}
          <div>
            <h3 className="font-medium mb-3">Historial de Pagos ({data.payments.length})</h3>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {data.payments.map((payment, index) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium">
                          {data.payments.length - index}
                        </div>
                        <div>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-sm text-gray-600">
                            Pagado: {formatDate(payment.paymentDate)}
                          </div>
                          {payment.notes && (
                            <div className="text-xs text-gray-500 mt-1">{payment.notes}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={payment.status === 'PAID' ? 'default' : 'secondary'}>
                        {payment.status}
                      </Badge>
                      <BauchButton
                        paymentId={payment.id}
                        amount={payment.amount}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};