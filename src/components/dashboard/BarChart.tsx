
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BarChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
  color?: string;
  className?: string;
}

export default function BarChart({ data, title, color = "#3B82F6", className }: BarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsBarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover p-2 border rounded-md shadow-sm">
                      <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
