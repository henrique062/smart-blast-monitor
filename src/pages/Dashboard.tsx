import { useState } from "react";
import StatusCard from "@/components/dashboard/StatusCard";
import BarChart from "@/components/dashboard/BarChart";
import DataTable, { ColumnDef, StatusType, getStatusBadge } from "@/components/dashboard/DataTable";
interface BlastData {
  id: string;
  name: string;
  phone: string;
  status: StatusType;
  date: string;
  instance: string;
}
export default function Dashboard() {
  // Mock data for demonstration
  const [blastData] = useState<BlastData[]>([{
    id: "LD001",
    name: "João Silva",
    phone: "11999887766",
    status: "success",
    date: "2025-05-02 09:15",
    instance: "Inst-01"
  }, {
    id: "LD002",
    name: "Maria Oliveira",
    phone: "21988776655",
    status: "in-progress",
    date: "2025-05-02 09:20",
    instance: "Inst-02"
  }, {
    id: "LD003",
    name: "Pedro Santos",
    phone: "31977665544",
    status: "pending",
    date: "2025-05-02 09:30",
    instance: "Inst-01"
  }, {
    id: "LD004",
    name: "Ana Costa",
    phone: "41966554433",
    status: "error",
    date: "2025-05-02 09:25",
    instance: "Inst-03"
  }, {
    id: "LD005",
    name: "Lucas Pereira",
    phone: "51955443322",
    status: "success",
    date: "2025-05-02 09:10",
    instance: "Inst-02"
  }, {
    id: "LD006",
    name: "Juliana Lima",
    phone: "61944332211",
    status: "success",
    date: "2025-05-02 08:55",
    instance: "Inst-01"
  }, {
    id: "LD007",
    name: "Roberto Alves",
    phone: "71933221100",
    status: "pending",
    date: "2025-05-02 09:40",
    instance: "Inst-03"
  }, {
    id: "LD008",
    name: "Camila Rocha",
    phone: "81922110099",
    status: "in-progress",
    date: "2025-05-02 09:35",
    instance: "Inst-02"
  }]);
  const chartData = [{
    name: "Inst-01",
    value: 24
  }, {
    name: "Inst-02",
    value: 18
  }, {
    name: "Inst-03",
    value: 12
  }];

  // Count blasts by status
  const pendingBlasts = blastData.filter(item => item.status === "pending").length;
  const inProgressBlasts = blastData.filter(item => item.status === "in-progress").length;
  const successBlasts = blastData.filter(item => item.status === "success").length;
  const errorBlasts = blastData.filter(item => item.status === "error").length;
  const columns: ColumnDef<BlastData>[] = [{
    accessorKey: "id",
    header: "ID do Lead"
  }, {
    accessorKey: "name",
    header: "Nome"
  }, {
    accessorKey: "phone",
    header: "Telefone"
  }, {
    accessorKey: "status",
    header: "Status",
    cell: data => getStatusBadge(data.status)
  }, {
    accessorKey: "date",
    header: "Data do Disparo"
  }, {
    accessorKey: "instance",
    header: "Instância"
  }];
  return <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-center">Dashboard disparador</h1>
        <p className="text-muted-foreground">
          Visão geral do status de todos os disparos em tempo real.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Disparos Pendentes" value={pendingBlasts} color="info" />
        <StatusCard title="Disparos em Andamento" value={inProgressBlasts} color="warning" />
        <StatusCard title="Disparos Enviados" value={successBlasts} color="success" />
        <StatusCard title="Disparos com Falha" value={errorBlasts} color="destructive" />
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable columns={columns} data={blastData} className="bg-card" />
        </div>
        <div className="lg:col-span-1">
          <BarChart data={chartData} title="Disparos por Instância" color="#3B82F6" className="h-full" />
        </div>
      </div>
    </div>;
}