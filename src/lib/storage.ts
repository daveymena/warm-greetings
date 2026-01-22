import { Client, Loan, Payment } from '@/types';

const STORAGE_KEYS = {
  clients: 'credicontrol_clients',
  loans: 'credicontrol_loans',
  payments: 'credicontrol_payments',
};

// Clients
export const getClients = (): Client[] => {
  const data = localStorage.getItem(STORAGE_KEYS.clients);
  return data ? JSON.parse(data) : [];
};

export const saveClients = (clients: Client[]): void => {
  localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
};

export const addClient = (client: Client): void => {
  const clients = getClients();
  clients.push(client);
  saveClients(clients);
};

export const updateClient = (id: string, updates: Partial<Client>): void => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates, updatedAt: new Date().toISOString() };
    saveClients(clients);
  }
};

export const deleteClient = (id: string): void => {
  const clients = getClients().filter(c => c.id !== id);
  saveClients(clients);
};

// Loans
export const getLoans = (): Loan[] => {
  const data = localStorage.getItem(STORAGE_KEYS.loans);
  return data ? JSON.parse(data) : [];
};

export const saveLoans = (loans: Loan[]): void => {
  localStorage.setItem(STORAGE_KEYS.loans, JSON.stringify(loans));
};

export const addLoan = (loan: Loan): void => {
  const loans = getLoans();
  loans.push(loan);
  saveLoans(loans);
};

export const updateLoan = (id: string, updates: Partial<Loan>): void => {
  const loans = getLoans();
  const index = loans.findIndex(l => l.id === id);
  if (index !== -1) {
    loans[index] = { ...loans[index], ...updates };
    saveLoans(loans);
  }
};

// Payments
export const getPayments = (): Payment[] => {
  const data = localStorage.getItem(STORAGE_KEYS.payments);
  return data ? JSON.parse(data) : [];
};

export const savePayments = (payments: Payment[]): void => {
  localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));
};

export const addPayment = (payment: Payment): void => {
  const payments = getPayments();
  payments.push(payment);
  savePayments(payments);
};

export const getPaymentsByLoan = (loanId: string): Payment[] => {
  return getPayments().filter(p => p.prestamoId === loanId);
};

export const getPaymentsByDate = (date: string): Payment[] => {
  return getPayments().filter(p => p.fecha.startsWith(date));
};

// Calculate loan details
export const calculateLoan = (
  montoPrestado: number,
  porcentajeInteres: number,
  duracionDias: number,
  frecuencia: 'diario' | 'semanal' | 'quincenal'
): { totalAPagar: number; cuotaPorPago: number; numeroPagos: number } => {
  const totalAPagar = montoPrestado * (1 + porcentajeInteres / 100);
  
  let numeroPagos: number;
  switch (frecuencia) {
    case 'diario':
      numeroPagos = duracionDias;
      break;
    case 'semanal':
      numeroPagos = Math.ceil(duracionDias / 7);
      break;
    case 'quincenal':
      numeroPagos = Math.ceil(duracionDias / 15);
      break;
  }
  
  const cuotaPorPago = totalAPagar / numeroPagos;
  
  return { totalAPagar, cuotaPorPago, numeroPagos };
};

// Get client status based on payments
export const calculateClientStatus = (clientId: string): 'al_dia' | 'retrasado' | 'moroso' => {
  const loans = getLoans().filter(l => l.clienteId === clientId && l.estado === 'activo');
  if (loans.length === 0) return 'al_dia';
  
  const payments = getPayments();
  const today = new Date();
  
  for (const loan of loans) {
    const loanPayments = payments.filter(p => p.prestamoId === loan.id);
    const paidAmount = loanPayments.reduce((sum, p) => sum + p.monto, 0);
    
    const startDate = new Date(loan.fechaInicio);
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let expectedPayments: number;
    switch (loan.frecuenciaCobro) {
      case 'diario':
        expectedPayments = daysSinceStart;
        break;
      case 'semanal':
        expectedPayments = Math.floor(daysSinceStart / 7);
        break;
      case 'quincenal':
        expectedPayments = Math.floor(daysSinceStart / 15);
        break;
    }
    
    const expectedAmount = expectedPayments * loan.cuotaPorPago;
    const difference = expectedAmount - paidAmount;
    
    if (difference > loan.cuotaPorPago * 3) return 'moroso';
    if (difference > loan.cuotaPorPago) return 'retrasado';
  }
  
  return 'al_dia';
};

// Export data
export const exportData = () => {
  return {
    clients: getClients(),
    loans: getLoans(),
    payments: getPayments(),
    exportedAt: new Date().toISOString(),
  };
};

// Import data
export const importData = (data: { clients: Client[]; loans: Loan[]; payments: Payment[] }) => {
  saveClients(data.clients);
  saveLoans(data.loans);
  savePayments(data.payments);
};
