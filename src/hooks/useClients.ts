import { useCallback } from 'react';
import { Client } from '@/types';
import { clientsApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calculateClientStatus } from '@/lib/storage';

export const useClients = () => {
    const queryClient = useQueryClient();

    // Load clients using React Query for global cache management
    const { data: rawClients = [], isLoading: loading } = useQuery({
        queryKey: ['clients'],
        queryFn: clientsApi.getAll,
    });

    // Map and calculate status
    const clients: Client[] = (rawClients || []).map((c: any) => ({
        id: c.id,
        nombre: c.name || c.nombre || 'Sin nombre',
        cedula: c.idNumber || c.cedula || '',
        telefono: c.phone || c.telefono || '',
        direccion: c.address || c.direccion || '',
        referenciaNombre: c.references?.name || c.referenciaNombre || '',
        referenciaTelefono: c.references?.phone || c.referenciaTelefono || '',
        estado: calculateClientStatus(c.id),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt
    }));

    const addClientMutation = useMutation({
        mutationFn: (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'estado'>) => {
            const payload = {
                name: clientData.nombre,
                idNumber: clientData.cedula,
                phone: clientData.telefono,
                address: clientData.direccion,
                references: {
                    name: clientData.referenciaNombre,
                    phone: clientData.referenciaTelefono
                }
            };
            return clientsApi.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
        }
    });

    const addClient = useCallback(async (data: any) => {
        return addClientMutation.mutateAsync(data);
    }, [addClientMutation]);

    const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
        console.warn('Update not implemented in API');
    }, []);

    const deleteClient = useCallback(async (id: string) => {
        console.warn('Delete not implemented in API');
    }, []);

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
        refresh: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
    };
};
