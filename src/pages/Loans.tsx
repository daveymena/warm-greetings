import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { LoanFormAdvanced } from '@/components/loans/LoanFormAdvanced';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Wallet,
  DollarSign,
  Calendar,
  User,
  Phone,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { loansApi } from '@/lib/api';

interface LoanFormData {
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientIdNumber: string;
  clientIdType: string;
  clientOccupation: string;
  clientIncome: number;
  amount: number;
  interestRate: number;
  interestType: 'TOTAL' | 'MENSUAL';
  frequency: 'DIARIO' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL';
  term: number;
  paymentDay: number;
  paymentWeekday: string;
  purpose: string;
  installmentAmount: number;
  totalAmount: number;
}

const Loans = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: loans = [], isLoading, refetch } = useQuery({
    queryKey: ['loans'],
    queryFn: loansApi.getAll,
  });

  const activeLoans = loans.filter((l: any) => l.status === 'APPROVED' || l.status === 'ACTIVE');
  const pendingLoans = loans.filter((l: any) => l.status === 'PENDING');
  const rejectedLoans = loans.filter((l: any) => l.status === 'REJECTED');
  const paidLoans = loans.filter((l: any) => l.status === 'PAID');

  const handleSubmit = async (data: LoanFormData) => {
    setLoading(true);
    try {
      let finalClientId = data.clientId;

      // If no clientId, we should probably create the client first
      if (!finalClientId) {
        // This is a simplification, ideally you'd have a clientsApi.create
        const clientResp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/clients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: data.clientName,
            phone: data.clientPhone,
            email: data.clientEmail,
            address: data.clientAddress,
            idNumber: data.clientIdNumber,
            idType: data.clientIdType,
            occupation: data.clientOccupation,
            income: data.clientIncome
          })
        });

        if (!clientResp.ok) throw new Error('Error al crear el cliente');
        const clientData = await clientResp.json();
        finalClientId = clientData.id;
      }

      await loansApi.create({
        ...data,
        clientId: finalClientId
      });

      toast.success('Préstamo creado correctamente');
      setShowForm(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el préstamo');
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { label: 'Pendiente', variant: 'secondary' as const, icon: Clock },
      'APPROVED': { label: 'Aprobado', variant: 'default' as const, icon: CheckCircle },
      'ACTIVE': { label: 'Activo', variant: 'default' as const, icon: TrendingUp },
      'REJECTED': { label: 'Rechazado', variant: 'destructive' as const, icon: AlertTriangle },
      'PAID': { label: 'Pagado', variant: 'outline' as const, icon: CheckCircle },
      'DEFAULTED': { label: 'En Mora', variant: 'destructive' as const, icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const renderLoanCard = (loan: any) => (
    <Card key={loan.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Préstamo #{loan.id.slice(-6).toUpperCase()}
          </CardTitle>
          {getStatusBadge(loan.status)}
        </div>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {new Date(loan.createdAt).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Monto Prestado</span>
          <span className="font-semibold text-lg text-blue-600">
            {formatCurrency(loan.amount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Cuota {loan.frequency?.toLowerCase() || 'mensual'}</span>
          <span className="font-bold text-green-600">
            {formatCurrency(loan.monthlyPayment)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Plan</span>
          <span className="font-medium">{loan.term} cuotas</span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="truncate">Cliente: {loan.client?.name || loan.Client?.name || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLoans = (loanList: any[]) => {
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
        {loanList.map(renderLoanCard)}
      </div>
    );
  };

  if (isLoading) {
    return (
      <MainLayout title="Préstamos" subtitle="Cargando préstamos...">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Préstamos" subtitle={`${loans.length} préstamos registrados`}>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Préstamos</p>
                <p className="text-2xl font-bold">{loans.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-green-600">{activeLoans.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingLoans.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagados</p>
                <p className="text-2xl font-bold text-blue-600">{paidLoans.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Préstamo
        </Button>
      </div>

      {/* Loans Tabs */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="todos">
            Todos ({loans.length})
          </TabsTrigger>
          <TabsTrigger value="pendientes">
            Pendientes ({pendingLoans.length})
          </TabsTrigger>
          <TabsTrigger value="activos">
            Activos ({activeLoans.length})
          </TabsTrigger>
          <TabsTrigger value="pagados">
            Pagados ({paidLoans.length})
          </TabsTrigger>
          <TabsTrigger value="rechazados">
            Rechazados ({rejectedLoans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          {renderLoans(loans)}
        </TabsContent>

        <TabsContent value="pendientes">
          {renderLoans(pendingLoans)}
        </TabsContent>

        <TabsContent value="activos">
          {renderLoans(activeLoans)}
        </TabsContent>

        <TabsContent value="pagados">
          {renderLoans(paidLoans)}
        </TabsContent>

        <TabsContent value="rechazados">
          {renderLoans(rejectedLoans)}
        </TabsContent>
      </Tabs>

      {/* Create Loan Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nuevo Préstamo
            </DialogTitle>
          </DialogHeader>
          <LoanFormAdvanced
            onSubmit={handleSubmit}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Loans;
