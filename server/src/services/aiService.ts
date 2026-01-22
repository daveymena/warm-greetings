import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'https://ollama-ollama.ginee6.easypanel.host';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

export class AIService {
    static async generateReminderText(clientName: string, amount: number, dueDate: string, businessName: string, frequency: string = 'MENSUAL') {
        if (process.env.USE_LLM !== 'true') {
            const freqText = frequency === 'MENSUAL' ? 'mensual' : frequency === 'QUINCENAL' ? 'quincenal' : frequency === 'SEMANAL' ? 'semanal' : 'diario';
            return `Hola ${clientName}, te recordamos que tu cuota ${freqText} de $${amount} vence el ${dueDate}. Saludos de ${businessName}.`;
        }

        try {
            const prompt = `Actúa como un asistente financiero amable y profesional de la empresa "${businessName}". 
      Escribe un mensaje de recordatorio corto y persuasivo para el cliente "${clientName}" que tiene un pago ${frequency.toLowerCase()} pendiente de $${amount} que vence el ${dueDate}. 
      Si el pago es DIARIO o SEMANAL, sé más directo pero siempre cordial. El mensaje debe ser para WhatsApp e incluir emojis. 
      No mientas, solo usa los datos proporcionados. Responde SOLO con el mensaje, sin introducciones.`;

            const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
                model: MODEL,
                prompt: prompt,
                stream: false,
            });

            return response.data.response.trim();
        } catch (error) {
            console.error('Error with AI Service:', error);
            const freqText = frequency.toLowerCase();
            return `Hola ${clientName}, de parte de ${businessName} te recordamos tu pago ${freqText} pendiente de $${amount} para la fecha ${dueDate}. ¡Feliz día!`;
        }
    }

    static async generateAlertForLender(lenderName: string, overdueClients: any[]) {
        try {
            const prompt = `Hola ${lenderName}, actua como un analista de riesgos. 
      Tienes los siguientes clientes con pagos vencidos: ${JSON.stringify(overdueClients)}.
      Genera un resumen ejecutivo muy breve y urgente con estrategias para recuperar este dinero hoy mismo.
      Sé directo y profesional.`;

            const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
                model: MODEL,
                prompt: prompt,
                stream: false,
            });

            return response.data.response.trim();
        } catch (error) {
            return `Atención ${lenderName}, tienes ${overdueClients.length} clientes en mora. Revisa tu panel principal.`;
        }
    }
}
