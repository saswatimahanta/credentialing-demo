// @ts-nocheck
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#6366F1", "#EF4444"]; // In Progress, Committee Review, Approved, Initiated, Denied

// const donutChartData = [
//   { name: 'In Progress', value: 75 },
//   { name: 'Committee Review', value: 62 },
//   { name: 'Approved', value: 50 },
//   { name: 'Initiated', value: 38 },
//   { name: 'Denied', value: 25 },
// ];


export function StatusPieChart({data}) {
  const donutChartData = data
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Credentialing Status Distribution</CardTitle>
        <CardDescription>
          Overview of all application statuses.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={donutChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {donutChartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
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
