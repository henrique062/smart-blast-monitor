
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTemplate = async () => {
    if (!newTemplate.titulo.trim() || !newTemplate.mensagem.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setIsLoading(true);
      
      const templateToSave = {
        titulo: newTemplate.titulo,
        mensagem: newTemplate.mensagem,
        ativo: true
      };
      
      // Send to webhook first
      const webhookResponse = await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/c23921ee-d540-47f7-9833-b882e47254ff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateToSave),
      });
      
      console.log("Webhook response:", webhookResponse);
      
      // Check if webhook was successful
      if (!webhookResponse.ok) {
        throw new Error(`Webhook error: ${webhookResponse.status}`);
      }
      
      // Only save to database if webhook was successful
      const savedTemplate = await createTemplate(templateToSave);
      
      if (savedTemplate) {
        onTemplateCreated(savedTemplate);
        setNewTemplate({ titulo: "", mensagem: "" });
        toast.success("Template salvo com sucesso!");
      }
    } catch (error) {
      console.error("Error processing template:", error);
      toast.error("Erro ao salvar template. Tente novamente.");
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Use variáveis como {"{{nome}}"} para personalizar a mensagem.
        </p>
      </div>
      <Button 
        className="w-full" 
        onClick={handleSaveTemplate}
        disabled={isLoading}
      >
        {isLoading ? "Salvando..." : "Salvar Template"}
      </Button>
    </div>
  );
}
