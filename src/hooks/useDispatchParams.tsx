
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Instancia } from "@/lib/supabase";

// Define the parameter types
export interface DispatchParams {
  id_instancia: string;
  bot_ativo: boolean;
  horario_inicio: string | null;
  horario_fim: string | null;
}

export function useDispatchParams(instancias: Instancia[] | undefined) {
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
  
  // Time inputs state
  const [timeInputs, setTimeInputs] = useState<Record<string, { start: string; end: string }>>({});
  
  // Initialize time inputs when parameters data is loaded
  useEffect(() => {
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
  }, [paramsData, instancias]);

  return {
    paramsData,
    isLoadingParams,
    timeInputs
  };
}
