import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Sparkles,
  CreditCard,
  Target,
  MessageSquare,
  TrendingUp,
  Plus,
  Users,
  CalendarCheck,
  Wallet,
  AlertTriangle,
  DollarSign,
  ChevronRight,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { WhatsAppSync } from '@/components/automation/WhatsAppSync';
import { MainLayout } from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { loansApi } from '@/lib/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    collectedToday: 0,
    overdue: loans?.filter((loan: any) => loan.status === 'VENCIDO')?.reduce((acc: number, loan: any) => acc + (loan.balance || 0), 0) || 0,
    activeClients: new Set(loans?.map((loan: any) => loan.clientId)).size || 0,
    totalPortfolio: loans?.reduce((acc: number, loan: any) => acc + (loan.balance || 0), 0) || 0,
    activeLoans: loans?.filter((loan: any) => loan.status === 'ACTIVE' || loan.status === 'APPROVED')?.length || 0,
  };

  const quickActions = [
    { 
      name: 'Nuevo Préstamo', 
      icon: Plus, 
      href: '/prestamos',
      gradient: 'bg-gradient-success',
      shadow: 'shadow-success/30'
    },
    { 
      name: 'Clientes', 
      icon: Users, 
      href: '/clientes',
      gradient: 'bg-primary/10 border-primary/30',
      iconColor: 'text-primary'
    },
    { 
      name: 'Cobros Hoy', 
      icon: CalendarCheck, 
      href: '/cobros',
      gradient: 'bg-warning/10 border-warning/30',
      iconColor: 'text-warning'
    },
    { 
      name: 'WhatsApp', 
      icon: MessageSquare, 
      onClick: () => setIsWaSyncOpen(true),
      gradient: 'bg-success/10 border-success/30',
      iconColor: 'text-success'
    },
  ];

  return (
    <MainLayout
      title={`¡Hola, ${user?.name?.split(' ')[0] || 'Usuario'}!`}
      subtitle="Aquí tienes un resumen de tu negocio"
    >
      <div className="space-y-6 animate-fade-in">
        {/* Hero Card */}
        <div className="hero-card">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-yellow-300" />
                    <span>Balance Total</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                    {formatCurrency(stats.totalLoaned)}
                  </h2>
                  <p className="text-white/70 text-lg">
                    Capital prestado actualmente
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                    <Activity className="h-4 w-4" />
                    <span>{stats.activeLoans} préstamos activos</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{stats.activeClients} clientes</span>
                  </div>
                </div>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20">
                <TrendingUp className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            action.onClick ? (
              <button
                key={action.name}
                onClick={action.onClick}
                className={`quick-action ${action.gradient} ${action.shadow || ''} text-left`}
              >
                <div className={`quick-action-icon ${action.iconColor ? 'bg-current/10' : 'bg-white/20'}`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor || 'text-white'}`} />
                </div>
                <span className={`text-sm font-semibold ${action.iconColor || 'text-white'}`}>
                  {action.name}
                </span>
              </button>
            ) : (
              <Link
                key={action.name}
                to={action.href!}
                className={`quick-action ${action.gradient} ${action.shadow || ''}`}
              >
                <div className={`quick-action-icon ${action.iconColor ? 'bg-current/10' : 'bg-white/20'}`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor || 'text-white'}`} />
                </div>
                <span className={`text-sm font-semibold ${action.iconColor || 'text-white'}`}>
                  {action.name}
                </span>
              </Link>
            )
          ))}
        </div>

        <WhatsAppSync isOpen={isWaSyncOpen} onOpenChange={setIsWaSyncOpen} />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card stat-card-neutral group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Cobrado Hoy</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(stats.collectedToday)}</p>
                  <div className="flex items-center gap-1 text-xs text-success">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>Ingreso del día</span>
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 group-hover:bg-success/20 transition-colors">
                  <DollarSign className="h-7 w-7 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-neutral group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Vencido</p>
                  <p className="text-2xl font-bold text-destructive">{formatCurrency(stats.overdue)}</p>
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Pendiente de cobro</span>
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <AlertTriangle className="h-7 w-7 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-neutral group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                  <p className="text-2xl font-bold text-primary">{stats.activeClients}</p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Users className="h-3 w-3" />
                    <span>En cartera</span>
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-7 w-7 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-neutral group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Cartera Total</p>
                  <p className="text-2xl font-bold text-warning">{formatCurrency(stats.totalPortfolio)}</p>
                  <div className="flex items-center gap-1 text-xs text-warning">
                    <Wallet className="h-3 w-3" />
                    <span>Por cobrar</span>
                  </div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning/10 group-hover:bg-warning/20 transition-colors">
                  <CreditCard className="h-7 w-7 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Loans */}
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-bold">Préstamos Recientes</CardTitle>
            <Button variant="ghost" className="text-primary font-semibold group" asChild>
              <Link to="/prestamos">
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
              </div>
            ) : loans?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No hay préstamos aún</h3>
                <p className="text-sm text-muted-foreground mb-4">Crea tu primer préstamo para comenzar</p>
                <Button className="bg-gradient-primary" onClick={() => navigate('/prestamos')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Préstamo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {loans?.slice(0, 5).map((loan: any, index: number) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between rounded-xl bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-sm cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary/20">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Préstamo #{loan.id.slice(0, 6).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(loan.createdAt).toLocaleDateString('es-CO', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(loan.amount)}</p>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        loan.status === 'PAID' ? 'bg-success/15 text-success' :
                        loan.status === 'ACTIVE' || loan.status === 'APPROVED' ? 'bg-primary/15 text-primary' :
                        loan.status === 'DEFAULTED' ? 'bg-destructive/15 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;