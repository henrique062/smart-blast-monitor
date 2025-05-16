
import { useQuery } from "@tanstack/react-query";
import { fetchInstancias, Instancia } from "@/lib/supabase";

export function useInstancias() {
  const {
    data: instancias,
    isLoading,
    error
  } = useQuery({
    queryKey: ['instancias'],
    queryFn: fetchInstancias,
  });

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
    getInstanceNameById
  };
}
