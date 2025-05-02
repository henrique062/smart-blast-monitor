
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function Import() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel' // xls
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Formato de arquivo inválido. Use CSV, XLSX ou XLS.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para importar");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // In real app, we'd send to webhook
      console.log("Uploading file to webhook:", file);
      const formData = new FormData();
      formData.append("file", file);

      /* 
      In a real implementation:
      await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/461b8175-1a6d-4259-8048-d36b71f86117", {
        method: "POST",
        body: formData,
      });
      */

      toast.success("Arquivo importado com sucesso!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erro ao importar arquivo");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importação de Contatos</h1>
        <p className="text-muted-foreground">
          Enviar novos contatos para o sistema por planilha.
        </p>
      </div>
      
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Upload de Arquivos</CardTitle>
          <CardDescription>
            Importe contatos para o sistema através de arquivos CSV, XLSX ou XLS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Arraste e solte seu arquivo aqui, ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: CSV, XLSX, XLS
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Selecionar Arquivo
            </Button>
          </div>

          {file && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Arquivo selecionado:</p>
              <p className="text-sm text-muted-foreground">{file.name}</p>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-center">Importando...</p>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? "Importando..." : "Importar Contatos"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
