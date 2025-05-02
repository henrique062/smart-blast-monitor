
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  className?: string;
  color?: "default" | "success" | "warning" | "destructive" | "info";
}

export default function StatusCard({ title, value, icon, className, color = "default" }: StatusCardProps) {
  const colorClasses = {
    default: "bg-card text-foreground",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-info/10 text-info border-info/20",
  };

  return (
    <Card className={cn(colorClasses[color], "border", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 opacity-70">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
