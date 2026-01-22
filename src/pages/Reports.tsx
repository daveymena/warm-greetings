import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  FileText,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { DateRange } from 'react-day-picker';

const Reports = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportType, setReportType] = useState('overview');

  // Mock data - en producción vendría del backend
  const mockData = {
    totalLoans: 45,
    totalAmount: 125000000,
    activeLoans: 32,
    paidLoans: 10,
    overdueLoans: 3,
    totalClients: 38,
    newClientsThisMonth: 8,
    averageLoanAmount: 2777778,
    collectionRate: 94.2,
    monthlyGrowth: 12.5
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const loansByStatus = [
    { status: 'Activos', count: mockData.activeLoans, color: 'bg-green-500' },
    { status: 'Pagados', count: mockData.paidLoans, color: 'bg-blue-500' },
    { status: 'Vencidos', count: mockData.overdueLoans, color: 'bg-red-500' }
  ];

  const monthlyData = [
    { month: 'Ene', loans: 8, amount: 22000000 },
    { month: 'Feb', loans: 12, amount: 31000000 },
    { month: 'Mar', loans: 15, amount: 42000000 },
    { month: 'Abr', loans: 18, amount: 48000000 },
    { month: 'May', loans: 22, amount: 58000000 },
    { month: 'Jun', loans: 25, amount: 65000000 }
  ];

  return (
    <MainLayout title="Reportes y Análisis" subtitle="Insights de tu negocio financiero">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overview">Resumen General</SelectItem>
            <SelectItem value="loans">Análisis de Préstamos</SelectItem>
            <SelectItem value="clients">Análisis de Clientes</SelectItem>
            <SelectItem value="collections">Análisis de Cobros</SelectItem>
          </SelectContent>
        </Select>
        
        <DatePickerWithRange
          date={dateRange}
          onDateChange={setDateRange}
          className="w-full