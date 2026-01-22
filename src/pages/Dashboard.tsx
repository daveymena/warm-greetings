import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Sparkles,
  CreditCard,
  Target,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Plus,
  Users,
  CalendarCheck,
  Wallet,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { WhatsAppSync } from '@/components/automation/WhatsAppSync';
import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { loansApi } from '@/lib/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [isWaSyncOpen, setIsWaSyncOpen] = useState(false);
  const navigate = useNavigate();

  const { data: loans, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: loansApi.getAll,
  });

  const stats = {
    totalLoaned: loans?.reduce((acc: number, loan: any) => acc + (loan.amount || 0), 0) || 0,
    collectedToday: 0, // This would normally come from payments
    overdue: loans?.filter((loan: any) => loan.status === 'VENCIDO')?.reduce((acc: number, loan: any) => acc + (loan.balance || 0), 0) || 0,
    activeClients: new Set(loans?.map((loan: any) => loan.clientId)).size || 0,
    totalPortfolio: loans?.reduce((acc: number, loan: any) => acc + (loan.balance || 0), 0) || 0,
  };

  return (
    <MainLayout
      title={`¡Hola, ${user?.name.split(' ')[0]}!`}
      subtitle="Aquí tienes un resumen de hoy"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header with Search (Mobile Style) */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar cliente o préstamo..."
              className="h-11 w-full rounded-2xl bg-white/80 pl-10 pr-4 text-sm shadow-sm backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md dark:bg-card/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-11 w-11">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gradient-primary text-white text-xs font-bold">
                {user?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>

        {/* Hero Card with Gradient */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-8 text-white shadow-2xl shadow-primary/20 animate-scale-in">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-4 right-4">
            <Sparkles className="h-6 w-6 text-white/60 animate-pulse" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-white/80 text-sm font-medium">Balance Total Prestado</span>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {formatCurrency(stats.totalLoaned)}
                  </h2>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{loans?.length || 0} Préstamos totales</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <Target className="h-3.5 w-3.5" />
                <span>{stats.activeClients} Clientes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-3 gap-3 md:flex md:overflow-x-auto md:pb-2 scrollbar-hide">
          <Button className="flex h-24 sm:h-28 flex-col gap-2 rounded-[1.5rem] bg-gradient-success border-0 shadow-lg shadow-success/20 hover:shadow-xl hover:shadow-success/30 transition-all hover:scale-105 active:scale-95">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white/20">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold">Nuevo Préstamo</span>
          </Button>
          <Button variant="outline" className="flex h-24 sm:h-28 flex-col gap-2 rounded-[1.5rem] border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-105 active:scale-95">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-primary">Clientes</span>
          </Button>
          <Button variant="outline" className="flex h-24 sm:h-28 flex-col gap-2 rounded-[1.5rem] border-2 border-dashed border-warning/30 bg-warning/5 hover:bg-warning/10 hover:border-warning/50 transition-all hover:scale-105 active:scale-95">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-warning/10">
              <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-warning" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-warning">Cobros</span>
          </Button>
          <Button variant="outline" className="flex h-24 sm:h-28 flex-col gap-2 rounded-[1.5rem] border-2 border-dashed border-accent/30 bg-accent/5 hover:bg-accent/10 hover:border-accent/50 transition-all hover:scale-105 active:scale-95">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-accent/10">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-accent">Cartera</span>
          </Button>
          <Button
            onClick={() => setIsWaSyncOpen(true)}
            variant="outline"
            className="flex h-24 sm:h-28 flex-col gap-2 rounded-[1.5rem] border-2 border-dashed border-green-500/30 bg-green-50/50 hover:bg-green-100/50 hover:border-green-500/50 transition-all hover:scale-105 active:scale-95"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-green-500/10">
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-green-700">WhatsApp</span>
          </Button>
        </div>

        <WhatsAppSync isOpen={isWaSyncOpen} onOpenChange={setIsWaSyncOpen} />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover rounded-[1.5rem] border-none bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Cobrado Hoy</p>
                  <h3 className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-500">{formatCurrency(stats.collectedToday)}</h3>
                  <p className="mt-1 text-xs text-emerald-600/70 dark:text-emerald-400/70">Registrados hoy</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20">
                  <ArrowDownLeft className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover rounded-[1.5rem] border-none bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-950/30 dark:to-rose-900/20 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-400">Vencido</p>
                  <h3 className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-500">{formatCurrency(stats.overdue)}</h3>
                  <p className="mt-1 text-xs text-rose-600/70 dark:text-rose-400/70">Pendiente de cobro</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 dark:bg-rose-500/20">
                  <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover rounded-[1.5rem] border-none bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Clientes Activos</p>
                  <h3 className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-500">{stats.activeClients}</h3>
                  <p className="mt-1 text-xs text-blue-600/70 dark:text-blue-400/70">En cartera</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 dark:bg-blue-500/20">
                  <Users className="h-7 w-7 text-blue-600 dark:text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover rounded-[1.5rem] border-none bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Cartera Total</p>
                  <h3 className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-500">{formatCurrency(stats.totalPortfolio)}</h3>
                  <p className="mt-1 text-xs text-amber-600/70 dark:text-amber-400/70">Saldo vigente</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-500/20">
                  <CreditCard className="h-7 w-7 text-amber-600 dark:text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Loans */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Préstamos Recientes</h3>
            <Button variant="link" className="text-primary font-semibold hover:gap-2 transition-all group">
              Ver todos
              <ArrowUpRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              </div>
            ) : loans?.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-[1.5rem] bg-muted/30 p-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground font-medium">No hay préstamos aún</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Crea tu primer préstamo para comenzar</p>
              </div>
            ) : (
              loans?.map((loan: any, index: number) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between rounded-[1.25rem] bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:bg-card/50 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-primary/20">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Préstamo #{loan.id.slice(0, 6).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(loan.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatCurrency(loan.amount)}</p>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block dark:bg-emerald-950/30 dark:text-emerald-400">
                      {loan.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
