import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([
    { id: "1", name: "Boas-vindas", content: "Olá {{nome}}, seja bem-vindo(a)! Estamos felizes em ter você conosco.", isActive: true },
    { id: "2", name: "Confirmação", content: "Olá {{nome}}, sua vaga foi confirmada! Aguardamos você no dia {{data}} às {{hora}}.", isActive: true },
    { id: "3", name: "Agradecimento", content: "Olá {{nome}}, obrigado por participar. Sua presença foi muito importante para nós.", isActive: false },
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    content: ""
  });

  const handleSaveTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Normally would save via API, here we're just updating state
    try {
      const templateToSave = {
        id: Date.now().toString(),
        name: newTemplate.name,
        content: newTemplate.content,
        isActive: true
      };

      // In a real app, we'd send this to the n8n webhook
      console.log("Sending template to webhook:", templateToSave);
      await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/c23921ee-d540-47f7-9833-b882e47254ff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateToSave),
      });

      setTemplates([...templates, templateToSave]);
      setNewTemplate({ name: "", content: "" });
      toast.success("Template salvo com sucesso!");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar template");
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const updatedTemplates = templates.map(template => {
        if (template.id === id) {
          const updatedTemplate = { ...template, isActive: !template.isActive };
          
          // In a real app, we'd send this to the n8n webhook
          console.log("Updating template status:", updatedTemplate);
          fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/c23921ee-d540-47f7-9833-b882e47254ff", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...updatedTemplate, action: "update_status" }),
          });
          
          return updatedTemplate;
        }
        return template;
      });

      setTemplates(updatedTemplates);
      toast.success("Status do template atualizado!");
    } catch (error) {
      console.error("Error updating template status:", error);
      toast.error("Erro ao atualizar status do template");
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      // In a real app, we'd send this to the n8n webhook
      console.log("Deleting template:", id);
      await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/c23921ee-d540-47f7-9833-b882e47254ff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action: "delete_template" }),
      });

      // Update state by removing the template
      setTemplates(templates.filter(template => template.id !== id));
      toast.success("Template excluído com sucesso!");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Erro ao excluir template");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
        <p className="text-muted-foreground">
          Criar, visualizar e ativar/desativar mensagens padronizadas para disparo.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Novo Template</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input 
                id="template-name"
                placeholder="Ex: Boas-vindas" 
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="template-content">Conteúdo</Label>
              <Textarea 
                id="template-content"
                placeholder="Ex: Olá {{nome}}, seja bem-vindo(a)!" 
                className="min-h-[150px]"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use variáveis como {"{{nome}}"} para personalizar a mensagem.
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={handleSaveTemplate}
            >
              Salvar Template
            </Button>
          </div>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Templates Salvos</h2>
          {templates.length === 0 ? (
            <p className="text-muted-foreground">Nenhum template salvo.</p>
          ) : (
            templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {template.isActive ? "Ativo" : "Inativo"}
                      </span>
                      <Switch
                        checked={template.isActive}
                        onCheckedChange={() => handleToggleActive(template.id)}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Template</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o template "{template.name}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <p className="text-sm border rounded-md p-2 bg-muted/50 whitespace-pre-wrap">
                    {template.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
