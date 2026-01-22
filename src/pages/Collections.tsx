import { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CollectionCard } from '@/components/collections/CollectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClients } from '@/hooks/useClients';
import { useLoans } from '@/hooks/useLoans';
import { usePayments } from '@/hooks/usePayments';
import { DailyCollection, PaymentStatus } from '@/types';
import { CalendarCheck, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Collections = () => {
  const { clients, refresh: refreshClients } = useClients();
  const { getActiveLoans } = useLoans();
  const { addPayment, getTodayPayments, getTodayTotal, refresh: refreshPayments } = usePayments();

  const activeLoans = getActiveLoans();
  const todayPayments = getTodayPayments();
  const todayTotal = getTodayTotal();

  const dailyCollections = useMemo((): DailyCollection[] => {
    return activeLoans
      .filter(loan => loan.frecuenciaCobro === 'diario')
      .map(loan => {
        const client = clients.find(c => c.id === loan.clienteId);
        const todayPayment = todayPayments.find(p => p.prestamoId === loan.id);
        
        return {
          clienteId: loan.clienteId,
          cliente: client!,
          prestamo: loan,
          cuotaEsperada: loan.cuotaPorPago,
          pagado: !!todayPayment,
          montoPagado: todayPayment?.monto || 0,
        };
      })
      .filter(c => c.cliente); // Filter out collections without valid clients
  }, [activeLoans, clients, todayPayments]);

  const pendingCollections = dailyCollections.filter(c => !c.pagado);
  const completedCollections = dailyCollections.filter(c => c.pagado);

  const handlePayment = (
    clienteId: string,
    prestamoId: string,
    monto: number,
    estado: PaymentStatus,
    comentario?: string
  ) => {
    addPayment({
      prestamoId,
      clienteId,
      monto,
      estado,
      comentario,
    });
    
    refreshPayments();
    refreshClients();

    const statusMessages = {
      pagado: 'Pago registrado correctamente',
      parcial: 'Pago parcial registrado',
      no_pagado: 'Marcado como no pagó',
    };
    
    toast.success(statusMessages[estado]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  const expectedTotal = dailyCollections.reduce((sum, c) => sum + c.cuotaEsperada, 0);

  return (
    <MainLayout 
      title="Cobros del Día" 
      subtitle={new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
    >
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Por cobrar</p>
              <p className="text-xl font-bold">{pendingCollections.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-success/10 p-3">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cobrado hoy</p>
              <p className="text-xl font-bold">{formatCurrency(todayTotal)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-warning/10 p-3">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Esperado</p>
              <p className="text-xl font-bold">{formatCurrency(expectedTotal)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {dailyCollections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <CalendarCheck className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">Sin cobros pendientes</h3>
          <p className="text-sm text-muted-foreground">
            No hay préstamos con cobro diario activos
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Collections */}
          {pendingCollections.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Pendientes ({pendingCollections.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingCollections.map((collection) => (
                  <CollectionCard
                    key={collection.prestamo.id}
                    collection={collection}
                    onPayment={handlePayment}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Collections */}
          {completedCollections.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">Cobrados ({completedCollections.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedCollections.map((collection) => (
                  <CollectionCard
                    key={collection.prestamo.id}
                    collection={collection}
                    onPayment={handlePayment}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default Collections;
