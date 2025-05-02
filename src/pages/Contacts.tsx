
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable, { ColumnDef, StatusType, getStatusBadge } from "@/components/dashboard/DataTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  status: StatusType | "none";
}

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for demo
  const allContacts: Contact[] = [
    { id: "1", name: "João Silva", phone: "11999887766", status: "success" },
    { id: "2", name: "Maria Oliveira", phone: "21988776655", status: "error" },
    { id: "3", name: "Pedro Santos", phone: "31977665544", status: "none" },
    { id: "4", name: "Ana Costa", phone: "41966554433", status: "in-progress" },
    { id: "5", name: "Lucas Pereira", phone: "51955443322", status: "success" },
    { id: "6", name: "Juliana Lima", phone: "61944332211", status: "none" },
    { id: "7", name: "Roberto Alves", phone: "71933221100", status: "success" },
    { id: "8", name: "Camila Rocha", phone: "81922110099", status: "pending" },
    { id: "9", name: "Fernando Silveira", phone: "91911009988", status: "none" },
    { id: "10", name: "Beatriz Martins", phone: "11900998877", status: "success" },
  ];
  
  const columns: ColumnDef<Contact>[] = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "phone", header: "Telefone" },
    { 
      accessorKey: "status", 
      header: "Status", 
      cell: (data) => data.status === "none" ? 
        <span className="text-muted-foreground">Sem disparo</span> : 
        getStatusBadge(data.status as StatusType) 
    },
  ];

  // Filter contacts based on search and tab status
  const filterContacts = (status: string | null) => {
    return allContacts
      .filter(contact => 
        (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         contact.phone.includes(searchTerm)) &&
        (status === null || 
         (status === "sent" && contact.status !== "none") ||
         (status === "not-sent" && contact.status === "none"))
      );
  };

  const sentContacts = filterContacts("sent");
  const notSentContacts = filterContacts("not-sent");
  const filteredAllContacts = filterContacts(null);

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
          <TabsTrigger value="sent">Com Disparo ({sentContacts.length})</TabsTrigger>
          <TabsTrigger value="not-sent">Sem Disparo ({notSentContacts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <DataTable
            columns={columns}
            data={filteredAllContacts}
            emptyState="Nenhum contato encontrado"
          />
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          <DataTable
            columns={columns}
            data={sentContacts}
            emptyState="Nenhum contato com disparo encontrado"
          />
        </TabsContent>
        
        <TabsContent value="not-sent" className="space-y-4">
          <DataTable
            columns={columns}
            data={notSentContacts}
            emptyState="Nenhum contato sem disparo encontrado"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
