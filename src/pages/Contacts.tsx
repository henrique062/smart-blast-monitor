
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable, { ColumnDef, StatusType, getStatusBadge } from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Clock, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ContatoPrecatorio, fetchContatos, searchContatos } from "@/lib/supabase";
import { toast } from "sonner";

// Interface para mapear os dados do Supabase para o formato da tabela
interface Contact {
  id: string;
  name: string;
  phone: string;
  status: StatusType | "none";
  inProgress?: boolean; // Adicionado campo para controlar se está em andamento
  isPending?: boolean;  // Adicionado campo para controlar se está pendente
}

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Debounce para a busca
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Consulta para buscar contatos
  const { data: contatosData, isLoading, error } = useQuery({
    queryKey: ['contatos', debouncedSearchTerm],
    queryFn: () => debouncedSearchTerm ? searchContatos(debouncedSearchTerm) : fetchContatos(),
  });

  // Se ocorrer um erro, mostrar toast
  useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar contatos", {
        description: "Não foi possível carregar os dados do servidor."
      });
    }
  }, [error]);

  // Mapear dados do Supabase para o formato da tabela
  const mapContatosToContacts = (contatos: ContatoPrecatorio[]): Contact[] => {
    return contatos.map(contato => ({
      id: contato.telefone_principal, // Usando telefone_principal como ID
      name: contato.nome_completo,
      phone: contato.telefone_principal,
      status: getStatusFromDisparo(contato.disparo_realizado),
      inProgress: contato.disparo_agendamento === true,
      isPending: contato.disparo_agendamento === null
    }));
  };

  // Determinar o status baseado no campo disparo_realizado
  const getStatusFromDisparo = (disparo: boolean | null): StatusType | "none" => {
    if (disparo === true) return "success";
    if (disparo === false) return "error";
    return "none";
  };

  // Contatos processados
  const processedContacts: Contact[] = contatosData ? mapContatosToContacts(contatosData) : [];

  // Filtrar contatos baseado nos critérios especificados
  const filterContacts = (filterType: string | null) => {
    return processedContacts.filter(contact => {
      if (filterType === null) return true; // Todos os contatos
      
      switch (filterType) {
        case "sent":
          return contact.status === "success"; // Disparos Enviados: disparo_realizado = TRUE
        case "not-sent":
          return contact.status === "error"; // Com Falha: disparo_realizado = FALSE
        case "in-progress":
          return contact.inProgress === true; // Em Andamento: disparo_agendamento = TRUE
        case "pending":
          return contact.isPending === true; // Disparos Pendentes: disparo_agendamento IS NULL
        default:
          return true;
      }
    });
  };

  const sentContacts = filterContacts("sent");
  const notSentContacts = filterContacts("not-sent");
  const inProgressContacts = filterContacts("in-progress");
  const pendingContacts = filterContacts("pending");
  const filteredAllContacts = filterContacts(null);

  // Definição das colunas
  const columns: ColumnDef<Contact>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "phone", header: "Telefone" },
    { 
      accessorKey: "status", 
      header: "Status", 
      cell: (data) => {
        if (data.inProgress === true) {
          return getStatusBadge("in-progress", <Loader className="mr-1 h-3 w-3" />);
        } else if (data.isPending === true) {
          return getStatusBadge("pending", <Clock className="mr-1 h-3 w-3" />);
        } else if (data.status === "none") {
          return <span className="text-muted-foreground">Sem disparo</span>;
        } else if (data.status === "success") {
          return getStatusBadge(data.status, <Check className="mr-1 h-3 w-3" />);
        } else if (data.status === "error") {
          return getStatusBadge(data.status, <X className="mr-1 h-3 w-3" />);
        }
        return getStatusBadge(data.status);
      }
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contatos</h1>
        <p className="text-muted-foreground">
          Visualizar e filtrar contatos conforme o status de disparo.
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou telefone..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({filteredAllContacts.length})</TabsTrigger>
          <TabsTrigger value="pending">Disparos Pendentes ({pendingContacts.length})</TabsTrigger>
          <TabsTrigger value="in-progress">Em andamento ({inProgressContacts.length})</TabsTrigger>
          <TabsTrigger value="sent">Disparos Enviados ({sentContacts.length})</TabsTrigger>
          <TabsTrigger value="not-sent">Com Falha ({notSentContacts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <DataTable
            columns={columns}
            data={filteredAllContacts}
            emptyState={isLoading ? "Carregando..." : "Nenhum contato encontrado"}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <DataTable
            columns={columns}
            data={pendingContacts}
            emptyState={isLoading ? "Carregando..." : "Nenhum disparo pendente encontrado"}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          <DataTable
            columns={columns}
            data={sentContacts}
            emptyState={isLoading ? "Carregando..." : "Nenhum contato com disparo encontrado"}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </TabsContent>
        
        <TabsContent value="not-sent" className="space-y-4">
          <DataTable
            columns={columns}
            data={notSentContacts}
            emptyState={isLoading ? "Carregando..." : "Nenhum contato com falha encontrado"}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </TabsContent>
        
        <TabsContent value="in-progress" className="space-y-4">
          <DataTable
            columns={columns}
            data={inProgressContacts}
            emptyState={isLoading ? "Carregando..." : "Nenhum contato em andamento encontrado"}
            className={isLoading ? "opacity-70 pointer-events-none" : ""}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
