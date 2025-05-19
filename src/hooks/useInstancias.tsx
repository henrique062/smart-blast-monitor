
import { useQuery } from "@tanstack/react-query";
import { fetchInstancias } from "@/lib/api/instances";
import { Instancia } from "@/lib/types";
import { toast } from "sonner";
import { useEffect } from "react";

export function useInstancias() {
  const {
    data: instancias,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['instancias'],
    queryFn: fetchInstancias,
    retry: 2, // Retry failed requests twice
    onError: (error) => {
      console.error("Erro na query de instâncias:", error);
    }
  });

  // Show error notification when fetch fails
  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar instâncias:", error);
      toast.error("Erro ao carregar instâncias", { 
        description: "Não foi possível conectar ao banco de dados."
      });
    }
  }, [error]);

  // Debug loaded data
  useEffect(() => {
    console.log("useInstancias hook - instâncias carregadas:", instancias?.length || 0);
  }, [instancias]);

  // Função auxiliar para obter o nome formatado da instância a partir do ID
  const getInstanceNameById = (instanceId: string): string => {
    if (isLoading || !instancias) {
      return instanceId;
    }

    const instance = instancias.find(inst => inst.id === instanceId);
    return instance ? instance.formatado : instanceId;
  };

  return {
    instancias,
    isLoading,
    error,
    refetch,
    getInstanceNameById
  };
}
