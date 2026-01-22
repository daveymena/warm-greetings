import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

export function WhatsAppSync({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
    const [status, setStatus] = useState<'CONNECTED' | 'DISCONNECTED' | 'CONNECTING'>('DISCONNECTED');
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const data = await apiFetch('/automation/wa-status');
            setStatus(data.status);

            if (data.status !== 'CONNECTED') {
                fetchQrImage();
            } else {
                setQrImage(null);
            }
        } catch (error) {
            console.error('Error fetching WA status:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchQrImage = async () => {
        try {
            const data = await apiFetch('/automation/wa-qr-image');
            setQrImage(data.qrImage);
        } catch (error) {
            setQrImage(null);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchStatus();
            const interval = setInterval(fetchStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const handleTestMessage = async () => {
        try {
            const phone = prompt('Ingresa el número al que enviar la prueba (con código de país, ej: 57300...):');
            if (!phone) return;

            await apiFetch('/automation/test-wa', {
                method: 'POST',
                body: JSON.stringify({ phone, message: '¡Prueba de conexión exitosa desde Rapi-Credi! 🚀' })
            });
            toast.success('Mensaje de prueba enviado');
        } catch (error) {
            toast.error('Error al enviar mensaje');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        Sincronizar WhatsApp
                    </DialogTitle>
                    <DialogDescription>
                        Vincula tu cuenta para enviar recordatorios automáticos con IA.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Verificando conexión...</p>
                        </div>
                    ) : status === 'CONNECTED' ? (
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-10 w-10 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-green-900">¡Conectado!</h3>
                                <p className="text-sm text-muted-foreground">Tu WhatsApp está listo para enviar mensajes.</p>
                            </div>
                            <Button onClick={handleTestMessage} variant="outline" className="mt-2">
                                Enviar mensaje de prueba
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-center w-full">
                            {qrImage ? (
                                <div className="space-y-4 w-full flex flex-col items-center">
                                    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
                                        <img src={qrImage} alt="WhatsApp QR Code" className="h-48 w-48" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Escanea el código con tu celular</p>
                                        <p className="text-xs text-muted-foreground italic">Actualizando automáticamente cada 5s</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <AlertCircle className="h-10 w-10 text-amber-500" />
                                    <p className="text-sm">Generando nuevo código QR...</p>
                                    <p className="text-xs text-muted-foreground">Esto puede tardar unos segundos.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-start">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
