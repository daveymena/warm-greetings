import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientForm } from '@/components/clients/ClientForm';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Search, Users, Filter, Download, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.cedula.includes(searchQuery) ||
    client.telefono.includes(searchQuery)
  );

  const stats = {
    total: clients.length,
    alDia: clients.filter(c => c.estado === 'al_dia').length,
    retrasados: clients.filter(c => c.estado === 'retrasado').length,
    morosos: clients.filter(c => c.estado === 'moroso').length,
  };

  const handleSubmit = (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'estado'>) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
      toast.success('Cliente actualizado correctamente');
    } else {
      addClient(data);
      toast.success('Cliente creado correctamente');
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (deletingClient) {
      deleteClient(deletingClient.id);
      toast.success('Cliente eliminado correctamente');
      setDeletingClient(null);
    }
  };

  return (
    <MainLayout title="Clientes" subtitle={`${clients.length} clientes registrados`}>
      <div className="space-y-6 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="stat-card stat-card-neutral">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card stat-card-neutral">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Al Día</p>
                  <p className="text-3xl font-bold text-success">{stats.alDia}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card stat-card-neutral">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Retrasados</p>
                  <p className="text-3xl font-bold text-warning">{stats.retrasados}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                  <Users className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="stat-card stat-card-neutral">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Morosos</p>
                  <p className="text-3xl font-bold text-destructive">{stats.morosos}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <Users className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, cédula o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-2 border-border/50 focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-xl">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-primary rounded-xl shadow-lg shadow-primary/25">
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <Card className="card-glass">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay clientes</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'No se encontraron resultados' : 'Comienza agregando tu primer cliente'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowForm(true)} className="bg-gradient-primary">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Agregar Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClients.map((client, index) => (
              <div key={client.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ClientCard
                  client={client}
                  onView={setViewingClient}
                  onEdit={handleEdit}
                  onDelete={setDeletingClient}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingClient(null);
      }}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            client={editingClient || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingClient(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Client Dialog */}
      <Dialog open={!!viewingClient} onOpenChange={() => setViewingClient(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Detalles del Cliente</DialogTitle>
          </DialogHeader>
          {viewingClient && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-semibold">{viewingClient.nombre}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cédula</p>
                  <p className="font-semibold">{viewingClient.cedula}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-semibold">{viewingClient.telefono}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-semibold">{viewingClient.direccion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Referencia</p>
                  <p className="font-semibold">{viewingClient.referenciaNombre}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tel. Referencia</p>
                  <p className="font-semibold">{viewingClient.referenciaTelefono}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingClient} onOpenChange={() => setDeletingClient(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cliente
              {deletingClient && ` "${deletingClient.nombre}"`} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Clients;