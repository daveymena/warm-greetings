import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { LoanForm } from '@/components/loans/LoanForm';
import { LoanCard } from '@/components/loans/LoanCard';
import { useClients } from '@/hooks/useClients';
import { useLoans } from '@/hooks/useLoans';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Wallet } from 'lucide-react';
import { toast } from 'sonner';

const Loans = () => {
  const { clients } = useClients();
  const { loans, addLoan, getLoanProgress } = useLoans();
  const [showForm, setShowForm] = useState(false);

  const activeLoans = loans.filter(l => l.estado === 'activo');
  const completedLoans = loans.filter(l => l.estado === 'pagado');
  const overdueLoans = loans.filter(l => l.estado === 'vencido');

  const handleSubmit = (data: {
    clienteId: string;
    montoPrestado: number;
    fechaInicio: string;
    frecuenciaCobro: 'diario' | 'semanal' | 'quincenal';
    duracionDias: number;
    porcentajeInteres: number;
  }) => {
    addLoan(data);
    toast.success('Préstamo creado correctamente');
    setShowForm(false);
  };

  const renderLoans = (loanList: typeof loans) => {
    if (loanList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No hay préstamos</h3>
          <p className="text-sm text-muted-foreground">No se encontraron préstamos en esta categoría</p>
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loanList.map((loan) => {
          const client = clients.find(c => c.id === loan.clienteId);
          const progress = getLoanProgress(loan.id);
          return (
            <LoanCard
              key={loan.id}
              loan={loan}
              client={client}
              progress={progress}
            />
          );
        })}
      </div>
    );
  };

  return (
    <MainLayout title="Préstamos" subtitle={`${loans.length} préstamos registrados`}>
      {/* Actions Bar */}
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm(true)} disabled={clients.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Préstamo
        </Button>
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Sin clientes</h3>
          <p className="text-sm text-muted-foreground">
            Primero debes registrar clientes para crear préstamos
          </p>
        </div>
      ) : (
        <Tabs defaultValue="activos" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="activos">
              Activos ({activeLoans.length})
            </TabsTrigger>
            <TabsTrigger value="pagados">
              Pagados ({completedLoans.length})
            </TabsTrigger>
            <TabsTrigger value="vencidos">
              Vencidos ({overdueLoans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activos">
            {renderLoans(activeLoans)}
          </TabsContent>

          <TabsContent value="pagados">
            {renderLoans(completedLoans)}
          </TabsContent>

          <TabsContent value="vencidos">
            {renderLoans(overdueLoans)}
          </TabsContent>
        </Tabs>
      )}

      {/* Create Loan Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nuevo Préstamo</DialogTitle>
          </DialogHeader>
          <LoanForm
            clients={clients}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Loans;
