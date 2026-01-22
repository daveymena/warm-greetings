import { ClientStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

const statusConfig = {
  al_dia: {
    label: 'Al día',
    className: 'bg-success/10 text-success border-success/20',
  },
  retrasado: {
    label: 'Retrasado',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  moroso: {
    label: 'Moroso',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
};
