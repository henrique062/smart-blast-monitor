
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileJson } from "lucide-react";

interface FileUploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  isUploading: boolean;
}

export const FileUploadZone = ({ file, onFileChange, isUploading }: FileUploadZoneProps) => {
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
      return;
    }

    onFileChange(selectedFile);
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
  );
};
