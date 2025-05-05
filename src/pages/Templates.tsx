
import { useState, useEffect } from "react";
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
import { 
  fetchTemplates, 
  updateTemplateStatus, 
  deleteTemplate, 
  createTemplate,
  Template 
} from "@/lib/supabase";

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTemplate, setNewTemplate] = useState({
    titulo: "",
    mensagem: ""
  });

  // Fetch templates on component mount
  useEffect(() => {
    const getTemplates = async () => {
      try {
        setLoading(true);
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Erro ao carregar templates");
      } finally {
        setLoading(false);
      }
    };

    getTemplates();
  }, []);

  const handleSaveTemplate = async () => {
    if (!newTemplate.titulo.trim() || !newTemplate.mensagem.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const templateToSave = {
        titulo: newTemplate.titulo,
        mensagem: newTemplate.mensagem,
        ativo: true
      };

      const savedTemplate = await createTemplate(templateToSave);
      
      if (savedTemplate) {
        setTemplates([...templates, savedTemplate]);
        setNewTemplate({ titulo: "", mensagem: "" });
        toast.success("Template salvo com sucesso!");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar template");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateTemplateStatus(id, !currentStatus);
      
      const updatedTemplates = templates.map(template => {
        if (template.id === id) {
          return { ...template, ativo: !currentStatus };
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
      await deleteTemplate(id);

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
                value={newTemplate.titulo}
                onChange={(e) => setNewTemplate({ ...newTemplate, titulo: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="template-content">Conteúdo</Label>
              <Textarea 
                id="template-content"
                placeholder="Ex: Olá {{nome}}, seja bem-vindo(a)!" 
                className="min-h-[150px]"
                value={newTemplate.mensagem}
                onChange={(e) => setNewTemplate({ ...newTemplate, mensagem: e.target.value })}
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
          {loading ? (
            <p className="text-muted-foreground">Carregando templates...</p>
          ) : templates.length === 0 ? (
            <p className="text-muted-foreground">Nenhum template salvo.</p>
          ) : (
            templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{template.titulo}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {template.ativo ? "Ativo" : "Inativo"}
                      </span>
                      <Switch
                        checked={template.ativo}
                        onCheckedChange={() => handleToggleActive(template.id, template.ativo)}
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
                              Tem certeza que deseja excluir o template "{template.titulo}"?
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
                    {template.mensagem}
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
