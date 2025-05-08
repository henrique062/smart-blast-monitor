
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUploadZone } from "@/components/import/FileUploadZone";
import { FilePreview } from "@/components/import/FilePreview";
import { parseCSV, parseExcel, parseJSON } from "@/utils/fileParser";

export default function Import() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Selecione um arquivo para importar");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Update progress to show processing started
      setUploadProgress(10);

      // Parse file based on its type
      let jsonData: Record<string, any>[] = [];
      let tipoImportacao = "planilha";
      
      if (file.type === 'application/json') {
        jsonData = await parseJSON(file);
        tipoImportacao = "json";
      } else if (file.type === 'text/csv') {
        jsonData = await parseCSV(file);
        tipoImportacao = "planilha";
      } else {
        // For Excel files (xlsx/xls)
        jsonData = await parseExcel(file);
        tipoImportacao = "planilha";
      }

      // Update progress after parsing
      setUploadProgress(40);
      
      // Log data for debugging
      console.log("Parsed data:", jsonData);
      
      if (!jsonData || jsonData.length === 0) {
        throw new Error("Nenhum dado encontrado no arquivo ou formato inválido");
      }

      // Update progress before sending to webhook
      setUploadProgress(60);

      // Send to webhook
      const response = await fetch("https://n8n-n8n.wju2x4.easypanel.host/webhook/461b8175-1a6d-4259-8048-d36b71f86117", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts: jsonData,
          filename: file.name,
          importedAt: new Date().toISOString(),
          tipoImportacao: tipoImportacao,
        }),
      });

      // Update progress after sending
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Erro ao enviar para webhook: ${response.status}`);
      }

      toast.success("Arquivo importado com sucesso!");
      setFile(null);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao processar o arquivo");
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
          Enviar novos contatos para o sistema por planilha ou arquivo JSON.
        </p>
      </div>
      
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>Upload de Arquivos</CardTitle>
          <CardDescription>
            Importe contatos para o sistema através de arquivos CSV, XLSX, XLS ou JSON.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUploadZone 
            file={file} 
            onFileChange={setFile}
            isUploading={isUploading}
          />
          
          <FilePreview 
            file={file}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleUpload}
            disabled={!file || isUploading}
          >
            {isUploading ? "Processando..." : "Importar Contatos"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
