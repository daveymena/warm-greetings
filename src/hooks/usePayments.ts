import { useState, useEffect, useCallback } from 'react';
import { Payment, PaymentStatus } from '@/types';
import { getPayments, addPayment as addPaymentStorage, getPaymentsByLoan, getPaymentsByDate } from '@/lib/storage';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = useCallback(() => {
    const data = getPayments();
    setPayments(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const addPayment = useCallback((paymentData: {
    prestamoId: string;
    clienteId: string;
    monto: number;
    estado: PaymentStatus;
    comentario?: string;
  }) => {
    const newPayment: Payment = {
      ...paymentData,
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    addPaymentStorage(newPayment);
    loadPayments();
    return newPayment;
  }, [loadPayments]);

  const getPaymentsForLoan = useCallback((loanId: string) => {
    return getPaymentsByLoan(loanId);
  }, []);

  const getTodayPayments = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return getPaymentsByDate(today);
  }, []);

  const getTodayTotal = useCallback(() => {
    const todayPayments = getTodayPayments();
    return todayPayments.reduce((sum, p) => sum + p.monto, 0);
  }, [getTodayPayments]);

  return {
    payments,
    loading,
    addPayment,
    getPaymentsForLoan,
    getTodayPayments,
    getTodayTotal,
    refresh: loadPayments,
  };
};
