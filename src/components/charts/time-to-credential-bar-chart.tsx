'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { barChartData } from '@/lib/mock-data';


export function TimeToCredentialBarChart({ barChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Time to Credential</CardTitle>
        <CardDescription>Average time in days per application source (last 6 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar dataKey="avgTime" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg. Time (days)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
