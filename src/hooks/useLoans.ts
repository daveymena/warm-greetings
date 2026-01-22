import { useState, useEffect, useCallback } from 'react';
import { Loan, PaymentFrequency } from '@/types';
import { getLoans, addLoan as addLoanStorage, updateLoan as updateLoanStorage, calculateLoan, getPaymentsByLoan } from '@/lib/storage';

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLoans = useCallback(() => {
    const data = getLoans();
    setLoans(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const addLoan = useCallback((loanData: {
    clienteId: string;
    montoPrestado: number;
    fechaInicio: string;
    frecuenciaCobro: PaymentFrequency;
    duracionDias: number;
    porcentajeInteres: number;
    cobradorId?: string;
  }) => {
    const { totalAPagar, cuotaPorPago } = calculateLoan(
      loanData.montoPrestado,
      loanData.porcentajeInteres,
      loanData.duracionDias,
      loanData.frecuenciaCobro
    );

    const newLoan: Loan = {
      ...loanData,
      id: crypto.randomUUID(),
      totalAPagar,
      cuotaPorPago,
      estado: 'activo',
      createdAt: new Date().toISOString(),
    };

    addLoanStorage(newLoan);
    loadLoans();
    return newLoan;
  }, [loadLoans]);

  const updateLoan = useCallback((id: string, updates: Partial<Loan>) => {
    updateLoanStorage(id, updates);
    loadLoans();
  }, [loadLoans]);

  const getLoansByClient = useCallback((clientId: string) => {
    return loans.filter(l => l.clienteId === clientId);
  }, [loans]);

  const getActiveLoans = useCallback(() => {
    return loans.filter(l => l.estado === 'activo');
  }, [loans]);

  const getLoanProgress = useCallback((loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return { paid: 0, remaining: 0, percentage: 0 };

    const payments = getPaymentsByLoan(loanId);
    const paid = payments.reduce((sum, p) => sum + p.monto, 0);
    const remaining = loan.totalAPagar - paid;
    const percentage = (paid / loan.totalAPagar) * 100;

    return { paid, remaining, percentage };
  }, [loans]);

  return {
    loans,
    loading,
    addLoan,
    updateLoan,
    getLoansByClient,
    getActiveLoans,
    getLoanProgress,
    refresh: loadLoans,
  };
};
