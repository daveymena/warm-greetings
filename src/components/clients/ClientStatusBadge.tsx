import { ClientStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ClientStatusBadgeProps {
  status: ClientStatus;
}

const statusConfig = {
  al_dia: {
    label: 'Al día',
    className: 'badge-success',
    icon: CheckCircle,
  },
  retrasado: {
    label: 'Retrasado',
    className: 'badge-warning',
    icon: Clock,
  },
  moroso: {
    label: 'Moroso',
    className: 'badge-danger',
    icon: AlertTriangle,
  },
};

export const ClientStatusBadge = ({ status }: ClientStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn('badge-status', config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
};