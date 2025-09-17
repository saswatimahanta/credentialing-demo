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

const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"];

const donutChartData = [
  { name: 'Approved', value: 890 },
  { name: 'Rejected', value: 110 },
  { name: 'Pending Review', value: 250 },
  { name: 'In-Progress', value: 95 },
];

export function StatusPieChart() {
  return (
    <Card className="flex flex-col">
  <CardHeader>
    <CardTitle>Credentialing Status Distribution</CardTitle>
    <CardDescription>
      Overview of all application statuses.
    </CardDescription>
  </CardHeader>

  <CardContent className="flex-1 pb-0">
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

  <CardFooter className="flex-col items-start gap-2 text-sm">
    <div className="flex gap-2 font-medium leading-none">
      Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    </div>
    <div className="leading-none text-muted-foreground">
      Showing total applications for the last 6 months
    </div>
  </CardFooter>
</Card>
  );
}
