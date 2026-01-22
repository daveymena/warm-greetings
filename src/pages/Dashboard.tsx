import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useDashboard';
import { useClients } from '@/hooks/useClients';
import { useLoans } from '@/hooks/useLoans';
import { usePayments } from '@/hooks/usePayments';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { DollarSign, TrendingUp, Users, AlertTriangle, Wallet, CalendarCheck } from 'lucide-react';

const Dashboard = () => {
  const { stats } = useDashboard();
  const { clients } = useClients();
  const { getActiveLoans } = useLoans();
  const { getTodayPayments } = usePayments();

  const activeLoans = getActiveLoans();
  const todayPayments = getTodayPayments();
  const recentClients = clients.slice(-5).reverse();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <MainLayout 
      title="Dashboard" 
      subtitle={`Resumen del ${new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}`}
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Prestado"
          value={formatCurrency(stats.totalPrestado)}
          icon={DollarSign}
          variant="default"
        />
        <StatsCard
          title="Cobrado Hoy"
          value={formatCurrency(stats.totalCobradoHoy)}
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Deuda Pendiente"
          value={formatCurrency(stats.deudaPendiente)}
          icon={Wallet}
          variant="warning"
        />
        <StatsCard
          title="Clientes Activos"
          value={stats.clientesActivos}
          icon={Users}
          variant="default"
        />
        <StatsCard
          title="Retrasados"
          value={stats.clientesRetrasados}
          icon={CalendarCheck}
          variant="warning"
        />
        <StatsCard
          title="Morosos"
          value={stats.clientesMorosos}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Content Grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clientes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No hay clientes registrados
              </p>
            ) : (
              <div className="space-y-3">
                {recentClients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium text-foreground">{client.nombre}</p>
                      <p className="text-sm text-muted-foreground">{client.telefono}</p>
                    </div>
                    <ClientStatusBadge status={client.estado} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Préstamos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            {activeLoans.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No hay préstamos activos
              </p>
            ) : (
              <div className="space-y-3">
                {activeLoans.slice(0, 5).map((loan) => {
                  const client = clients.find(c => c.id === loan.clienteId);
                  return (
                    <div key={loan.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-foreground">{formatCurrency(loan.montoPrestado)}</p>
                        <p className="text-sm text-muted-foreground">{client?.nombre || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">{formatCurrency(loan.cuotaPorPago)}</p>
                        <p className="text-xs text-muted-foreground">{loan.frecuenciaCobro}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Collections */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Cobros de Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            {todayPayments.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No se han registrado cobros hoy
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {todayPayments.map((payment) => {
                  const client = clients.find(c => c.id === payment.clienteId);
                  const statusColors = {
                    pagado: 'border-success/30 bg-success/5',
                    parcial: 'border-warning/30 bg-warning/5',
                    no_pagado: 'border-destructive/30 bg-destructive/5',
                  };
                  return (
                    <div key={payment.id} className={`rounded-lg border p-3 ${statusColors[payment.estado]}`}>
                      <p className="font-medium text-foreground">{client?.nombre || 'N/A'}</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(payment.monto)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{payment.estado.replace('_', ' ')}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
