
import { useState, useEffect } from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import BarChart from "@/components/dashboard/BarChart";
import DataTable, { ColumnDef, StatusType, getStatusBadge } from "@/components/dashboard/DataTable";
import { useQuery } from "@tanstack/react-query";
import { fetchContatos, fetchRecentDisparos, DisparoData } from "@/lib/supabase";
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

  // Fetch recent dispatches data from Supabase
  const { data: disparosData, isLoading: isLoadingDisparos, error: disparosError } = useQuery({
    queryKey: ['recent-disparos'],
    queryFn: fetchRecentDisparos,
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
  }, [contatosError, disparosError]);

  // Calculate counts based on the criteria
  const pendingBlasts = contatosData ? contatosData.filter(contato => contato.disparo_agendamento === null).length : 0;
  const inProgressBlasts = contatosData ? contatosData.filter(contato => contato.disparo_agendamento === true).length : 0;
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
      instance: disparo.instancia
    };
  }) : [];

  const chartData = [
    { name: "Inst-01", value: 24 },
    { name: "Inst-02", value: 18 },
    { name: "Inst-03", value: 12 },
  ];

  const columns: ColumnDef<BlastData>[] = [
    { accessorKey: "id", header: "ID do Disparo" },
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "phone", header: "Telefone" },
    { 
      accessorKey: "status", 
      header: "Status", 
      cell: (data) => getStatusBadge(data.status) 
    },
    { accessorKey: "date", header: "Data do Disparo" },
    { accessorKey: "instance", header: "Instância" },
  ];

  const isLoading = isLoadingContatos || isLoadingDisparos;

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
          value={isLoading ? "..." : inProgressBlasts}
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
            data={chartData}
            title="Disparos por Instância"
            color="#3B82F6"
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
