import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentDaySelectorProps {
  value?: number;
  onChange: (day: number) => void;
  className?: string;
}

export function PaymentDaySelector({ value, onChange, className }: PaymentDaySelectorProps) {
  const [selectedDay, setSelectedDay] = useState<number>(value || 15);

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    onChange(day);
  };

  // Generate days 1-30
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Group days into rows of 7
  const dayRows = [];
  for (let i = 0; i < days.length; i += 7) {
    dayRows.push(days.slice(i, i + 7));
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Día de Pago Mensual
        </CardTitle>
        <CardDescription>
          Selecciona el día del mes en que el cliente realizará los pagos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dayRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {row.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-10 h-10 p-0 relative transition-all duration-200",
                    selectedDay === day 
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105" 
                      : "hover:bg-blue-50 hover:border-blue-300"
                  )}
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                  {selectedDay === day && (
                    <Check className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 text-white rounded-full p-0.5" />
                  )}
                </Button>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg dark:bg-blue-950/30">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Día seleccionado:</strong> {selectedDay} de cada mes
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            El cliente deberá realizar el pago el día {selectedDay} de cada mes durante el plazo del préstamo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}