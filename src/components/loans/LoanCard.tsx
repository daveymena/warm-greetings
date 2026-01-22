import { Loan, Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, User, Wallet } from 'lucide-react';

interface LoanCardProps {
  loan: Loan;
  client: Client | undefined;
  progress: { paid: number; remaining: number; percentage: number };
}

export const LoanCard = ({ loan, client, progress }: LoanCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusColors = {
    activo: 'bg-success/10 text-success border-success/20',
    pagado: 'bg-primary/10 text-primary border-primary/20',
    vencido: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const frequencyLabels = {
    diario: 'Cobro diario',
    semanal: 'Cobro semanal',
    quincenal: 'Cobro quincenal',
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{formatCurrency(loan.montoPrestado)}</h3>
              <p className="text-sm text-muted-foreground">{loan.porcentajeInteres}% interés</p>
            </div>
          </div>
          <Badge variant="outline" className={statusColors[loan.estado]}>
            {loan.estado.charAt(0).toUpperCase() + loan.estado.slice(1)}
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{client?.nombre || 'Cliente no encontrado'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(loan.fechaInicio)} • {frequencyLabels[loan.frecuenciaCobro]}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{Math.round(progress.percentage)}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pagado: {formatCurrency(progress.paid)}</span>
            <span>Restante: {formatCurrency(progress.remaining)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-muted p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cuota:</span>
            <span className="font-semibold text-primary">{formatCurrency(loan.cuotaPorPago)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">{formatCurrency(loan.totalAPagar)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
