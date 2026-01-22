import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaymentDaySelector } from '@/components/ui/payment-day-selector';
import {
  DollarSign,
  User,
  Calendar,
  Percent,
  Calculator,
  FileText,
  Phone,
  MapPin,
  CreditCard,
  Briefcase,
  Search,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useClients } from '@/hooks/useClients';

interface LoanFormData {
  // Client info
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientIdNumber: string;
  clientIdType: string;
  clientOccupation: string;
  clientIncome: number;

  // Loan info
  amount: number;
  interestRate: number;
  term: number;
  paymentDay: number;
  purpose: string;

  // Calculated fields
  monthlyPayment: number;
  totalAmount: number;
}

interface LoanFormAdvancedProps {
  onSubmit: (data: LoanFormData) => void;
  loading?: boolean;
}

export function LoanFormAdvanced({ onSubmit, loading = false }: LoanFormAdvancedProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    clientId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    clientIdNumber: '',
    clientIdType: 'CC',
    clientOccupation: '',
    clientIncome: 0,
    amount: 0,
    interestRate: 15,
    term: 12,
    paymentDay: 15,
    purpose: '',
    monthlyPayment: 0,
    totalAmount: 0
  });

  const { clients } = useClients();
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  // Calculate loan details when amount, rate, or term changes
  useEffect(() => {
    if (formData.amount > 0 && formData.interestRate > 0 && formData.term > 0) {
      const monthlyRate = formData.interestRate / 100 / 12;
      const monthlyPayment = formData.amount * (monthlyRate * Math.pow(1 + monthlyRate, formData.term)) /
        (Math.pow(1 + monthlyRate, formData.term) - 1);
      const totalAmount = monthlyPayment * formData.term;

      setFormData(prev => ({
        ...prev,
        monthlyPayment: Math.round(monthlyPayment),
        totalAmount: Math.round(totalAmount)
      }));
    }
  }, [formData.amount, formData.interestRate, formData.term]);

  const handleInputChange = (field: keyof LoanFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClientId(clientId);
      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: client.nombre,
        clientPhone: client.telefono,
        clientAddress: client.direccion || '',
        clientIdNumber: client.cedula,
        // Fill other fields with defaults or available data
        clientEmail: '',
        clientOccupation: '',
        clientIncome: 0,
      }));
    }
  };

  const clearSelectedClient = () => {
    setSelectedClientId('');
    setFormData(prev => ({
      ...prev,
      clientId: '',
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      clientIdNumber: '',
      clientEmail: '',
      clientOccupation: '',
      clientIncome: 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.clientName.trim()) {
      toast.error('El nombre del cliente es requerido');
      return;
    }

    if (!formData.clientPhone.trim()) {
      toast.error('El teléfono del cliente es requerido');
      return;
    }

    if (!formData.clientIdNumber.trim()) {
      toast.error('El número de identificación es requerido');
      return;
    }

    if (formData.amount <= 0) {
      toast.error('El monto del préstamo debe ser mayor a 0');
      return;
    }

    if (formData.interestRate <= 0) {
      toast.error('La tasa de interés debe ser mayor a 0');
      return;
    }

    if (formData.term <= 0) {
      toast.error('El plazo debe ser mayor a 0');
      return;
    }

    onSubmit(formData);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
              <CardDescription>
                Datos personales y de contacto del solicitante
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={!isExistingClient ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsExistingClient(false);
                  clearSelectedClient();
                }}
              >
                Nuevo
              </Button>
              <Button
                type="button"
                variant={isExistingClient ? "default" : "outline"}
                size="sm"
                onClick={() => setIsExistingClient(true)}
              >
                Existente
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isExistingClient && (
            <div className="space-y-2 mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <Label className="text-primary font-bold">Seleccionar Cliente Registrado</Label>
              <div className="flex gap-2">
                <Select value={selectedClientId} onValueChange={handleSelectClient}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Busca un cliente por nombre o cédula..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.nombre} ({client.cedula})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedClientId && (
                  <Button type="button" variant="ghost" size="icon" onClick={clearSelectedClient}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre Completo *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Ej: Juan Pérez García"
                required
                disabled={isExistingClient && !!selectedClientId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono *</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                placeholder="Ej: +57 300 123 4567"
                required
                disabled={isExistingClient && !!selectedClientId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                placeholder="cliente@email.com"
                disabled={isExistingClient && !!selectedClientId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientOccupation">Ocupación</Label>
              <Input
                id="clientOccupation"
                value={formData.clientOccupation}
                onChange={(e) => handleInputChange('clientOccupation', e.target.value)}
                placeholder="Ej: Comerciante, Empleado, etc."
                disabled={isExistingClient && !!selectedClientId}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientIdType">Tipo de Identificación</Label>
              <Select
                value={formData.clientIdType}
                onValueChange={(value) => handleInputChange('clientIdType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                  <SelectItem value="PP">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientIdNumber">Número de Identificación *</Label>
              <Input
                id="clientIdNumber"
                value={formData.clientIdNumber}
                onChange={(e) => handleInputChange('clientIdNumber', e.target.value)}
                placeholder="Ej: 12345678"
                required
                disabled={isExistingClient && !!selectedClientId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientIncome">Ingresos Mensuales</Label>
              <Input
                id="clientIncome"
                type="number"
                value={formData.clientIncome || ''}
                onChange={(e) => handleInputChange('clientIncome', Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Dirección</Label>
            <Textarea
              id="clientAddress"
              value={formData.clientAddress}
              onChange={(e) => handleInputChange('clientAddress', e.target.value)}
              placeholder="Dirección completa del cliente"
              rows={2}
              disabled={isExistingClient && !!selectedClientId}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loan Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Información del Préstamo
          </CardTitle>
          <CardDescription>
            Detalles financieros del préstamo solicitado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Monto Solicitado *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                placeholder="0"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Tasa de Interés (% anual) *</Label>
              <Input
                id="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                placeholder="15"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Plazo (meses) *</Label>
              <Input
                id="term"
                type="number"
                value={formData.term}
                onChange={(e) => handleInputChange('term', Number(e.target.value))}
                placeholder="12"
                min="1"
                max="60"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Propósito del Préstamo</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              placeholder="Ej: Capital de trabajo, compra de mercancía, mejoras al negocio..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Day Selector */}
      <PaymentDaySelector
        value={formData.paymentDay}
        onChange={(day) => handleInputChange('paymentDay', day)}
      />

      {/* Loan Summary */}
      {formData.amount > 0 && formData.monthlyPayment > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Resumen del Préstamo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <p className="text-sm text-muted-foreground">Cuota Mensual</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(formData.monthlyPayment)}
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <p className="text-sm text-muted-foreground">Total a Pagar</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(formData.totalAmount)}
                </p>
              </div>

              <div className="text-center p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <p className="text-sm text-muted-foreground">Intereses</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(formData.totalAmount - formData.amount)}
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <Calendar className="inline h-4 w-4 mr-1" />
                <strong>Fecha de pago:</strong> Día {formData.paymentDay} de cada mes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Procesando...' : 'Crear Préstamo'}
        </Button>
      </div>
    </form>
  );
}