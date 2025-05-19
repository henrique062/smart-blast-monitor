
import { Template } from "@/lib/types";
import { TemplateCard } from "./TemplateCard";

interface TemplatesListProps {
  templates: Template[];
  loading: boolean;
  onToggleActive: (id: string, currentStatus: boolean, actionType: string) => Promise<void>;
  onDelete: (id: string, actionType: string) => Promise<void>;
}

export function TemplatesList({ 
  templates, 
  loading, 
  onToggleActive, 
  onDelete 
}: TemplatesListProps) {
  if (loading) {
    return <p className="text-muted-foreground">Carregando templates...</p>;
  }
  
  if (templates.length === 0) {
    return <p className="text-muted-foreground">Nenhum template salvo.</p>;
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
