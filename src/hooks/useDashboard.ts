import { useMemo } from 'react';
import { DashboardStats } from '@/types';
import { getClients, getLoans, getPayments, calculateClientStatus } from '@/lib/storage';

export const useDashboard = () => {
  const stats = useMemo((): DashboardStats => {
    const clients = getClients();
    const loans = getLoans();
    const payments = getPayments();

    const activeLoans = loans.filter(l => l.estado === 'activo');
    const totalPrestado = activeLoans.reduce((sum, l) => sum + l.montoPrestado, 0);

    const today = new Date().toISOString().split('T')[0];
    const todayPayments = payments.filter(p => p.fecha.startsWith(today));
    const totalCobradoHoy = todayPayments.reduce((sum, p) => sum + p.monto, 0);

    const totalAPagar = activeLoans.reduce((sum, l) => sum + l.totalAPagar, 0);
    const totalPagado = payments.reduce((sum, p) => sum + p.monto, 0);
    const deudaPendiente = totalAPagar - totalPagado;

    const clientsWithActiveLoans = new Set(activeLoans.map(l => l.clienteId));
    const clientesActivos = clientsWithActiveLoans.size;

    let clientesMorosos = 0;
    let clientesRetrasados = 0;

    clients.forEach(client => {
      const status = calculateClientStatus(client.id);
      if (status === 'moroso') clientesMorosos++;
      else if (status === 'retrasado') clientesRetrasados++;
    });

    return {
      totalPrestado,
      totalCobradoHoy,
      deudaPendiente: Math.max(0, deudaPendiente),
      clientesActivos,
      clientesMorosos,
      clientesRetrasados,
    };
  }, []);

  return { stats };
};
