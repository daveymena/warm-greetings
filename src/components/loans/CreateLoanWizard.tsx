import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { clientsApi } from '@/lib/api'; // Import clientsApi
import { LoanCalculator, LoanCalculationResult } from '@/components/loans/LoanCalculator';
import { toast } from 'sonner';
import { User, DollarSign, CheckCircle2, ChevronRight, ChevronLeft, Search, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrency } from '@/context/CurrencyContext';

interface CreateLoanWizardProps {
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CreateLoanWizard({ onSubmit, onCancel, isLoading }: CreateLoanWizardProps) {
    const [step, setStep] = useState(1);
    const { formatCurrency } = useCurrency();

    // Use React Query to fetch clients from API (REAL DB)
    const { data: clients = [] } = useQuery({
        queryKey: ['clients'],
        queryFn: clientsApi.getAll
    });

    // State for Client Selection
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [isNewClient, setIsNewClient] = useState(false);
    const [newClientData, setNewClientData] = useState({
        name: '',
        phone: '',
        idNumber: '', // CC
        email: '',
        address: '',
        occupation: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // State for Loan Configuration
    const [loanConfig, setLoanConfig] = useState<any>({
        amount: 100000,
        interestRate: 20,
        term: 24,
        frequency: 'DIARIO',
        interestType: 'TOTAL',
        purpose: ''
    });

    const [calculationResult, setCalculationResult] = useState<LoanCalculationResult | null>(null);

    // --- Handlers ---

    const handleClientSelect = (clientId: string) => {
        setSelectedClientId(clientId);
        setIsNewClient(false);
    };

    const handleNewClientChange = (field: string, value: string) => {
        setNewClientData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep1 = () => {
        if (isNewClient) {
            if (!newClientData.name || !newClientData.phone || !newClientData.idNumber) {
                toast.error('Complete los datos obligatorios del cliente (Nombre, Teléfono, Cédula)');
                return false;
            }
        } else {
            if (!selectedClientId) {
                toast.error('Seleccione un cliente existente o cree uno nuevo');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        if (step === 2) setStep(3);
    };

    const handleSubmit = async () => {
        if (!calculationResult) return;

        const payload = {
            // Logic for client will be handled by parent or here?
            // Let's pass everything to parent for maximum flexibility
            client: isNewClient ? { isNew: true, ...newClientData } : { isNew: false, id: selectedClientId },
            loan: {
                ...loanConfig,
                installmentAmount: calculationResult.installmentAmount,
                totalAmount: calculationResult.totalAmount,
                // Backend expects strict numbers
                amount: Number(loanConfig.amount),
                interestRate: Number(loanConfig.interestRate),
                term: Number(loanConfig.term)
            }
        };

        await onSubmit(payload);
    };

    // Filter clients safely
    const filteredClients = Array.isArray(clients) ? clients.filter((c: any) =>
        (c.name || c.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.idNumber || c.cedula || c.idNumber || '').includes(searchTerm)
    ) : [];

    return (
        <div className="space-y-6">
            {/* Stepper Header */}
            <div className="flex justify-between items-center px-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-all
                    ${step === s ? 'bg-primary text-primary-foreground shadow-lg scale-110' :
                                step > s ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                `}>
                            {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                        </div>
                        <span className={`text-sm font-medium hidden sm:block ${step === s ? 'text-primary' : 'text-muted-foreground'}`}>
                            {s === 1 ? 'Cliente' : s === 2 ? 'Configuración' : 'Confirmar'}
                        </span>
                        {s < 3 && <div className="h-[2px] w-8 bg-muted ml-2 hidden sm:block" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Client Selection */}
            {step === 1 && (
                <Card className="border-none shadow-md animate-in slide-in-from-right-10 fade-in duration-300">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex gap-4 mb-4">
                            <Button
                                variant={!isNewClient ? "default" : "outline"}
                                onClick={() => setIsNewClient(false)}
                                className="flex-1"
                            >
                                <Search className="mr-2 h-4 w-4" /> Buscar Cliente
                            </Button>
                            <Button
                                variant={isNewClient ? "default" : "outline"}
                                onClick={() => { setIsNewClient(true); setSelectedClientId(''); }}
                                className="flex-1"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                            </Button>
                        </div>

                        {!isNewClient ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nombre o cédula..."
                                        className="pl-9"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <ScrollArea className="h-[300px] border rounded-md p-2">
                                    {filteredClients.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">No se encontraron clientes</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {filteredClients.map((client: any) => (
                                                <div
                                                    key={client.id}
                                                    onClick={() => handleClientSelect(client.id)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50 flex items-center justify-between
                                                ${selectedClientId === client.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card'}
                                            `}
                                                >
                                                    <div>
                                                        <p className="font-medium text-sm">{client.name || client.nombre}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {client.idNumber || client.cedula} • {client.phone || client.telefono}</p>
                                                    </div>
                                                    {selectedClientId === client.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in">
                                <div className="space-y-2">
                                    <Label>Nombre Completo *</Label>
                                    <Input value={newClientData.name} onChange={(e) => handleNewClientChange('name', e.target.value)} placeholder="Ej: Juan Pérez" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cédula / ID *</Label>
                                    <Input value={newClientData.idNumber} onChange={(e) => handleNewClientChange('idNumber', e.target.value)} placeholder="Ej: 12345678" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Teléfono *</Label>
                                    <Input value={newClientData.phone} onChange={(e) => handleNewClientChange('phone', e.target.value)} placeholder="+57 300 123 4567" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ocupación</Label>
                                    <Input value={newClientData.occupation} onChange={(e) => handleNewClientChange('occupation', e.target.value)} placeholder="Ej: Comerciante" />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>Dirección</Label>
                                    <Input value={newClientData.address} onChange={(e) => handleNewClientChange('address', e.target.value)} placeholder="Dirección completa" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Calculator */}
            {step === 2 && (
                <div className="animate-in slide-in-from-right-10 fade-in duration-300">
                    <LoanCalculator
                        values={loanConfig}
                        onChange={setLoanConfig}
                        onCalculate={(res) => setCalculationResult(res)}
                    />
                </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && calculationResult && (
                <Card className="border-none shadow-md animate-in slide-in-from-right-10 fade-in duration-300">
                    <CardContent className="p-6 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold">Confirmar Préstamo</h3>
                            <p className="text-muted-foreground text-sm">Verifica los detalles antes de crear</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-xl bg-muted/40 space-y-3">
                                <h4 className="font-semibold flex items-center gap-2"><User className="h-4 w-4" /> Cliente</h4>
                                <div className="space-y-1">
                                    <p><span className="text-muted-foreground">Nombre:</span> {isNewClient ? newClientData.name : filteredClients.find((c: any) => c.id === selectedClientId)?.name}</p>
                                    <p><span className="text-muted-foreground">ID:</span> {isNewClient ? newClientData.idNumber : filteredClients.find((c: any) => c.id === selectedClientId)?.idNumber}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-muted/40 space-y-3">
                                <h4 className="font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Condiciones</h4>
                                <div className="space-y-1">
                                    <p><span className="text-muted-foreground">Monto:</span> {formatCurrency(calculationResult.installmentAmount * calculationResult.installments - calculationResult.totalInterest)}</p>
                                    <p><span className="text-muted-foreground">Interés:</span> {formatCurrency(calculationResult.totalInterest)}</p>
                                    <p><span className="text-muted-foreground">Total:</span> {formatCurrency(calculationResult.totalAmount)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
                            <p className="text-muted-foreground text-sm">Cuota Estimada</p>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(calculationResult.installmentAmount)}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pago programado {loanConfig.frequency.toLowerCase()} durante {loanConfig.term} pagos
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Footer Controls */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="ghost" onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
                    {step === 1 ? 'Cancelar' : <><ChevronLeft className="mr-2 h-4 w-4" /> Atrás</>}
                </Button>
                <Button onClick={step === 3 ? handleSubmit : handleNext} disabled={isLoading}>
                    {step === 3 ? (isLoading ? 'Creando...' : 'Confirmar y Crear') : <><ChevronRight className="ml-2 h-4 w-4" /> Siguiente</>}
                </Button>
            </div>
        </div>
    );
}
