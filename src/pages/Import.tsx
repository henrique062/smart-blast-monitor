import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileJson } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import * as XLSX from 'xlsx';

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
      'application/vnd.ms-excel', // xls
      'application/json' // json
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Formato de arquivo inválido. Use CSV, XLSX, XLS ou JSON.");
      return;
    }

    setFile(selectedFile);
  };

  // Function to parse CSV files
  const parseCSV = async (file: File): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        if (!csvText) {
          reject(new Error("Falha ao ler arquivo CSV"));
          return;
        }

        try {
          // Parse CSV using XLSX
          const workbook = XLSX.read(csvText, { type: 'string' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          console.error("Error parsing CSV:", error);
          reject(new Error("Erro ao processar arquivo CSV"));
        }
      };
      
      reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
      reader.readAsText(file);
    });
  };

  // Function to parse Excel files (XLSX/XLS)
  const parseExcel = async (file: File): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            reject(new Error("Falha ao ler arquivo Excel"));
            return;
          }
          
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          console.error("Error parsing Excel:", error);
          reject(new Error("Erro ao processar arquivo Excel"));
        }
      };
      
      reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to parse JSON files
  const parseJSON = async (file: File): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const jsonText = e.target?.result as string;
          if (!jsonText) {
            reject(new Error("Falha ao ler arquivo JSON"));
            return;
          }
          
          const jsonData = JSON.parse(jsonText);
          
          // Handle both array and object formats
          const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
          resolve(dataArray);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          reject(new Error("Erro ao processar arquivo JSON"));
        }
      };
      
      reader.onerror = () => reject(new Error("Erro na leitura do arquivo"));
      reader.readAsText(file);
    });
  };

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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao processar o arquivo");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Determine the file type for UI display
  const getFileTypeIcon = () => {
    if (!file) return <Upload className="h-10 w-10 text-muted-foreground mb-4" />;
    
    if (file.type === 'application/json') {
      return <FileJson className="h-10 w-10 text-muted-foreground mb-4" />;
    } else {
      return <Upload className="h-10 w-10 text-muted-foreground mb-4" />;
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
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
            {getFileTypeIcon()}
            <p className="text-sm text-muted-foreground mb-2">
              Arraste e solte seu arquivo aqui, ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: CSV, XLSX, XLS, JSON
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls,.json"
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
              <p className="text-sm text-center">Processando arquivo...</p>
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
            {isUploading ? "Processando..." : "Importar Contatos"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
