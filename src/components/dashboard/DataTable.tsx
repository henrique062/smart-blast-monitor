
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ColumnDef<T> = {
  accessorKey: keyof T;
  header: string;
  cell?: (data: T) => React.ReactNode;
  className?: string;
};

export type StatusType = "pending" | "in-progress" | "success" | "error";

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyState?: React.ReactNode;
  className?: string;
}

export const getStatusBadge = (status: StatusType, icon?: React.ReactNode) => {
  const statusConfig = {
    "pending": { label: "Pendente", variant: "outline" as const },
    "in-progress": { label: "Em Andamento", variant: "secondary" as const },
    "success": { label: "Enviado", variant: "success" as const },
    "error": { label: "Falha", variant: "destructive" as const },
  };

  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className="flex items-center">
      {icon}
      {config.label}
    </Badge>
  );
};

export default function DataTable<T>({ columns, data, emptyState, className }: DataTableProps<T>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead 
                  key={index}
                  className={column.className}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyState || "Nenhum dado encontrado"}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className={column.className}>
                      {column.cell
                        ? column.cell(row)
                        : String(row[column.accessorKey] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
