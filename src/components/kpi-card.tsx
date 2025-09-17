import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TinyAreaChart } from './charts/tiny-area-chart';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  trendData: { month: string; value: number }[];
}

export function KpiCard({ title, value, change, description, trendData }: KpiCardProps) {
  const isPositive = change.startsWith('+');
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <div className="flex justify-between items-end">
            <CardTitle className="text-4xl font-bold text-primary">{value}</CardTitle>
            <div className="w-24 h-10">
                <TinyAreaChart data={trendData} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
