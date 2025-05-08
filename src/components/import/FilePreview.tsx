
import { Progress } from "@/components/ui/progress";

interface FilePreviewProps {
  file: File | null;
  isUploading: boolean;
  uploadProgress: number;
}

export const FilePreview = ({ file, isUploading, uploadProgress }: FilePreviewProps) => {
  if (!file) return null;
  
  return (
    <>
      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-sm font-medium">Arquivo selecionado:</p>
        <p className="text-sm text-muted-foreground">{file.name}</p>
      </div>

      {isUploading && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-center">Processando arquivo...</p>
          <Progress value={uploadProgress} />
        </div>
      )}
    </>
  );
};
