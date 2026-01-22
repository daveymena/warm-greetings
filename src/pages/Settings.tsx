import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { exportData, importData } from '@/lib/storage';
import { Download, Upload, Shield, Database, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useRef } from 'react';

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credicontrol-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Backup descargado correctamente');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.clients && data.loans && data.payments) {
          importData(data);
          toast.success('Datos importados correctamente. Recarga la página para ver los cambios.');
        } else {
          toast.error('Archivo de backup inválido');
        }
      } catch {
        toast.error('Error al leer el archivo');
      }
    };
    reader.readAsText(file);
  };

  return (
    <MainLayout title="Configuración" subtitle="Administra tu cuenta y preferencias">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Copia de Seguridad
            </CardTitle>
            <CardDescription>
              Exporta o importa tus datos para mantenerlos seguros
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Descargar Backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Restaurar Backup
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Configura recordatorios y alertas automáticas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Las notificaciones push y WhatsApp requieren configuración adicional del backend.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Configura la autenticación y permisos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Shield className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                La autenticación con usuario y contraseña requiere activar el backend.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>Acerca de CrediControl</CardTitle>
            <CardDescription>
              Sistema de gestión de préstamos gota a gota
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versión</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Almacenamiento</span>
              <span className="font-medium">Local (navegador)</span>
            </div>
            <div className="mt-4 rounded-lg bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                💡 Para sincronización en la nube, múltiples dispositivos y autenticación, 
                activa el backend en tu próxima conversación.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
