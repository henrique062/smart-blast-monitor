import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  onToggleActive: (id: string, currentStatus: boolean, actionType: string) => Promise<void>;
  onDelete: (id: string, actionType: string) => Promise<void>;
}

export function TemplateCard({ template, onToggleActive, onDelete }: TemplateCardProps) {
  return (
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
              onCheckedChange={() => onToggleActive(template.id, template.ativo, "toggle_status")}
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
                    onClick={() => onDelete(template.id, "delete")}
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
  );
}
