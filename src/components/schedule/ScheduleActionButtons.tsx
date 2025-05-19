
import { Button } from "@/components/ui/button";
import { Play, Square, Calendar } from "lucide-react";

interface ScheduleActionButtonsProps {
  onManualActivation: () => void;
  onStop: () => void;
  onSchedule: () => void;
  isActive: boolean;
  loadingStates: {
    manual: boolean;
    stop: boolean;
    schedule: boolean;
  };
  isAnyActionInProgress: boolean;
}

export function ScheduleActionButtons({
  onManualActivation,
  onStop,
  onSchedule,
  isActive,
  loadingStates,
  isAnyActionInProgress
}: ScheduleActionButtonsProps) {
  return (
    <>
      <Button
        size="sm"
        onClick={onManualActivation}
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
        onClick={onStop}
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
        onClick={onSchedule}
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
    </>
  );
}
