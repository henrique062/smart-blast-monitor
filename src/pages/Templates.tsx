
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  fetchTemplates, 
  updateTemplateStatus, 
  deleteTemplate,
  Template 
} from "@/lib/supabase";
import { NewTemplateForm } from "@/components/templates/NewTemplateForm";
import { TemplatesList } from "@/components/templates/TemplatesList";

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleTemplateCreated = (newTemplate: Template) => {
    setTemplates([...templates, newTemplate]);
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
          <NewTemplateForm onTemplateCreated={handleTemplateCreated} />
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Templates Salvos</h2>
          <TemplatesList
            templates={templates}
            loading={loading}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteTemplate}
          />
        </div>
      </div>
    </div>
  );
}
