// A component for the small sparkline/area charts in KPI cards
'use client';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface TinyAreaChartProps {
    data: { month: string; value: number }[];
}

export function TinyAreaChart({ data }: TinyAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
        <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUv)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
