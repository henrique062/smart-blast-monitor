
import { Input } from "@/components/ui/input";

interface TimeRangeInputProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  disabled: boolean;
}

export function TimeRangeInput({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  disabled
}: TimeRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Horário de Início</label>
        <Input 
          type="time" 
          value={startTime} 
          onChange={(e) => onStartTimeChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Horário de Fim</label>
        <Input 
          type="time" 
          value={endTime} 
          onChange={(e) => onEndTimeChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
