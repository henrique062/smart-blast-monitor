import { useState, useEffect } from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import BarChart from "@/components/dashboard/BarChart";
import DataTable, { ColumnDef, StatusType, getStatusBadge } from "@/components/dashboard/DataTable";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchContatos, 
  fetchRecentDisparos, 
  fetchDisparosPorInstancia,
  fetchDisparosEmAndamento,
  fetchInstancias,
  DisparoData,
  Instancia 
} from "@/lib/supabase";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface BlastData {
  id: string;
  name: string;
  phone: string;
  status: StatusType;
  date: string;
  instance: string;
}

export default function Dashboard() {
  // Fetch contacts data from Supabase
  const { data: contatosData, isLoading: isLoadingContatos, error: contatosError } = useQuery({
    queryKey: ['contatos-dashboard'],
    queryFn: fetchContatos,
  });

  // Fetch em andamento count from Supabase
  const { 
    data: disparosEmAndamentoCount, 
    isLoading: isLoadingEmAndamento, 
    error: disparosEmAndamentoError 
  } = useQuery({
    queryKey: ['disparos-em-andamento'],
    queryFn: fetchDisparosEmAndamento,
  });

  // Fetch recent dispatches data from Supabase
  const { data: disparosData, isLoading: isLoadingDisparos, error: disparosError } = useQuery({
    queryKey: ['recent-disparos'],
    queryFn: fetchRecentDisparos,
  });

  // Fetch dispatch counts by instance from Supabase
  const { 
    data: instanciaCountData, 
    isLoading: isLoadingInstanciaCount, 
    error: instanciaCountError 
  } = useQuery({
    queryKey: ['disparos-por-instancia'],
    queryFn: fetchDisparosPorInstancia,
  });

  // Fetch instances from Supabase
  const {
    data: instanciasData,
    isLoading: isLoadingInstancias,
    error: instanciasError
  } = useQuery({
    queryKey: ['instancias'],
    queryFn: fetchInstancias,
  });

  // Show error toast if fetch fails
  useEffect(() => {
    if (contatosError) {
      toast.error("Erro ao carregar contatos", {
        description: "Não foi possível carregar os dados do servidor."
      });
    }

    if (disparosError) {
      toast.error("Erro ao carregar disparos", {
        description: "Não foi possível carregar os dados de disparos do servidor."
      });
    }

    if (instanciaCountError) {
      toast.error("Erro ao carregar dados do gráfico", {
        description: "Não foi possível carregar os dados de disparos por instância."
      });
    }

    if (disparosEmAndamentoError) {
      toast.error("Erro ao carregar disparos em andamento", {
        description: "Não foi possível carregar a contagem de disparos em andamento."
      });
    }

    if (instanciasError) {
      toast.error("Erro ao carregar instâncias", {
        description: "Não foi possível carregar os dados de instâncias do servidor."
      });
    }
  }, [contatosError, disparosError, instanciaCountError, disparosEmAndamentoError, instanciasError]);

  // Get instance name from ID
  const getInstanceName = (instanceId: string) => {
    if (isLoadingInstancias || !instanciasData) {
      return instanceId; // Return ID if data not loaded yet
    }
    
    const instance = instanciasData.find(inst => inst.id === instanceId);
    return instance ? instance.formatado : instanceId;
  };

  // Calculate counts based on the criteria
  const pendingBlasts = contatosData ? contatosData.filter(contato => contato.disparo_agendamento === null).length : 0;
  const successBlasts = contatosData ? contatosData.filter(contato => contato.disparo_realizado === true).length : 0;
  const errorBlasts = contatosData ? contatosData.filter(contato => contato.disparo_realizado === false).length : 0;

  // Transform disparos data to table format with proper timezone conversion
  const tableData: BlastData[] = disparosData ? disparosData.map((disparo: DisparoData) => {
    // Convert UTC date to GMT-3 and format it
    const timeZone = 'America/Sao_Paulo'; // GMT-3
    const utcDate = parseISO(disparo.created_at);
    const zonedDate = toZonedTime(utcDate, timeZone);
    const formattedDate = format(zonedDate, 'dd-MM-yy | HH:mm');
    
    return {
      id: disparo.id,
      name: disparo.nome,
      phone: disparo.numero_principal,
      status: disparo.disparo_principal ? "success" : "error",
      date: formattedDate,
      instance: getInstanceName(disparo.instancia)
    };
  }) : [];

  const isLoading = isLoadingContatos || isLoadingDisparos || isLoadingInstanciaCount || isLoadingEmAndamento || isLoadingInstancias;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do status de todos os disparos em tempo real.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Disparos Pendentes"
          value={isLoading ? "..." : pendingBlasts}
          color="info"
        />
        <StatusCard
          title="Disparos em Andamento"
          value={isLoading ? "..." : disparosEmAndamentoCount}
          color="warning"
        />
        <StatusCard
          title="Disparos Enviados"
          value={isLoading ? "..." : successBlasts}
          color="success"
        />
        <StatusCard
          title="Disparos com Falha"
          value={isLoading ? "..." : errorBlasts}
          color="destructive"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            columns={columns}
            data={isLoadingDisparos ? [] : tableData}
            emptyState={isLoadingDisparos ? "Carregando disparos..." : "Nenhum disparo encontrado"}
            className="bg-card"
          />
        </div>
        <div className="lg:col-span-1">
          <BarChart
            data={isLoadingInstanciaCount ? [] : instanciaCountData || []}
            title="Disparos por Instância"
            color="#3B82F6"
            className="h-full"
            emptyState={isLoadingInstanciaCount ? "Carregando dados..." : "Nenhum dado de instância encontrado"}
          />
        </div>
      </div>
    </div>
  );
}

const columns: ColumnDef<BlastData>[] = [
  { accessorKey: "id", header: "ID do Disparo" },
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "phone", header: "Telefone" },
  { 
    accessorKey: "status", 
    header: "Status", 
    cell: (row) => getStatusBadge(row.status) 
  },
  { accessorKey: "date", header: "Data do Disparo" },
  { accessorKey: "instance", header: "Instância" },
];
