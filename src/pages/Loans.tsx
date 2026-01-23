import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, MoreHorizontal, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { loansApi, clientsApi } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import { CreateLoanWizard } from '@/components/loans/CreateLoanWizard';
import { toast } from 'sonner';

const Loans = () => {
  const { formatCurrency } = useCurrency();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: loansApi.getAll,
  });

  const handleCreateLoan = async (data: any) => {
    setIsSubmitting(true);
    try {
      let clientId = data.client.id;

      // 1. Create client if needed
      if (data.client.isNew) {
        const { name, phone, idNumber, email, address, occupation } = data.client;
        const newClient = await clientsApi.create({
          name, phone, idNumber, email, address, occupation, income: 0
        });
        clientId = newClient.id;
      }

      // 2. Create loan
      await loansApi.create({
        ...data.loan,
        clientId
      });

      toast.success('Préstamo creado exitosamente');
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    } catch (error: any) {
      console.error(error);
      toast.error('Error al crear el préstamo: ' + (error.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLoans = Array.isArray(loans) ? loans.filter((loan: any) =>
    loan.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'ACTIVE': 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200',
      'PENDING': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200',
      'VENCIDO': 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200',
      'PAID': 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200',
    };
    return <Badge variant="outline" className={styles[status] || 'bg-gray-100'}>{status}</Badge>;
  };

  return (
    <MainLayout title="Gestión de Préstamos" subtitle="Administra tu cartera de créditos">
      <div className="space-y-6 animate-fade-in">

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-card p-4 rounded-xl shadow-sm border">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar préstamo..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
            <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Préstamo
            </Button>
          </div>
        </div>

        {/* Create Loan Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Préstamo</DialogTitle>
              <DialogDescription>
                Configura los términos del crédito y asigna un cliente.
              </DialogDescription>
            </DialogHeader>
            <CreateLoanWizard
              onSubmit={handleCreateLoan}
              onCancel={() => setIsCreateOpen(false)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Loans Table */}
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Préstamo ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      Cargando préstamos...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No se encontraron préstamos. ¡Crea el primero!
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan: any) => (
                  <TableRow key={loan.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-xs font-medium">
                      {loan.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{loan.client?.name || loan.Client?.name}</span>
                        <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted w-fit mt-0.5">
                          {loan.client?.idNumber || 'Sin ID'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {formatCurrency(loan.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary">
                          {formatCurrency((loan.totalAmount || loan.amount) - (loan.totalPaid || 0))}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          de {formatCurrency(loan.totalAmount || loan.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs capitalize">
                      {loan.frequency?.toLowerCase()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(loan.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Generar Paz y Salvo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Loans;
