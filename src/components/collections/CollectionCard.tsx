import { useState } from 'react';
import { DailyCollection, PaymentStatus } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientStatusBadge } from '@/components/clients/ClientStatusBadge';
import { Check, X, Minus, User, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface CollectionCardProps {
  collection: DailyCollection;
  onPayment: (clienteId: string, prestamoId: string, monto: number, estado: PaymentStatus, comentario?: string) => void;
}

export const CollectionCard = ({ collection, onPayment }: CollectionCardProps) => {
  const [showPartial, setShowPartial] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [comment, setComment] = useState('');
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  const handleFullPayment = () => {
    onPayment(collection.clienteId, collection.prestamo.id, collection.cuotaEsperada, 'pagado', comment || undefined);
    setComment('');
  };

  const handleNoPayment = () => {
    onPayment(collection.clienteId, collection.prestamo.id, 0, 'no_pagado', comment || 'No pagó');
    setComment('');
  };

  const handlePartialPayment = () => {
    const amount = Number(partialAmount);
    if (amount > 0) {
      onPayment(collection.clienteId, collection.prestamo.id, amount, 'parcial', comment || undefined);
      setPartialAmount('');
      setComment('');
      setShowPartial(false);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${collection.pagado ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {collection.cliente.foto ? (
                <img
                  src={collection.cliente.foto}
                  alt={collection.cliente.nombre}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{collection.cliente.nombre}</h3>
              <p className="text-sm text-muted-foreground">{collection.cliente.telefono}</p>
            </div>
          </div>
          <ClientStatusBadge status={collection.cliente.estado} />
        </div>

        <div className="mt-4 rounded-lg bg-muted p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Cuota esperada:</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(collection.cuotaEsperada)}</span>
          </div>
        </div>

        {!collection.pagado && (
          <>
            {!showPartial ? (
              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={handleFullPayment}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Pagó
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPartial(true)}
                >
                  <Minus className="mr-1 h-4 w-4" />
                  Parcial
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleNoPayment}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar comentario</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      placeholder="Ej: Pidió plazo, no estaba en casa..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={() => setShowCommentDialog(false)}>
                      Guardar
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <Input
                  type="number"
                  placeholder="Monto pagado"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handlePartialPayment}>
                    Confirmar
                  </Button>
                  <Button variant="outline" onClick={() => setShowPartial(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {collection.pagado && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-success/10 py-2 text-success">
            <Check className="h-4 w-4" />
            <span className="font-medium">Pagado hoy: {formatCurrency(collection.montoPagado)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
