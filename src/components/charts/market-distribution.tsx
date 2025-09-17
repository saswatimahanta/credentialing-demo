// @ts-nocheck
// Removed recharts import (unused) and MUI components to avoid missing dependency
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
// Replaced MUI Box / Typography with standard elements + Tailwind classes
export function MarketDistributionChart() {
  const total = 250;
  const markets = [
    { code: 'CA', count: 75 },
    { code: 'TX', count: 75 },
    { code: 'NY', count: 63 },
    { code: 'FL', count: 37 }
  ];
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Market Distribution</CardTitle>
        <CardDescription>
          Overview of all application statuses.
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="w-full h-auto">
          <div className="grid grid-cols-2 gap-4">
            {markets.map(m => {
              const percentage = (m.count / total) * 100;
              const colors: Record<string, string> = {
                CA: '#e3f2fd',
                TX: '#fff3e0',
                NY: '#f3e5f5',
                FL: '#e8f5e8'
              };
              return (
                <div key={m.code}>
                  <div
                    className="p-4 rounded-md border text-center flex flex-col items-center justify-center gap-1"
                    style={{ backgroundColor: colors[m.code] || '#f5f5f5' }}
                  >
                    <div className="text-2xl font-bold text-primary">{m.count}</div>
                    <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      {m.code}
                    </div>
                    <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="flex gap-2 font-medium leading-none">
      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    </div>
    <div className="leading-none text-muted-foreground">
      Showing total applications for the last 6 months
    </div>
  </CardFooter> */}
    </Card>
  );
}
