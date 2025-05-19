
import { Clock, AlertCircle } from "lucide-react";
import { useInstancias } from "@/hooks/useInstancias";
import { useDispatchParams } from "@/hooks/useDispatchParams";
import { InstanceScheduleCard } from "@/components/schedule/InstanceScheduleCard";
import { InstanceScheduleSkeleton } from "@/components/schedule/InstanceScheduleSkeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";

export default function ScheduleDispatch() {
  // Get instances data using our existing hook
  const { instancias, isLoading: isLoadingInstances, error: instancesError, refetch: refetchInstances } = useInstancias();
  
  // Get dispatch parameters using our hook
  const { paramsData, isLoadingParams, timeInputs } = useDispatchParams(instancias);

  // Determine overall loading state
  const isLoading = isLoadingInstances || isLoadingParams;
  const hasError = !!instancesError;

  // Log data for debugging
  useEffect(() => {
    console.log("Instâncias carregadas:", instancias?.length || 0);
    console.log("Parâmetros carregados:", Object.keys(paramsData || {}).length);
  }, [instancias, paramsData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamento de Disparos</h1>
          <p className="text-muted-foreground">Configure o agendamento de disparos para suas instâncias</p>
        </div>
      </div>

      {hasError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Não foi possível carregar os dados das instâncias.</span>
            <Button variant="outline" size="sm" onClick={() => refetchInstances()}>
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1">
          {[1, 2, 3].map(i => (
            <InstanceScheduleSkeleton key={i} />
          ))}
        </div>
      ) : instancias && instancias.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {instancias.map(instance => {
            const params = paramsData?.[instance.id];
            const botAtivo = params?.bot_ativo || false;
            const timeInput = timeInputs[instance.id] || { start: "08:00", end: "18:00" };
            
            return (
              <InstanceScheduleCard 
                key={instance.id}
                instance={instance}
                botAtivo={botAtivo}
                initialTimeStart={timeInput.start} 
                initialTimeEnd={timeInput.end}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Nenhuma instância encontrada no banco de dados.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => refetchInstances()}
          >
            Tentar novamente
          </Button>
        </div>
      )}
    </div>
  );
}
