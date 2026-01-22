import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateLoan } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { Client } from '@/types';

const loanSchema = z.object({
  clienteId: z.string().min(1, 'Selecciona un cliente'),
  montoPrestado: z.number().min(1000, 'El monto mínimo es $1,000'),
  fechaInicio: z.string().min(1, 'Selecciona la fecha de inicio'),
  frecuenciaCobro: z.enum(['diario', 'semanal', 'quincenal']),
  duracionDias: z.number().min(1, 'La duración mínima es 1 día'),
  porcentajeInteres: z.number().min(1, 'El interés mínimo es 1%').max(100, 'El interés máximo es 100%'),
});

type LoanFormData = z.infer<typeof loanSchema>;

interface LoanFormProps {
  clients: Client[];
  onSubmit: (data: LoanFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LoanForm = ({ clients, onSubmit, onCancel, isLoading }: LoanFormProps) => {
  const [preview, setPreview] = useState<{
    totalAPagar: number;
    cuotaPorPago: number;
    numeroPagos: number;
  } | null>(null);

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      clienteId: '',
      montoPrestado: 100000,
      fechaInicio: new Date().toISOString().split('T')[0],
      frecuenciaCobro: 'diario',
      duracionDias: 30,
      porcentajeInteres: 20,
    },
  });

  const watchedValues = form.watch(['montoPrestado', 'porcentajeInteres', 'duracionDias', 'frecuenciaCobro']);

  useEffect(() => {
    const [monto, interes, duracion, frecuencia] = watchedValues;
    if (monto && interes && duracion && frecuencia) {
      const result = calculateLoan(monto, interes, duracion, frecuencia);
      setPreview(result);
    }
  }, [watchedValues]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.nombre} - {client.cedula}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="montoPrestado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto a prestar</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Monto en pesos colombianos</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="porcentajeInteres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje de interés (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Típico: 20-40%</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duracionDias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (días)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="30"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frecuenciaCobro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia de cobro</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="diario">Diario</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                      </SelectContent>
                    </Select>
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
                {isLoading ? 'Creando...' : 'Crear préstamo'}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview Card */}
      <Card className="h-fit border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Resumen del préstamo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {preview && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total a pagar:</span>
                  <span className="font-semibold text-foreground">{formatCurrency(preview.totalAPagar)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cuota por pago:</span>
                  <span className="font-semibold text-primary">{formatCurrency(preview.cuotaPorPago)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Número de pagos:</span>
                  <span className="font-semibold text-foreground">{preview.numeroPagos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ganancia:</span>
                  <span className="font-semibold text-success">
                    {formatCurrency(preview.totalAPagar - form.getValues('montoPrestado'))}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
