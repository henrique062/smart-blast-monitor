
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Template } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

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
      
      // Generate a unique ID for the template
      const templateId = uuidv4();
      
      const templateToSave = {
        id: templateId,
        titulo: newTemplate.titulo,
        mensagem: newTemplate.mensagem,
        ativo: true,
        action_type: "create" // Specify the action type
      };
      
      // Send to webhook
      const webhookResponse = await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/c23921ee-d540-47f7-9833-b882e47254ff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateToSave),
      });
      
      console.log("Webhook response:", webhookResponse);
      
      // Check webhook response status
      if (webhookResponse.ok) {
        // Create a template object to return to the parent component
        const savedTemplate: Template = {
          id: templateId,
          titulo: templateToSave.titulo,
          mensagem: templateToSave.mensagem,
          ativo: templateToSave.ativo,
          deletado: null
        };
        
        onTemplateCreated(savedTemplate);
        setNewTemplate({ titulo: "", mensagem: "" });
        toast.success("Template criado com sucesso!");
      } else {
        throw new Error(`Erro ao criar template: ${webhookResponse.status}`);
      }
    } catch (error) {
      console.error("Error processing template:", error);
      toast.error("Erro ao criar template");
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
