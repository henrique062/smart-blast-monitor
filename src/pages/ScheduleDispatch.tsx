
import { useState } from "react";
import { Clock, Play, Stop, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstancias } from "@/hooks/useInstancias";
import { Input } from "@/components/ui/input";

// Define the parameter types
interface DispatchParams {
  id_instancia: string;
  bot_ativo: boolean;
  horario_inicio: string | null;
  horario_fim: string | null;
}

export default function ScheduleDispatch() {
  // Get instances data using our existing hook
  const { instancias, isLoading: isLoadingInstances } = useInstancias();
  
  // Fetch dispatch parameters for each instance
  const { data: paramsData, isLoading: isLoadingParams } = useQuery({
    queryKey: ['parametros_disparo'],
    queryFn: async () => {
      // This would be replaced with a real API call to fetch parameters
      // Mocking data for now
      const mockData: Record<string, DispatchParams> = {};
      
      // Create mock parameters for each instance
      if (instancias) {
        instancias.forEach(inst => {
          mockData[inst.id] = {
            id_instancia: inst.id,
            bot_ativo: Math.random() > 0.5, // Random status for demo
            horario_inicio: "08:00",
            horario_fim: "18:00",
          };
        });
      }
      
      return mockData;
    },
    enabled: !!instancias && instancias.length > 0,
  });
  
  // Track loading states for each action button
  const [loadingStates, setLoadingStates] = useState<Record<string, Record<string, boolean>>>({});
  
  // Time inputs state
  const [timeInputs, setTimeInputs] = useState<Record<string, { start: string; end: string }>>({});
  
  // Initialize time inputs when parameters data is loaded
  useState(() => {
    if (paramsData && instancias) {
      const initialTimeInputs: Record<string, { start: string; end: string }> = {};
      
      instancias.forEach(inst => {
        const params = paramsData[inst.id];
        if (params) {
          initialTimeInputs[inst.id] = {
            start: params.horario_inicio || "08:00",
            end: params.horario_fim || "18:00"
          };
        } else {
          initialTimeInputs[inst.id] = { start: "08:00", end: "18:00" };
        }
      });
      
      setTimeInputs(initialTimeInputs);
    }
  });
  
  // Update time input handler
  const handleTimeChange = (instanceId: string, field: 'start' | 'end', value: string) => {
    setTimeInputs(prev => ({
      ...prev,
      [instanceId]: {
        ...prev[instanceId],
        [field]: value
      }
    }));
  };

  // Send data to webhook based on action
  const handleAction = async (instanceId: string, action: 'manual' | 'stop' | 'schedule') => {
    if (!instancias) return;
    
    const instance = instancias.find(inst => inst.id === instanceId);
    if (!instance) return;
    
    // Set loading state
    setLoadingStates(prev => ({
      ...prev,
      [instanceId]: {
        ...prev[instanceId],
        [action]: true
      }
    }));
    
    // Prepare payload based on action
    const payload = {
      tipo: action === 'manual' ? 'Manual' : action === 'schedule' ? 'Agendamento' : 'Manual',
      instancia: instance.formatado,
      horario_inicio: timeInputs[instanceId]?.start || "08:00",
      horario_fim: timeInputs[instanceId]?.end || "18:00",
      bot_ativo: action !== 'stop'
    };
    
    try {
      // Send to webhook - in real implementation this would point to your actual webhook
      const response = await fetch('https://n8n-n8n.wju2x4.easypanel.host/webhook/parametros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.status === "200" || response.ok) {
        toast.success("Operação realizada com sucesso!");
      } else {
        toast.error(`Erro: ${data.message || 'Falha ao processar a solicitação'}`);
      }
    } catch (error) {
      console.error('Error sending data:', error);
      toast.error("Erro ao enviar dados. Verifique sua conexão.");
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        [instanceId]: {
          ...prev[instanceId],
          [action]: false
        }
      }));
    }
  };
  
  // Check if a specific button is loading
  const isButtonLoading = (instanceId: string, action: string): boolean => {
    return !!loadingStates[instanceId]?.[action];
  };
  
  // Check if any button is loading for an instance
  const isInstanceLoading = (instanceId: string): boolean => {
    return Object.values(loadingStates[instanceId] || {}).some(state => state);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamento de Disparos</h1>
          <p className="text-muted-foreground">Configure o agendamento de disparos para suas instâncias</p>
        </div>
      </div>

      {(isLoadingInstances || isLoadingParams) ? (
        <div className="grid gap-4 grid-cols-1">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-20 bg-muted/50"></CardHeader>
              <CardContent className="h-40 bg-muted/30"></CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {instancias?.map(instance => {
            const params = paramsData?.[instance.id];
            const botAtivo = params?.bot_ativo || false;
            
            return (
              <Card key={instance.id} className="border shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {instance.formatado}
                    <div 
                      className={`rounded-full w-3 h-3 ${botAtivo ? 'bg-green-500' : 'bg-red-500'}`} 
                      title={botAtivo ? "Bot Ativo" : "Bot Inativo"}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Horário de Início</label>
                        <Input 
                          type="time" 
                          value={timeInputs[instance.id]?.start || "08:00"} 
                          onChange={(e) => handleTimeChange(instance.id, 'start', e.target.value)}
                          disabled={isInstanceLoading(instance.id)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Horário de Fim</label>
                        <Input 
                          type="time" 
                          value={timeInputs[instance.id]?.end || "18:00"} 
                          onChange={(e) => handleTimeChange(instance.id, 'end', e.target.value)}
                          disabled={isInstanceLoading(instance.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleAction(instance.id, 'manual')}
                    disabled={isInstanceLoading(instance.id)}
                  >
                    {isButtonLoading(instance.id, 'manual') ? (
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
                    onClick={() => handleAction(instance.id, 'stop')}
                    disabled={isInstanceLoading(instance.id)}
                  >
                    {isButtonLoading(instance.id, 'stop') ? (
                      <span className="animate-pulse">Parando...</span>
                    ) : (
                      <>
                        <Stop className="h-4 w-4 mr-1" />
                        Parar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(instance.id, 'schedule')}
                    disabled={isInstanceLoading(instance.id)}
                  >
                    {isButtonLoading(instance.id, 'schedule') ? (
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
          })}
        </div>
      )}
    </div>
  );
}
