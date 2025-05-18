import { useState } from "react";
import { Play, Square, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Instancia } from "@/lib/supabase";

interface InstanceScheduleCardProps {
  instance: Instancia;
  botAtivo: boolean;
  initialTimeStart: string;
  initialTimeEnd: string;
}

// Define weekday options with Saturday and Sunday added
const WEEKDAYS = [
  { value: "seg", label: "S", fullName: "Segunda" },
  { value: "ter", label: "T", fullName: "Terça" },
  { value: "qua", label: "Q", fullName: "Quarta" },
  { value: "qui", label: "Q", fullName: "Quinta" },
  { value: "sex", label: "S", fullName: "Sexta" },
  { value: "sab", label: "S", fullName: "Sábado" },
  { value: "dom", label: "D", fullName: "Domingo" },
];

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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Horário de Início</label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isAnyActionInProgress}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Horário de Fim</label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isAnyActionInProgress}
              />
            </div>
          </div>
          
          {/* Weekday selection with all 7 days */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Dias da Semana</label>
            <div className="flex flex-wrap gap-3 mt-1">
              {WEEKDAYS.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${instance.id}-${day.value}`}
                    checked={selectedWeekdays.includes(day.value)}
                    onCheckedChange={() => toggleWeekday(day.value)}
                    disabled={isAnyActionInProgress}
                    aria-label={day.fullName}
                  />
                  <label 
                    htmlFor={`${instance.id}-${day.value}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {day.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => handleAction('manual')}
          disabled={isAnyActionInProgress || isActive}
        >
          {loadingStates.manual ? (
            <span className="animate-pulse">Ativando...</span>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Ativar Manualmente
            </>
          )}
        </Button>
        <Button
          size="sm" 
          variant="destructive"
          onClick={() => handleAction('stop')}
          disabled={isAnyActionInProgress || !isActive}
        >
          {loadingStates.stop ? (
            <span className="animate-pulse">Parando...</span>
          ) : (
            <>
              <Square className="h-4 w-4 mr-1" />
              Parar
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction('schedule')}
          disabled={isAnyActionInProgress}
        >
          {loadingStates.schedule ? (
            <span className="animate-pulse">Agendando...</span>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-1" />
              Agendar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
