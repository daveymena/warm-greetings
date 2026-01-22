import { useState, useEffect, useCallback } from 'react';
import { Client } from '@/types';
import { getClients, addClient as addClientStorage, updateClient as updateClientStorage, deleteClient as deleteClientStorage, calculateClientStatus } from '@/lib/storage';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClients = useCallback(() => {
    const data = getClients();
    // Update status for each client
    const updatedClients = data.map(client => ({
      ...client,
      estado: calculateClientStatus(client.id),
    }));
    setClients(updatedClients);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'estado'>) => {
    const newClient: Client = {
      ...client,
      id: crypto.randomUUID(),
      estado: 'al_dia',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addClientStorage(newClient);
    loadClients();
    return newClient;
  }, [loadClients]);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    updateClientStorage(id, updates);
    loadClients();
  }, [loadClients]);

  const deleteClient = useCallback((id: string) => {
    deleteClientStorage(id);
    loadClients();
  }, [loadClients]);

  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    refresh: loadClients,
  };
};
