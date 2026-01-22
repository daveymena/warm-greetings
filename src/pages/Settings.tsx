import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Percent, 
  Calendar,
  Shield,
  Bell,
  Save,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Configuración de la empresa
  const [companySettings, setCompanySettings] = useState({
    name: 'RapiCrédito',
    description: 'Soluciones financieras rápidas y confiables',
    address: '',
    phone: '',
    email: '',
    website: '',
    logo: ''
  });

  // Configuración de préstamos
  const [loanSettings, setLoanSettings] = useState({
    defaultInterestRate: 15,
    minAmount: 100000,
    maxAmount: 5000000,
    defaultTerm: 12,
    maxTerm: 36,
    requireGuarantee: false,
    autoApproval: false,
    autoApprovalLimit: 1000000
  });

  // Configuración de notificaciones
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    overdueAlerts: true,
    newLoanAlerts: true
  });

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      // Aquí se guardarían los datos en el backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Configuración de empresa guardada');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLoans = async () => {
    setLoading(true);
    try {
      // Aquí se guardarían los datos en el backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Configuración de préstamos guardada');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // Aquí se guardarían los datos en el backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      toast.success('Configuración de notificaciones guardada');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Configuración" subtitle="Personaliza tu negocio de préstamos">
      <div className="space-y-6">
        {/* Información de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información de la Empresa
            </CardTitle>
            <CardDescription>
              Configura los datos básicos de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nombre de la Empresa</Label>
                <Input
                  id="company-name"
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                  placeholder="Ej: Mi Empresa de Créditos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email de Contacto</Label>
                <Input
                  id="company-email"
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                  placeholder="contacto@miempresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone">Teléfono</Label>
                <Input
                  id="company-phone"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                  placeholder="+57 300 123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-website">Sitio Web</Label>
                <Input
                  id="company-website"
                  value={companySettings.website}
                  onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                  placeholder="https://miempresa.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-description">Descripción del Negocio</Label>
              <Textarea
                id="company-description"
                value={companySettings.description}
                onChange={(e) => setCompanySettings({...companySettings, description: e.target.value})}
                placeholder="Describe tu negocio de préstamos..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Dirección</Label>
              <Textarea
                id="company-address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                placeholder="Dirección completa de tu oficina..."
                rows={2}
              />
            </div>
            <Button onClick={handleSaveCompany} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Información de Empresa
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de Préstamos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Configuración de Préstamos
            </CardTitle>
            <CardDescription>
              Define los parámetros por defecto para tus préstamos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-rate">Tasa de Interés por Defecto (%)</Label>
                <Input
                  id="default-rate"
                  type="number"
                  value={loanSettings.defaultInterestRate}
                  onChange={(e) => setLoanSettings({...loanSettings, defaultInterestRate: Number(e.target.value)})}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-term">Plazo por Defecto (meses)</Label>
                <Input
                  id="default-term"
                  type="number"
                  value={loanSettings.defaultTerm}
                  onChange={(e) => setLoanSettings({...loanSettings, defaultTerm: Number(e.target.value)})}
                  min="1"
                  max="60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-amount">Monto Mínimo ($)</Label>
                <Input
                  id="min-amount"
                  type="number"
                  value={loanSettings.minAmount}
                  onChange={(e) => setLoanSettings({...loanSettings, minAmount: Number(e.target.value)})}
                  min="0"
                  step="1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-amount">Monto Máximo ($)</Label>
                <Input
                  id="max-amount"
                  type="number"
                  value={loanSettings.maxAmount}
                  onChange={(e) => setLoanSettings({...loanSettings, maxAmount: Number(e.target.value)})}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Requerir Garantía</Label>
                  <p className="text-sm text-muted-foreground">
                    Solicitar garantía para todos los préstamos por defecto
                  </p>
                </div>
                <Switch
                  checked={loanSettings.requireGuarantee}
                  onCheckedChange={(checked) => setLoanSettings({...loanSettings, requireGuarantee: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Aprobación Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Aprobar automáticamente préstamos bajo cierto límite
                  </p>
                </div>
                <Switch
                  checked={loanSettings.autoApproval}
                  onCheckedChange={(checked) => setLoanSettings({...loanSettings, autoApproval: checked})}
                />
              </div>
              
              {loanSettings.autoApproval && (
                <div className="space-y-2">
                  <Label htmlFor="auto-approval-limit">Límite de Aprobación Automática ($)</Label>
                  <Input
                    id="auto-approval-limit"
                    type="number"
                    value={loanSettings.autoApprovalLimit}
                    onChange={(e) => setLoanSettings({...loanSettings, autoApprovalLimit: Number(e.target.value)})}
                    min="0"
                    step="1000"
                  />
                </div>
              )}
            </div>
            
            <Button onClick={handleSaveLoans} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración de Préstamos
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura cómo y cuándo recibir notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir notificaciones importantes por correo electrónico
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibir alertas críticas por mensaje de texto
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios de Pago</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar recordatorios automáticos a clientes
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.paymentReminders}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentReminders: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Vencimiento</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando hay pagos vencidos
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.overdueAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, overdueAlerts: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Nuevos Préstamos</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificar cuando se solicita un nuevo préstamo
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newLoanAlerts}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newLoanAlerts: checked})}
                />
              </div>
            </div>
            
            <Button onClick={handleSaveNotifications} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Guardar Configuración de Notificaciones
            </Button>
          </CardContent>
        </Card>

        {/* Información del Usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mi Cuenta
            </CardTitle>
            <CardDescription>
              Información de tu cuenta de usuario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={user?.name || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Input value={user?.role === 'ADMIN' ? 'Administrador' : 'Usuario'} disabled />
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input value="Activo" disabled className="text-green-600" />
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <Shield className="inline h-4 w-4 mr-1" />
                Tu cuenta tiene permisos de administrador. Puedes gestionar todos los aspectos del sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
