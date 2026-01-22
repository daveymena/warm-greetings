import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Client } from '@/types';

const clientSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  cedula: z.string().min(5, 'La cédula debe tener al menos 5 caracteres').max(20),
  telefono: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').max(20),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres').max(200),
  foto: z.string().optional(),
  referenciaNombre: z.string().min(2, 'El nombre de referencia debe tener al menos 2 caracteres').max(100),
  referenciaTelefono: z.string().min(7, 'El teléfono de referencia debe tener al menos 7 dígitos').max(20),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ClientForm = ({ client, onSubmit, onCancel, isLoading }: ClientFormProps) => {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nombre: client?.nombre || '',
      cedula: client?.cedula || '',
      telefono: client?.telefono || '',
      direccion: client?.direccion || '',
      foto: client?.foto || '',
      referenciaNombre: client?.referenciaNombre || '',
      referenciaTelefono: client?.referenciaTelefono || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cedula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cédula / ID</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="3001234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Calle 123 #45-67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenciaNombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de referencia</FormLabel>
                <FormControl>
                  <Input placeholder="María García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referenciaTelefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de referencia</FormLabel>
                <FormControl>
                  <Input placeholder="3009876543" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Guardando...' : client ? 'Actualizar' : 'Crear cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
