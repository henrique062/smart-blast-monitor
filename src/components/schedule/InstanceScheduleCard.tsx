
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Instancia } from "@/lib/supabase";
import { WeekdaySelector } from "./WeekdaySelector";
import { ScheduleActionButtons } from "./ScheduleActionButtons";
import { TimeRangeInput } from "./TimeRangeInput";

interface InstanceScheduleCardProps {
  instance: Instancia;
  botAtivo: boolean;
  initialTimeStart: string;
  initialTimeEnd: string;
}

export function InstanceScheduleCard({ instance, botAtivo, initialTimeStart, initialTimeEnd }: InstanceScheduleCardProps) {
  // Local states for this card
  const [startTime, setStartTime] = useState(initialTimeStart);
  const [endTime, setEndTime] = useState(initialTimeEnd);
  const [isActive, setIsActive] = useState(botAtivo);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(["seg", "ter", "qua", "qui", "sex"]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    manual: false,
    stop: false,
    schedule: false
  });

  // Check if any action is in progress
  const isAnyActionInProgress = Object.values(loadingStates).some(state => state);

  // Toggle weekday selection
  const toggleWeekday = (day: string) => {
    setSelectedWeekdays(current => {
      if (current.includes(day)) {
        return current.filter(d => d !== day);
      } else {
        return [...current, day];
      }
    });
  };

  // Handle action (manual activation, stopping, or scheduling)
  const handleAction = async (action: 'manual' | 'stop' | 'schedule') => {
    // Set loading state for this action
    setLoadingStates(prev => ({ ...prev, [action]: true }));

    // Prepare payload
    const payload = {
      tipo: action === 'manual' ? 'Manual' : action === 'schedule' ? 'Agendamento' : 'Manual',
      instancia: instance.formatado,
      instancia_nome: instance.nome,
      horario_inicio: startTime || "08:00",
      horario_fim: endTime || "18:00",
      dias_semana: action !== 'stop' ? selectedWeekdays : [],
      bot_ativo: action !== 'stop'
    };

    try {
      // Send to webhook
      const response = await fetch('https://n8n-n8n.wju2x4.easypanel.host/webhook/agendamento_disparos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.status === "200" || response.ok) {
        // Update local active state based on action
        setIsActive(action !== 'stop');
        
        // Show appropriate success message
        if (action === 'manual') {
          toast.success("Bot ativado com sucesso!");
        } else if (action === 'stop') {
          toast.success("Bot desativado com sucesso!");
        } else {
          toast.success("Agendamento salvo com sucesso!");
        }
      } else {
        toast.error(`Erro: ${data.message || 'Falha ao processar a solicitação'}`);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      toast.error("Erro ao enviar dados. Verifique sua conexão.");
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [action]: false }));
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {instance.formatado}
          <Badge 
            variant={isActive ? "success" : "destructive"} 
            className="ml-2"
          >
            {isActive ? "Ativo" : "Desativado"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TimeRangeInput
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            disabled={isAnyActionInProgress}
          />
          
          <WeekdaySelector
            selectedWeekdays={selectedWeekdays}
            onChange={toggleWeekday}
            disabled={isAnyActionInProgress}
            instanceId={instance.id}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <ScheduleActionButtons
          onManualActivation={() => handleAction('manual')}
          onStop={() => handleAction('stop')}
          onSchedule={() => handleAction('schedule')}
          isActive={isActive}
          loadingStates={loadingStates}
          isAnyActionInProgress={isAnyActionInProgress}
        />
      </CardFooter>
    </Card>
  );
}
