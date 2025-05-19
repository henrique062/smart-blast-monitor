
import { useQuery } from "@tanstack/react-query";
import { fetchInstancias, Instancia } from "@/lib/supabase"; // This still works because of re-exports
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
