
import { Checkbox } from "@/components/ui/checkbox";

export interface WeekdayOption {
  value: string;
  label: string;
  fullName: string;
}

// Define weekday options with correct mappings:
// S = "seg", T = "ter", Q = "qua", Q (2nd) = "qui", 
// S (2nd) = "sex", S (3rd) = "sab", D = "dom"
export const WEEKDAYS: WeekdayOption[] = [
  { value: "seg", label: "S", fullName: "Segunda" },
  { value: "ter", label: "T", fullName: "Terça" },
  { value: "qua", label: "Q", fullName: "Quarta" },
  { value: "qui", label: "Q", fullName: "Quinta" },
  { value: "sex", label: "S", fullName: "Sexta" },
  { value: "sab", label: "S", fullName: "Sábado" },
  { value: "dom", label: "D", fullName: "Domingo" },
];

interface WeekdaySelectorProps {
  selectedWeekdays: string[];
  onChange: (day: string) => void;
  disabled: boolean;
  instanceId: string;
}

export function WeekdaySelector({ selectedWeekdays, onChange, disabled, instanceId }: WeekdaySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Dias da Semana</label>
      <div className="flex flex-wrap gap-3 mt-1">
        {WEEKDAYS.map((day) => (
          <div key={day.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`${instanceId}-${day.value}`}
              checked={selectedWeekdays.includes(day.value)}
              onCheckedChange={() => onChange(day.value)}
              disabled={disabled}
              aria-label={day.fullName}
            />
            <label 
              htmlFor={`${instanceId}-${day.value}`}
              className="text-sm font-medium cursor-pointer"
              title={day.fullName}
            >
              {day.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
