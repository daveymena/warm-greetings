import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientStatusBadge } from './ClientStatusBadge';
import { Phone, MapPin, User, Eye, Edit, Trash2, MessageCircle } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientCard = ({ client, onView, onEdit, onDelete }: ClientCardProps) => {
  return (
    <Card className="card-hover overflow-hidden border-0 shadow-md bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-lg shadow-primary/20">
              {client.foto ? (
                <img
                  src={client.foto}
                  alt={client.nombre}
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : (
                <User className="h-6 w-6" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{client.nombre}</h3>
              <p className="text-sm text-muted-foreground">CC: {client.cedula}</p>
            </div>
          </div>
          <ClientStatusBadge status={client.estado} />
        </div>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
              <Phone className="h-4 w-4" />
            </div>
            <span>{client.telefono}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="truncate">{client.direccion}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30" 
            onClick={() => onView(client)}
          >
            <Eye className="mr-1.5 h-4 w-4" />
            Ver
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            onClick={() => onEdit(client)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
            onClick={() => onDelete(client)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};