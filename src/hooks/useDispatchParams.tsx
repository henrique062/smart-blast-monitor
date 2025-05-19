
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Instancia, fetchParametrosDisparo } from "@/lib/supabase";

// Define the parameter types
export interface DispatchParams {
  id: string;
  instancia_nome: string;
  bot_ativo: boolean;
  horario_inicio: string | null;
  horario_fim: string | null;
  dias_semana: string[] | null;
}

export function useDispatchParams(instancias: Instancia[] | undefined) {
  // Fetch all dispatch parameters
  const { data: allParams, isLoading: isLoadingParams } = useQuery({
    queryKey: ['parametros_disparo'],
    queryFn: fetchParametrosDisparo,
    enabled: !!instancias && instancias.length > 0,
  });
  
  // Process params data to match with instances
  const paramsData = allParams && instancias ? processParamsData(allParams, instancias) : {};
  
  // Time inputs state
  const [timeInputs, setTimeInputs] = useState<Record<string, { start: string; end: string; weekdays: string[] }>>({});
  
  // Initialize time inputs when parameters data is loaded
  useEffect(() => {
    if (!instancias || instancias.length === 0) {
      return; // Exit early if no instances
    }
    
    const initialTimeInputs: Record<string, { start: string; end: string; weekdays: string[] }> = {};
    
    instancias.forEach(inst => {
      const params = paramsData[inst.id];
      if (params) {
        initialTimeInputs[inst.id] = {
          start: params.horario_inicio || "08:00",
          end: params.horario_fim || "18:00",
          weekdays: params.dias_semana || ["seg", "ter", "qua", "qui", "sex"]
        };
      } else {
        initialTimeInputs[inst.id] = { 
          start: "08:00", 
          end: "18:00",
          weekdays: ["seg", "ter", "qua", "qui", "sex"] 
        };
      }
    });
    
    setTimeInputs(initialTimeInputs);
  }, [paramsData, instancias]); // Removed allParams as dependency to prevent additional renders

  // Helper function to process and match params with instances
  function processParamsData(params: DispatchParams[], instances: Instancia[]): Record<string, DispatchParams> {
    const result: Record<string, DispatchParams> = {};
    
    instances.forEach(instance => {
      // Find matching params by instance name
      const matchingParam = params.find(param => param.instancia_nome === instance.nome);
      
      if (matchingParam) {
        // If we found matching params, use them
        result[instance.id] = matchingParam;
      } else {
        // Default values if no matching params exist
        result[instance.id] = {
          id: instance.id,
          instancia_nome: instance.nome,
          bot_ativo: false,
          horario_inicio: "08:00",
          horario_fim: "18:00",
          dias_semana: ["seg", "ter", "qua", "qui", "sex"],
        };
      }
    });
    
    return result;
  }

  return {
    paramsData,
    isLoadingParams,
    timeInputs
  };
}
