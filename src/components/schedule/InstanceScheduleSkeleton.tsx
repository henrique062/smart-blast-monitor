
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function InstanceScheduleSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="h-20 bg-muted/50"></CardHeader>
      <CardContent className="h-40 bg-muted/30"></CardContent>
    </Card>
  );
}
