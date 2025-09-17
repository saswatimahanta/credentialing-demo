
'use client';

import { TrendingUp } from 'lucide-react';
import { DonutChart, Legend } from '@tremor/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { donutChartData } from '@/lib/mock-data';

const colors = ["green", "red", "orange", "blue"];

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat('us').format(number).toString()}`;

export function StatusDonutChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Credentialing Status Distribution</CardTitle>
        <CardDescription>
          Overview of all application statuses.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
          <DonutChart
            data={donutChartData}
            category="value"
            index="name"
            valueFormatter={valueFormatter}
            colors={colors}
            className="w-full h-48"
          />
          <Legend categories={donutChartData.map(d => d.name)} colors={colors} className="mt-4 flex-wrap" />
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
