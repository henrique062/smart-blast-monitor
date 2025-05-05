
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createTemplate, Template } from "@/lib/supabase";

interface NewTemplateFormProps {
  onTemplateCreated: (template: Template) => void;
}

export function NewTemplateForm({ onTemplateCreated }: NewTemplateFormProps) {
  const [newTemplate, setNewTemplate] = useState({
    titulo: "",
    mensagem: ""
  });

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
        onTemplateCreated(savedTemplate);
        setNewTemplate({ titulo: "", mensagem: "" });
        toast.success("Template salvo com sucesso!");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Erro ao salvar template");
    }
  };

  return (
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
  );
}
