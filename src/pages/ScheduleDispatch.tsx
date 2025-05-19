
import { Clock } from "lucide-react";
import { useInstancias } from "@/hooks/useInstancias";
import { useDispatchParams } from "@/hooks/useDispatchParams";
import { InstanceScheduleCard } from "@/components/schedule/InstanceScheduleCard";
import { InstanceScheduleSkeleton } from "@/components/schedule/InstanceScheduleSkeleton";

export default function ScheduleDispatch() {
  // Get instances data using our existing hook
  const { instancias, isLoading: isLoadingInstances } = useInstancias();
  
  // Get dispatch parameters using our hook
  const { paramsData, isLoadingParams, timeInputs } = useDispatchParams(instancias);

  // Determine overall loading state
  const isLoading = isLoadingInstances || isLoadingParams;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agendamento de Disparos</h1>
          <p className="text-muted-foreground">Configure o agendamento de disparos para suas instâncias</p>
        </div>
      </div>

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
          <p className="text-muted-foreground">Nenhuma instância encontrada</p>
        </div>
      )}
    </div>
  );
}
