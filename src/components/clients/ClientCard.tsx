import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientStatusBadge } from './ClientStatusBadge';
import { Phone, MapPin, User, Eye, Edit, Trash2 } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientCard = ({ client, onView, onEdit, onDelete }: ClientCardProps) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {client.foto ? (
                <img
                  src={client.foto}
                  alt={client.nombre}
                  className="h-12 w-12 rounded-full object-cover"
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

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{client.telefono}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{client.direccion}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(client)}>
            <Eye className="mr-1 h-4 w-4" />
            Ver
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(client)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
