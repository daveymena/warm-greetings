import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers,
    delay,
    makeCacheableSignalKeyStore
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import pino from 'pino';
import fs from 'fs';

export class WhatsAppService {
    private static socket: any = null;
    private static isInitializing = false;
    private static status: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING' = 'DISCONNECTED';

    static getStatus() {
        return { status: this.status };
    }

    static async init() {
        if (this.socket || this.isInitializing) return;
        this.isInitializing = true;
        this.status = 'CONNECTING';

        try {
            const sessionName = process.env.WA_SESSION_NAME || 'wa_auth';
            const authDir = path.join(process.cwd(), sessionName);
            if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true });

            const { state, saveCreds } = await useMultiFileAuthState(authDir);
            const { version, isLatest } = await fetchLatestBaileysVersion();
            console.log(`📡 Usando Baileys v${version.join('.')}, latest: ${isLatest}`);

            this.socket = makeWASocket({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
                },
                printQRInTerminal: true,
                browser: Browsers.ubuntu('Chrome'), // Anti-ban strategy: use a real-looking browser
                logger: pino({ level: 'silent' }),
                patchMessageBeforeSending: (message) => {
                    const requiresPatch = !!(
                        message.buttonsMessage ||
                        message.templateMessage ||
                        message.listMessage
                    );
                    if (requiresPatch) {
                        message = {
                            viewOnceMessage: {
                                message: {
                                    messageContextInfo: {
                                        deviceListMetadata: {},
                                        deviceListMetadataVersion: 2
                                    },
                                    ...message
                                }
                            }
                        };
                    }
                    return message;
                }
            });

            this.socket.ev.on('creds.update', saveCreds);

            this.socket.ev.on('connection.update', (update: any) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    console.log('📡 QR generado (Antiban/Estable)');
                    fs.writeFileSync(path.join(process.cwd(), 'last_qr.txt'), qr);
                }

                if (connection === 'close') {
                    this.status = 'DISCONNECTED';
                    const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('WhatsApp connection closed. Reconnecting...', shouldReconnect);
                    if (shouldReconnect) {
                        this.isInitializing = false;
                        this.socket = null;
                        this.init();
                    }
                } else if (connection === 'open') {
                    this.status = 'CONNECTED';
                    this.isInitializing = false;
                    console.log('✅ WhatsApp CONECTADO exitosamente (Modo Estable)');
                    // Limpiar QR
                    const qrPath = path.join(process.cwd(), 'last_qr.txt');
                    if (fs.existsSync(qrPath)) fs.unlinkSync(qrPath);
                }
            });

        } catch (error) {
            console.error('Error initializing WhatsApp (Antiban):', error);
            this.isInitializing = false;
            this.status = 'DISCONNECTED';
        }
    }

    static async sendMessage(to: string, message: string) {
        if (!this.socket || this.status !== 'CONNECTED') {
            console.error('WhatsApp no conectado para enviar mensaje');
            return false;
        }

        try {
            let formattedNumber = to.replace(/\D/g, '');
            if (!formattedNumber.endsWith('@s.whatsapp.net')) {
                formattedNumber += '@s.whatsapp.net';
            }

            // Simulación de escritura para mayor realismo (Anti-ban)
            await this.socket.sendPresenceUpdate('composing', formattedNumber);
            await delay(2000);
            await this.socket.sendPresenceUpdate('paused', formattedNumber);

            await this.socket.sendMessage(formattedNumber, { text: message });
            console.log(`Mensaje enviado a ${formattedNumber}`);
            return true;
        } catch (error) {
            console.error('Error enviando mensaje WhatsApp:', error);
            return false;
        }
    }
}
