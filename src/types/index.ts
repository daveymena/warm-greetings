export type ClientStatus = 'al_dia' | 'retrasado' | 'moroso';

export type PaymentFrequency = 'diario' | 'semanal' | 'quincenal';

export type PaymentStatus = 'pagado' | 'no_pagado' | 'parcial';

export type UserRole = 'admin' | 'cobrador';

export interface Client {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  foto?: string;
  referenciaNombre: string;
  referenciaTelefono: string;
  estado: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  clienteId: string;
  montoPrestado: number;
  fechaInicio: string;
  frecuenciaCobro: PaymentFrequency;
  duracionDias: number;
  porcentajeInteres: number;
  totalAPagar: number;
  cuotaPorPago: number;
  cobradorId?: string;
  estado: 'activo' | 'pagado' | 'vencido';
  createdAt: string;
}

export interface Payment {
  id: string;
  prestamoId: string;
  clienteId: string;
  fecha: string;
  monto: number;
  estado: PaymentStatus;
  comentario?: string;
  createdAt: string;
}

export interface DailyCollection {
  clienteId: string;
  cliente: Client;
  prestamo: Loan;
  cuotaEsperada: number;
  pagado: boolean;
  montoPagado: number;
}

export interface DashboardStats {
  totalPrestado: number;
  totalCobradoHoy: number;
  deudaPendiente: number;
  clientesActivos: number;
  clientesMorosos: number;
  clientesRetrasados: number;
}
