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
import mockDatabase from '../committee-review/mockDatabase';



export function MarketDistributionChart() {
  const providers = mockDatabase.getProviders();
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
            {(Object.entries(
              providers.reduce((acc, provider) => {
                acc[provider.market] = (acc[provider.market] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ) as [string, number][]).map(([market, count]) => {
              const percentage = providers.length > 0 ? (count / providers.length) * 100 : 0;
              const colors: Record<string, string> = {
                CA: '#e3f2fd',
                TX: '#fff3e0',
                NY: '#f3e5f5',
                FL: '#e8f5e8',
                IL: '#fff8e1',
              };
              return (
                <div key={market} className="">
                  <div
                    className="p-4 rounded-md border text-center flex flex-col items-center justify-center gap-1"
                    style={{ backgroundColor: colors[market] || '#f5f5f5' }}
                  >
                    <div className="text-2xl font-bold text-primary">{count}</div>
                    <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                      {market}
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
