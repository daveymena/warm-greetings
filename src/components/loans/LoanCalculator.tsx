import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrency } from '@/context/CurrencyContext';
import { Calculator, Calendar, DollarSign, Percent } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export interface LoanCalculationResult {
    installmentAmount: number;
    totalAmount: number;
    totalInterest: number;
    installments: number;
    firstPaymentDate: Date;
    endDate: Date;
}

export interface LoanInputValues {
    amount: number;
    interestRate: number;
    term: number;
    frequency: string;
    interestType: string;
}

interface LoanCalculatorProps {
    onCalculate?: (result: LoanCalculationResult) => void;
    values: LoanInputValues;
    onChange: (values: LoanInputValues) => void;
}

export const LoanCalculator = ({ onCalculate, values, onChange }: LoanCalculatorProps) => {
    const { formatCurrency } = useCurrency();

    const [result, setResult] = useState<LoanCalculationResult>({
        installmentAmount: 0,
        totalAmount: 0,
        totalInterest: 0,
        installments: 0,
        firstPaymentDate: new Date(),
        endDate: new Date()
    });

    useEffect(() => {
        calculateLoan();
    }, [values]);

    const calculateLoan = () => {
        const amount = Number(values.amount);
        const rate = Number(values.interestRate);
        const term = Number(values.term);

        if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || term <= 0) return;

        let totalInterest = 0;

        // Interest Calculation Logic
        if (values.interestType === 'TOTAL') {
            // Flat rate: 20% means 20% of the total, regardless of time
            totalInterest = amount * (rate / 100);
        } else {
            // Monthly/Simple interest logic (Approximate for visual feedback)
            // If frequency is daily, we generally treat term as number of days
            let months = term;
            if (values.frequency === 'DIARIO') months = term / 30;
            if (values.frequency === 'SEMANAL') months = term / 4.33;
            if (values.frequency === 'QUINCENAL') months = term / 2;

            totalInterest = amount * (rate / 100) * months;
        }

        const totalAmount = amount + totalInterest;
        const installmentAmount = totalAmount / term;

        // Dates calculation
        const today = new Date();
        const firstPayment = new Date(today);
        // Add 1 period
        if (values.frequency === 'DIARIO') firstPayment.setDate(today.getDate() + 1);
        if (values.frequency === 'SEMANAL') firstPayment.setDate(today.getDate() + 7);
        if (values.frequency === 'QUINCENAL') firstPayment.setDate(today.getDate() + 15);
        if (values.frequency === 'MENSUAL') firstPayment.setMonth(today.getMonth() + 1);

        const endDate = new Date(firstPayment);
        if (values.frequency === 'DIARIO') endDate.setDate(firstPayment.getDate() + (term - 1));
        if (values.frequency === 'SEMANAL') endDate.setDate(firstPayment.getDate() + ((term - 1) * 7));
        if (values.frequency === 'QUINCENAL') endDate.setDate(firstPayment.getDate() + ((term - 1) * 15));
        if (values.frequency === 'MENSUAL') endDate.setMonth(firstPayment.getMonth() + (term - 1));

        const newResult = {
            installmentAmount,
            totalAmount,
            totalInterest,
            installments: term,
            firstPaymentDate: firstPayment,
            endDate: endDate
        };

        setResult(newResult);
        if (onCalculate) onCalculate(newResult);
    };

    const handleChange = (field: keyof LoanInputValues, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-background">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-primary">
                    <Calculator className="h-5 w-5" />
                    Simulador de Préstamo
                </CardTitle>
                <CardDescription>
                    Calcula las cuotas y ganancias antes de crear el préstamo
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inputs */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-secondary-foreground">Monto a Prestar</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="number"
                                    value={values.amount}
                                    onChange={(e) => handleChange('amount', Number(e.target.value))}
                                    className="pl-9 font-semibold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Interés (%)</Label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        value={values.interestRate}
                                        onChange={(e) => handleChange('interestRate', Number(e.target.value))}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo Interés</Label>
                                <Select value={values.interestType} onValueChange={(v) => handleChange('interestType', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TOTAL">Total (Fijo)</SelectItem>
                                        <SelectItem value="MENSUAL">Mensual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>N° Cuotas</Label>
                                <Input
                                    type="number"
                                    value={values.term}
                                    onChange={(e) => handleChange('term', Number(e.target.value))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Frecuencia</Label>
                                <Select value={values.frequency} onValueChange={(v) => handleChange('frequency', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DIARIO">Diario</SelectItem>
                                        <SelectItem value="SEMANAL">Semanal</SelectItem>
                                        <SelectItem value="QUINCENAL">Quincenal</SelectItem>
                                        <SelectItem value="MENSUAL">Mensual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Results Display */}
                    <div className="bg-primary/5 rounded-xl p-6 flex flex-col justify-between border border-primary/10">
                        <div className="space-y-6">
                            <div>
                                <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Valor de la Cuota</Label>
                                <div className="text-3xl font-bold text-primary mt-1">
                                    {formatCurrency(result.installmentAmount)}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                    {values.frequency.toLowerCase()} durante {values.term} pagos
                                </div>
                            </div>

                            <Separator className="bg-primary/20" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Total a Cobrar</Label>
                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(result.totalAmount)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Ganancia</Label>
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(result.totalInterest)}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 text-xs space-y-1">
                                <div className="flex justify-between">
                                    <span>Inicio Pagos:</span>
                                    <span className="font-medium">{result.firstPaymentDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fin Pagos:</span>
                                    <span className="font-medium">{result.endDate.toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
